"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { APP_LOGO_PATH, APP_NAME } from "@/lib/branding";

type AppLogoProps = {
  className?: string;
  /** Set true only if the logo image is icon-only (this lockup already includes the name). */
  showName?: boolean;
};

export function AppLogo({ className = "", showName = false }: AppLogoProps) {
  const [logoMissing, setLogoMissing] = useState(false);

  if (logoMissing) {
    return (
      <Link href="/" className={`app-logo ${className}`} aria-label={APP_NAME}>
        <span className="app-logo__name truncate">{APP_NAME}</span>
      </Link>
    );
  }

  return (
    <Link href="/" className={`app-logo ${className}`} aria-label={APP_NAME}>
      <Image
        src={APP_LOGO_PATH}
        alt={APP_NAME}
        width={140}
        height={48}
        className="app-logo__lockup h-9 w-auto object-contain sm:h-10"
        onError={() => setLogoMissing(true)}
        priority
      />
      {showName && (
        <span className="app-logo__name truncate">{APP_NAME}</span>
      )}
    </Link>
  );
}
