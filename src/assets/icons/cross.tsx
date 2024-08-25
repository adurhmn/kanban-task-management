import { IIconProps } from "@/libs/types";

export default function IconCross({
  className,
  pathClassName,
  width = "16",
  height = "16",
  ...props
}: IIconProps) {
  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g fill="#828FA3" fillRule="evenodd" className={className}>
        <path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z" />
        <path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z" />
      </g>
    </svg>
  );
}
