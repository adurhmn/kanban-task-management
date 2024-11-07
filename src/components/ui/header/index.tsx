import { useMediaQuery } from "@/libs/hooks/app";
import React, { Suspense } from "react";

const HeaderDesktop = React.lazy(() => import("./header-desktop"))
const HeaderMobile = React.lazy(() => import("./header-mobile"))

export default function Header () {
  const {isMobile}  = useMediaQuery()

  // TODO: use skeleton for loading screen
  if (isMobile) {
    return <Suspense fallback={<div>Loading...</div>}>
      <HeaderMobile />
    </Suspense>
  }

  return <Suspense fallback={<div>Loading...</div>}>
    <HeaderDesktop/>
  </Suspense>
}