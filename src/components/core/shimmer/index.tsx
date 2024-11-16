import { FC, HTMLAttributes } from "react";
import s from "./index.module.css";
import cn from "@/libs/utils/cn";

const Shimmer: FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
  return <div {...props} className={cn(s.shimmer, props.className)} />;
};

export default Shimmer;
