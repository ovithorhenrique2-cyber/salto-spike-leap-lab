import { useState } from "react";
import { toast } from "sonner";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";

export function GoogleButton({ label = "Continuar com Google" }: { label?: string }) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/entrar" });
        if (r.error) {
          toast.error("Não foi possível entrar com Google.");
          setLoading(false);
          return;
        }
        if (r.redirected) return;
        window.location.assign("/painel");
      }}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden><path fill="currentColor" d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.66 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 6.26 12 6.26c1.83 0 3.06.78 3.76 1.45l2.57-2.47C16.7 3.72 14.56 2.8 12 2.8 6.92 2.8 2.8 6.92 2.8 12s4.12 9.2 9.2 9.2c5.31 0 8.83-3.73 8.83-8.99 0-.6-.07-1.06-.15-1.51Z"/></svg>
      {label}
    </Button>
  );
}

export function Divider() {
  return (
    <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
      <span className="h-px flex-1 bg-border" />ou<span className="h-px flex-1 bg-border" />
    </div>
  );
}
