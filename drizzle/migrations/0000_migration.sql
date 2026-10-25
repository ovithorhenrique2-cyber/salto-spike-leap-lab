
-- Roles
create type public.app_role as enum ('admin', 'user');
create type public.access_level as enum ('free', 'premium');
create type public.pub_status as enum ('draft', 'published', 'archived');
create type public.skill_level as enum ('iniciante', 'intermediario', 'avancado');

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text,
  level public.skill_level,
  modality text,
  goal text,
  training_days text[] not null default '{}',
  location text,
  equipment text[] not null default '{}',
  practice_time text,
  strength_experience text,
  goal_description text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "own roles readable" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "admin manage roles" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create policy "own profile read" on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "own profile insert" on public.profiles for insert to authenticated
  with check (id = auth.uid());
create policy "own profile update" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- signup trigger: profile + role (first user becomes admin)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', ''), new.email);
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- SUBSCRIPTIONS
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  plan_slug text not null default 'premium',
  status text not null default 'inactive' check (status in ('active','inactive','canceled','pending')),
  provider text,
  provider_subscription_id text,
  current_period_end timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.subscriptions to authenticated;
grant all on public.subscriptions to service_role;
alter table public.subscriptions enable row level security;
create policy "own subs read" on public.subscriptions for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "admin subs write" on public.subscriptions for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.has_premium(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(_user_id, 'admin') or exists (
    select 1 from public.subscriptions
    where user_id = _user_id and status = 'active'
      and (current_period_end is null or current_period_end > now()))
$$;

-- PROGRAMS
create table public.training_programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null default 'Fundamentos de salto',
  goal text not null default 'salto',
  level public.skill_level not null default 'iniciante',
  location text not null default 'qualquer',
  equipment text[] not null default '{}',
  duration_weeks int not null default 4,
  session_minutes int not null default 45,
  frequency text not null default '3x por semana',
  safety_notes text not null default '',
  author text not null default '',
  cover_url text,
  access public.access_level not null default 'free',
  status public.pub_status not null default 'draft',
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.training_programs to anon;
grant select, insert, update, delete on public.training_programs to authenticated;
grant all on public.training_programs to service_role;
alter table public.training_programs enable row level security;
create policy "published programs public" on public.training_programs for select to anon, authenticated
  using (status = 'published' or public.has_role(auth.uid(), 'admin'));
create policy "admin programs write" on public.training_programs for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.can_access_program(_program_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(auth.uid(), 'admin') or exists (
    select 1 from public.training_programs p
    where p.id = _program_id and p.status = 'published'
      and auth.uid() is not null
      and (p.access = 'free' or public.has_premium(auth.uid())))
$$;

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  goal text not null default '',
  instructions text not null default '',
  default_sets int not null default 3,
  default_reps text not null default '8',
  default_rest_seconds int not null default 60,
  equipment text[] not null default '{}',
  level public.skill_level not null default 'iniciante',
  media_url text,
  technical_points text not null default '',
  common_mistakes text not null default '',
  safety_notes text not null default '',
  is_plyometric boolean not null default false,
  status public.pub_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.exercises to authenticated;
grant all on public.exercises to service_role;
alter table public.exercises enable row level security;
create policy "admin exercises write" on public.exercises for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.program_sessions (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.training_programs(id) on delete cascade,
  title text not null,
  description text not null default '',
  position int not null default 1,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.program_sessions to authenticated;
grant all on public.program_sessions to service_role;
alter table public.program_sessions enable row level security;
create policy "sessions read if access" on public.program_sessions for select to authenticated
  using (public.can_access_program(program_id));
create policy "admin sessions write" on public.program_sessions for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.session_exercises (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.program_sessions(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete restrict,
  position int not null default 1,
  sets int,
  reps text,
  rest_seconds int,
  notes text
);
grant select, insert, update, delete on public.session_exercises to authenticated;
grant all on public.session_exercises to service_role;
alter table public.session_exercises enable row level security;
create policy "session ex read if access" on public.session_exercises for select to authenticated
  using (exists (select 1 from public.program_sessions s where s.id = session_id and public.can_access_program(s.program_id)));
create policy "admin session ex write" on public.session_exercises for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create policy "exercises read if in accessible program" on public.exercises for select to authenticated
  using (public.has_role(auth.uid(), 'admin') or exists (
    select 1 from public.session_exercises se join public.program_sessions s on s.id = se.session_id
    where se.exercise_id = exercises.id and public.can_access_program(s.program_id)));

-- LOGS
create table public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  program_id uuid references public.training_programs(id) on delete set null,
  session_id uuid references public.program_sessions(id) on delete set null,
  program_title text,
  session_title text,
  started_at timestamptz,
  completed_at timestamptz not null default now(),
  duration_seconds int,
  status text not null default 'completed' check (status in ('completed','partial')),
  notes text check (char_length(notes) <= 1000),
  created_at timestamptz not null default now()
);
grant select, insert, delete on public.workout_logs to authenticated;
grant all on public.workout_logs to service_role;
alter table public.workout_logs enable row level security;
create policy "own logs read" on public.workout_logs for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "own logs insert" on public.workout_logs for insert to authenticated
  with check (user_id = auth.uid() and (session_id is null or exists (
    select 1 from public.program_sessions s where s.id = session_id and public.can_access_program(s.program_id))));
create policy "own logs delete" on public.workout_logs for delete to authenticated using (user_id = auth.uid());

create table public.exercise_logs (
  id uuid primary key default gen_random_uuid(),
  workout_log_id uuid not null references public.workout_logs(id) on delete cascade,
  exercise_id uuid references public.exercises(id) on delete set null,
  exercise_title text,
  sets_completed int not null default 0,
  sets_planned int,
  notes text
);
grant select, insert on public.exercise_logs to authenticated;
grant all on public.exercise_logs to service_role;
alter table public.exercise_logs enable row level security;
create policy "own ex logs read" on public.exercise_logs for select to authenticated
  using (exists (select 1 from public.workout_logs w where w.id = workout_log_id and (w.user_id = auth.uid() or public.has_role(auth.uid(),'admin'))));
create policy "own ex logs insert" on public.exercise_logs for insert to authenticated
  with check (exists (select 1 from public.workout_logs w where w.id = workout_log_id and w.user_id = auth.uid()));

create table public.jump_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  measured_on date not null default current_date,
  standing_reach_cm numeric(5,1) check (standing_reach_cm is null or (standing_reach_cm between 100 and 320)),
  jump_reach_cm numeric(5,1) check (jump_reach_cm is null or (jump_reach_cm between 100 and 420)),
  vertical_cm numeric(5,1) generated always as (
    case when standing_reach_cm is not null and jump_reach_cm is not null and jump_reach_cm > standing_reach_cm
    then jump_reach_cm - standing_reach_cm end) stored,
  method text not null,
  notes text check (char_length(notes) <= 500),
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.jump_measurements to authenticated;
grant all on public.jump_measurements to service_role;
alter table public.jump_measurements enable row level security;
create policy "own measurements" on public.jump_measurements for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- CONTENT
create table public.educational_contents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null default '',
  category text not null default 'Aproximação para o ataque',
  body text not null default '',
  cover_url text,
  video_url text,
  level public.skill_level not null default 'iniciante',
  read_minutes int not null default 5,
  access public.access_level not null default 'free',
  status public.pub_status not null default 'draft',
  author text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.educational_contents to anon;
grant select, insert, update, delete on public.educational_contents to authenticated;
grant all on public.educational_contents to service_role;
alter table public.educational_contents enable row level security;
create policy "content read" on public.educational_contents for select to anon, authenticated
  using (public.has_role(auth.uid(),'admin') or (status = 'published' and (access = 'free' or public.has_premium(auth.uid()))));
create policy "admin content write" on public.educational_contents for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- catalog (metadata only, includes locked premium items)
create or replace function public.content_catalog()
returns table (id uuid, title text, summary text, category text, cover_url text, level public.skill_level, read_minutes int, access public.access_level, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select id, title, summary, category, cover_url, level, read_minutes, access, created_at
  from public.educational_contents where status = 'published' order by created_at desc
$$;
grant execute on function public.content_catalog() to anon, authenticated;

-- PLANS & SETTINGS
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  price_cents int,
  price_label text,
  billing_period text not null default 'mensal',
  features text[] not null default '{}',
  cta_label text not null default 'Saiba mais',
  active boolean not null default true,
  position int not null default 1,
  updated_at timestamptz not null default now()
);
grant select on public.plans to anon;
grant select, insert, update, delete on public.plans to authenticated;
grant all on public.plans to service_role;
alter table public.plans enable row level security;
create policy "plans public" on public.plans for select to anon, authenticated using (active or public.has_role(auth.uid(),'admin'));
create policy "admin plans write" on public.plans for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon;
grant select, insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "settings public" on public.site_settings for select to anon, authenticated using (true);
create policy "admin settings write" on public.site_settings for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Free monthly workout limit enforcement
create or replace function public.enforce_free_limit()
returns trigger language plpgsql security definer set search_path = public as $$
declare lim int;
begin
  if public.has_premium(new.user_id) then return new; end if;
  select nullif((value->>'limit'),'')::int into lim from public.site_settings where key = 'free_monthly_workouts';
  if lim is not null and lim > 0 and (select count(*) from public.workout_logs
     where user_id = new.user_id and completed_at >= date_trunc('month', now())) >= lim then
    raise exception 'Limite mensal de treinos do plano gratuito atingido (%).', lim;
  end if;
  return new;
end; $$;
create trigger workout_free_limit before insert on public.workout_logs
  for each row execute function public.enforce_free_limit();

-- Admin metrics (aggregates only)
create or replace function public.admin_metrics()
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'Acesso negado'; end if;
  return json_build_object(
    'users', (select count(*) from public.profiles),
    'onboarded', (select count(*) from public.profiles where onboarding_completed),
    'workouts_7d', (select count(*) from public.workout_logs where completed_at > now() - interval '7 days'),
    'workouts_total', (select count(*) from public.workout_logs),
    'measurements_total', (select count(*) from public.jump_measurements),
    'active_premium', (select count(*) from public.subscriptions where status = 'active'),
    'programs_published', (select count(*) from public.training_programs where status = 'published'),
    'contents_published', (select count(*) from public.educational_contents where status = 'published')
  );
end; $$;
grant execute on function public.admin_metrics() to authenticated;

-- SEED: settings & plans (test configuration values)
insert into public.site_settings (key, value) values
('landing', '{"hero_title":"Seu próximo salto começa com o treino certo.","hero_subtitle":"Treine impulsão, desenvolva sua técnica e acompanhe sua evolução no vôlei com um plano organizado."}'),
('coach', '{"name":"[Nome do treinador — editar no painel]","headline":"[Texto provisório] Apresentação do criador do Salto Pro","bio":"[Texto provisório — substitua no painel administrativo] Descreva aqui sua trajetória competitiva real no vôlei, sua metodologia de treino e a proposta do Salto Pro. Não inclua títulos, certificações ou resultados que não possam ser comprovados.","methodology":"[Texto provisório] Explique como os treinos são organizados, como é feita a progressão e quem revisa os programas.","photo_url":""}'),
('contact', '{"whatsapp_url":"","email":"","instagram_url":"","coaching_url":"","company_info":"[Razão social e CNPJ — editar no painel]"}'),
('free_monthly_workouts', '{"limit":8}');

insert into public.plans (slug, name, description, price_cents, price_label, billing_period, features, cta_label, position) values
('free','Gratuito','Para começar a treinar e registrar sua evolução.',0,'R$ 0','sempre',array['Conteúdos gratuitos','Perfil e onboarding','Registro de medições de salto','Treinos gratuitos com limite mensal configurável'],'Criar conta grátis',1),
('premium','Premium','Acesso aos programas premium e recursos adicionais.',4900,null,'mensal',array['Todos os programas premium','Conteúdos técnicos premium','Treinos sem limite mensal','Histórico completo'],'Quero o Premium',2),
('program','Programa digital','Compra avulsa de um programa completo.',7900,null,'por compra',array['Programa estruturado por semanas','Acesso ao programa adquirido'],'Tenho interesse',3),
('coaching','Acompanhamento individual','Orientação individual com o criador da plataforma.',null,'Sob consulta','sob consulta',array['Conversa inicial sobre objetivos','Planejamento conforme sua rotina','Ajustes periódicos combinados com o treinador'],'Solicitar contato',4);

-- SEED: example exercises & programs (clearly labeled as pending review)
with ex as (
  insert into public.exercises (title, goal, instructions, default_sets, default_reps, default_rest_seconds, equipment, level, technical_points, common_mistakes, safety_notes, is_plyometric) values
  ('Agachamento livre (peso corporal)','Força de membros inferiores','1. Pés na largura dos ombros.\n2. Desça levando o quadril para trás e para baixo.\n3. Mantenha o tronco firme e os calcanhares no chão.\n4. Suba empurrando o chão.',3,'12',60,'{}','iniciante','Joelhos alinhados com a ponta dos pés; coluna neutra.','Joelhos caindo para dentro; tirar os calcanhares do chão.','Use amplitude confortável. Interrompa em caso de dor.',false),
  ('Salto vertical com contramovimento','Potência e coordenação do salto','1. Em pé, pés na largura do quadril.\n2. Faça um agachamento rápido levando os braços para trás.\n3. Salte o mais alto possível, lançando os braços para cima.\n4. Aterrisse suave, com joelhos flexionados.',3,'5',90,'{}','iniciante','Braços sincronizados com a extensão das pernas; aterrissagem silenciosa.','Aterrissar com joelhos estendidos; perder o alinhamento dos joelhos.','Exercício pliométrico: priorize qualidade, descanse bem entre séries e pare se sentir dor.',true),
  ('Pogo jumps','Rigidez de tornozelo e reatividade','1. Em pé, pernas quase estendidas.\n2. Faça saltos curtos e rápidos usando principalmente os tornozelos.\n3. Mantenha o contato com o solo o mais breve possível.',3,'20 s',60,'{}','iniciante','Tronco alto; contato com a parte da frente do pé.','Flexionar demais os joelhos; saltos lentos.','Pliométrico de baixa intensidade. Evite se houver dor no tendão de Aquiles.',true),
  ('Passada de aproximação (sem bola)','Coordenação da aproximação para o ataque','1. Posicione-se a cerca de 3 a 4 passos da rede (ou de uma linha).\n2. Execute a sequência de passos da aproximação, acelerando nos dois últimos.\n3. Finalize com o salto de ataque e braços em direção ao alto.',4,'4',60,'{}','iniciante','Últimos passos mais longos e rápidos; braços acompanhando o ritmo.','Desacelerar antes do salto; braços atrasados.','Faça em superfície adequada e com calçado apropriado.',true),
  ('Ponte de glúteos','Ativação de glúteos e posterior','1. Deitado de costas, joelhos flexionados.\n2. Eleve o quadril contraindo os glúteos.\n3. Segure 2 segundos e desça controlando.',3,'12',45,'{}','iniciante','Quadril alinhado no topo; abdômen firme.','Arquear a lombar em excesso.','Movimento controlado. Interrompa se houver desconforto lombar.',false),
  ('Mobilidade de tornozelo na parede','Preparação e mobilidade','1. De frente para a parede, um pé à frente.\n2. Leve o joelho em direção à parede sem tirar o calcanhar do chão.\n3. Volte e repita.',2,'10 cada lado',30,'{}','iniciante','Calcanhar fixo no chão; joelho na linha do pé.','Deixar o calcanhar subir.','Movimento suave, sem forçar a amplitude.',false)
  returning id, title
), p1 as (
  insert into public.training_programs (title, description, category, goal, level, location, equipment, duration_weeks, session_minutes, frequency, safety_notes, author, access, status)
  values ('Base do salto — iniciante','Programa introdutório para desenvolver força básica, coordenação e técnica de aterrissagem antes de progredir para treinos mais intensos.','Fundamentos de salto','salto','iniciante','casa','{}',4,35,'3x por semana com 1 dia de descanso entre sessões','Faça aquecimento antes de cada sessão. Exercícios de salto exigem superfície adequada e calçado apropriado. Interrompa o treino em caso de dor e procure um profissional. Informe restrições relevantes ao profissional responsável antes de iniciar.','Conteúdo de exemplo — aguardando revisão do responsável técnico','free','published')
  returning id
), p2 as (
  insert into public.training_programs (title, description, category, goal, level, location, equipment, duration_weeks, session_minutes, frequency, safety_notes, author, access, status)
  values ('Aproximação e ataque','Programa focado na coordenação da aproximação e na transferência do salto para o ataque.','Técnica de ataque','ataque','intermediario','quadra','{}',4,45,'2x por semana','Exercícios pliométricos: respeite os intervalos de descanso e interrompa em caso de dor.','Conteúdo de exemplo — aguardando revisão do responsável técnico','premium','published')
  returning id
), s as (
  insert into public.program_sessions (program_id, title, description, position)
  select id, 'Sessão A — Força e ativação', 'Foco em força básica e ativação.', 1 from p1
  union all select id, 'Sessão B — Salto e aterrissagem', 'Foco em técnica de salto.', 2 from p1
  union all select id, 'Sessão A — Aproximação', 'Coordenação de passos e braços.', 1 from p2
  returning id, title, position, program_id
)
insert into public.session_exercises (session_id, exercise_id, position)
select s.id, ex.id, x.pos from s
join (values
  ('Sessão A — Força e ativação','Mobilidade de tornozelo na parede',1),
  ('Sessão A — Força e ativação','Ponte de glúteos',2),
  ('Sessão A — Força e ativação','Agachamento livre (peso corporal)',3),
  ('Sessão B — Salto e aterrissagem','Mobilidade de tornozelo na parede',1),
  ('Sessão B — Salto e aterrissagem','Pogo jumps',2),
  ('Sessão B — Salto e aterrissagem','Salto vertical com contramovimento',3),
  ('Sessão A — Aproximação','Mobilidade de tornozelo na parede',1),
  ('Sessão A — Aproximação','Passada de aproximação (sem bola)',2),
  ('Sessão A — Aproximação','Salto vertical com contramovimento',3)
) as x(stitle, etitle, pos) on x.stitle = s.title
join ex on ex.title = x.etitle;

insert into public.educational_contents (title, summary, category, body, level, read_minutes, access, status, author) values
('Mecânica de aterrissagem: o básico','Por que aterrissar bem é parte do treino de salto.','Mecânica de aterrissagem','[Texto de exemplo — revisar antes de publicar]\n\nAterrissar com os joelhos levemente flexionados, alinhados com a ponta dos pés, ajuda a absorver o impacto de forma controlada.\n\nPontos de atenção:\n- Tocar o solo com a parte da frente do pé e depois apoiar o calcanhar.\n- Evitar que os joelhos se aproximem um do outro.\n- Manter o tronco estável.\n\nSe sentir dor ao aterrissar, interrompa o exercício e procure um profissional.','iniciante',4,'free','published','Conteúdo de exemplo — aguardando revisão do responsável técnico'),
('Coordenação dos braços no salto','Como os braços participam da impulsão.','Coordenação dos braços','[Texto de exemplo — revisar antes de publicar]\n\nNa aproximação, os braços vão para trás durante os últimos passos e são lançados para cima no momento da extensão das pernas.\n\nTreine o movimento devagar antes de aumentar a velocidade.','iniciante',3,'free','published','Conteúdo de exemplo — aguardando revisão do responsável técnico'),
('Tempo de salto no ataque','Sincronizando a aproximação com o levantamento.','Tempo de salto','[Texto de exemplo — revisar antes de publicar]\n\nO tempo de salto depende do tipo de levantamento. Observe a trajetória da bola e ajuste o início da aproximação.','intermediario',5,'premium','published','Conteúdo de exemplo — aguardando revisão do responsável técnico');
