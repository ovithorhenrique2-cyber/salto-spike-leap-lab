CREATE TABLE public.pix_config (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  bank text NOT NULL DEFAULT 'Banco do Brasil',
  key_type text NOT NULL DEFAULT 'cpf',
  pix_key text,
  receiver_name text NOT NULL DEFAULT '',
  receiver_city text NOT NULL DEFAULT '',
  amount_cents integer NOT NULL DEFAULT 1500,
  verified boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pix_config TO anon, authenticated;
GRANT INSERT, UPDATE ON public.pix_config TO authenticated;
GRANT ALL ON public.pix_config TO service_role;
ALTER TABLE public.pix_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pix read when verified" ON public.pix_config FOR SELECT TO anon, authenticated
  USING ((verified AND pix_key IS NOT NULL) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin pix write" ON public.pix_config FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.pix_config_guard() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.pix_key IS NOT NULL THEN
    NEW.pix_key := regexp_replace(NEW.pix_key, '\D', '', 'g');
    IF NEW.pix_key = '' THEN NEW.pix_key := NULL; END IF;
  END IF;
  IF NEW.pix_key IS NOT NULL AND length(NEW.pix_key) <> 11 THEN
    RAISE EXCEPTION 'CPF deve ter exatamente 11 dígitos';
  END IF;
  IF TG_OP = 'UPDATE' AND NEW.pix_key IS DISTINCT FROM OLD.pix_key AND NEW.verified = OLD.verified THEN
    NEW.verified := false;
  END IF;
  IF NEW.pix_key IS NULL THEN NEW.verified := false; END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER pix_config_guard BEFORE INSERT OR UPDATE ON public.pix_config FOR EACH ROW EXECUTE FUNCTION public.pix_config_guard();
INSERT INTO public.pix_config (id) VALUES (1);

CREATE TABLE public.payment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  plan_slug text NOT NULL DEFAULT 'premium',
  amount_cents integer NOT NULL DEFAULT 1500,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','rejected')),
  payer_name text,
  admin_notes text,
  confirmed_at timestamptz,
  confirmed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.payment_requests TO authenticated;
GRANT ALL ON public.payment_requests TO service_role;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own requests read" ON public.payment_requests FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "own requests insert" ON public.payment_requests FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND status = 'pending' AND confirmed_at IS NULL AND confirmed_by IS NULL);
CREATE POLICY "admin requests update" ON public.payment_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.payment_request_confirm() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.amount_cents := COALESCE((SELECT amount_cents FROM pix_config WHERE id = 1), 1500);
    RETURN NEW;
  END IF;
  IF NEW.status = 'paid' AND OLD.status <> 'paid' THEN
    NEW.confirmed_at := now();
    NEW.confirmed_by := auth.uid();
    UPDATE subscriptions SET status = 'active', provider = 'pix_manual', updated_at = now()
      WHERE user_id = NEW.user_id AND plan_slug = NEW.plan_slug;
    IF NOT FOUND THEN
      INSERT INTO subscriptions (user_id, plan_slug, status, provider, notes)
      VALUES (NEW.user_id, NEW.plan_slug, 'active', 'pix_manual', 'Pix conferido no extrato');
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER payment_request_confirm BEFORE INSERT OR UPDATE ON public.payment_requests FOR EACH ROW EXECUTE FUNCTION public.payment_request_confirm();