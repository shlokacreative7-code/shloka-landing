import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex shrink-0 items-center justify-center gap-2.5 overflow-hidden rounded-full font-bold leading-tight transition-[background-color,border-color,box-shadow,transform] duration-300 ease-out-expo active:scale-[0.98] disabled:cursor-progress disabled:opacity-70";

// Primary is navy in the light theme and gold in the dark theme. A sheen sweeps across on hover.
const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary hover:shadow-glow before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/2 before:w-1/3 before:-skew-x-12 before:bg-white/25 before:opacity-0 before:transition-[left,opacity] before:duration-700 hover:before:left-[120%] hover:before:opacity-100 motion-reduce:before:hidden",
  ghost: "border-[1.5px] border-line text-ink hover:border-ink",
};

// Every size stays at or above the 44px tap target.
const sizes: Record<Size, string> = {
  sm: "min-h-11 px-5 text-base",
  md: "min-h-[3.5rem] px-7 text-[1.0625rem]",
  lg: "min-h-[3.75rem] px-8 text-[1.0625rem]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

type LinkButtonProps = CommonProps & { href: string } & Omit<ComponentProps<"a">, "className" | "children">;
type NativeButtonProps = CommonProps & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { variant = "primary", size = "md", arrow = true, className, children, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);
  const content = (
    <>
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden="true"
          strokeWidth={2}
          className="size-5 transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
        />
      )}
    </>
  );

  if (typeof rest.href === "string") {
    const anchorProps = rest as Omit<LinkButtonProps, keyof CommonProps>;
    return (
      <a className={classes} {...anchorProps}>
        {content}
      </a>
    );
  }

  const buttonProps = rest as Omit<NativeButtonProps, keyof CommonProps>;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
