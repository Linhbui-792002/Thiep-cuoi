import { getCachedSiteConfig } from "@/lib/data";
import { INVITATION_SIDES } from "@/lib/invitation-side";
import { ThemeProvider } from "@/components/invitation/ThemeProvider";
import Link from "next/link";

export const revalidate = 60;

export default async function Home() {
  const config = await getCachedSiteConfig();

  return (
    <ThemeProvider theme={config.theme} className="cinelove-page">
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
        <p className="font-script text-[22px] text-olive">We got married</p>
        <h1 className="mt-4 font-name text-[34px] font-normal leading-none text-olive">
          {config.brideName}
          <span className="mx-1.5">&</span>
          {config.groomName}
        </h1>
        <p className="mt-6 max-w-[280px] font-serif text-sm leading-relaxed text-gray-600">
          Mời bạn chọn thiệp theo gia đình để xem đúng lễ, giờ và địa điểm.
        </p>

        <div className="mt-10 flex w-full max-w-[320px] flex-col gap-3">
          <Link
            href={INVITATION_SIDES.bride.path}
            className="rounded-full bg-olive px-6 py-3.5 font-label text-[11px] font-medium uppercase tracking-[0.18em] text-white"
          >
            {INVITATION_SIDES.bride.label} · {INVITATION_SIDES.bride.ceremony}
          </Link>
          <Link
            href={INVITATION_SIDES.groom.path}
            className="rounded-full border border-[var(--primary)] px-6 py-3.5 font-label text-[11px] font-medium uppercase tracking-[0.18em] text-olive"
          >
            {INVITATION_SIDES.groom.label} · {INVITATION_SIDES.groom.ceremony}
          </Link>
        </div>
      </div>
    </ThemeProvider>
  );
}
