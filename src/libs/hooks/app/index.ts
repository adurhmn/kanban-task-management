import { isDarkMode } from "@/actions/app";
import { useEffect } from "react";

export const useColorModeSync = () => {
  useEffect(() => {
    if (isDarkMode()) {
      document.getElementsByTagName("html")[0].classList.add("dark");
    }
  }, []);
};
