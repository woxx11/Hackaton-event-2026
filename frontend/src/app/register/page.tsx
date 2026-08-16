import Link from "next/link";
import Image from "next/image";
import { registerCompanyAction } from "@/lib/actions/auth";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { LanguageSwitcher } from "@/components/shell/LanguageSwitcher";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { FadeIn } from "@/components/ui/Motion";

export default async function RegisterPage() {
  const { locale, t } = await getDictionary();

  return (
    <div className="auth-backdrop relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher locale={locale} />
      </div>
      <FadeIn className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image src="/logo.png" alt={t.common.appName} width={96} height={96} priority className="mx-auto h-24 w-24 object-contain drop-shadow-sm" />
          <h1 className="mt-2 text-3xl font-black tracking-tight text-primary">{t.common.appName}</h1>
          <p className="mt-1 text-sm text-muted">{t.auth.register.subtitle}</p>
        </div>

        <div className="rounded-3xl border border-white/70 bg-surface p-7 shadow-xl shadow-primary/10">
          <p className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-success">{t.auth.register.eyebrow}</p>
          <RegisterForm action={registerCompanyAction} t={t} />
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          {t.auth.register.hasAccount}{" "}
          <Link href="/login" className="font-semibold text-primary hover:text-primary-hover">
            {t.auth.register.loginLink}
          </Link>
        </p>
      </FadeIn>
    </div>
  );
}
