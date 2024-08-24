import { SVGProps } from "react";

export interface IIconProps extends Partial<SVGProps<SVGSVGElement>> {
  className?: string;
  pathClassName?: string;
}
