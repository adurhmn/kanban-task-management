import { IIconProps } from "@/libs/types";

export default function IconLogoMobile({
  className,
  width = "153",
  height = "26",
  ...props
}: IIconProps) {
  return (
    <svg
      width="24"
      height="25"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g fill="#635FC7" fill-rule="evenodd">
        <rect width="6" height="25" rx="2" />
        <rect opacity=".75" x="9" width="6" height="25" rx="2" />
        <rect opacity=".5" x="18" width="6" height="25" rx="2" />
      </g>
    </svg>
  );
}
