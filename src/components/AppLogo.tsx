"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { APP_LOGO_ICON_PATH, APP_NAME } from "@/lib/branding";

type AppLogoProps = {
  className?: string;
  showName?: boolean;
};

export function AppLogo({ className = "", showName = true }: AppLogoProps) {
  const [logoMissing, setLogoMissing] = useState(false);

  return (
    <Link href="/" className={`app-logo ${className}`} aria-label={APP_NAME}>
      {!logoMissing && (
        <span className="app-logo__icon-wrap">
          <Image
            src={APP_LOGO_ICON_PATH}
            alt=""
            width={56}
            height={56}
            className="app-logo__icon"
            onError={() => setLogoMissing(true)}
            priority
          />
        </span>
      )}
      {showName && (
        <span className="app-logo__name" aria-hidden>
          <span className="app-logo__word app-logo__word--find">Find</span>
          <span className="app-logo__word app-logo__word--your">Your</span>
          <span className="app-logo__word app-logo__word--ride">Ride</span>
        </span>
      )}
    </Link>
  );
}
