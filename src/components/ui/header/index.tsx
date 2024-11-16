import { useMediaQuery } from "@/libs/hooks/app";
import React, { Suspense } from "react";
import HeaderLoader from "./header-loader";

const HeaderDesktop = React.lazy(() => import("./header-desktop"));
const HeaderMobile = React.lazy(() => import("./header-mobile"));

export default function Header() {
  const { isMobile } = useMediaQuery();

  // TODO: use skeleton for loading screen
  if (isMobile) {
    return (
      <Suspense fallback={<HeaderLoader />}>
        <HeaderMobile />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<HeaderLoader />}>
      <HeaderDesktop />
    </Suspense>
  );
}
