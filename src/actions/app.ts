import { LOCAL_KEYS } from "@/libs/constants";

export const isDarkMode = () =>
  localStorage.getItem(LOCAL_KEYS.IS_DARK_MODE) === "true";

export const toggleDarkMode = () => {
  const x = !isDarkMode();
  localStorage.setItem(LOCAL_KEYS.IS_DARK_MODE, x.toString());
  if (x) {
    document.getElementsByTagName("html")[0].classList.add("dark");
  } else {
    document.getElementsByTagName("html")[0].classList.remove("dark");
  }
};
