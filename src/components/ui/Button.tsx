import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  "primary" | "secondary" | "accent" | "outline" | "light" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold " +
  "transition-all duration-150 active:translate-y-px " +
  "disabled:cursor-not-allowed disabled:opacity-60 disabled:active:translate-y-0";

const variants: Record<ButtonVariant, string> = {
  // 16.7:1 white-on-navy.
  primary:
    "bg-primary-800 text-white shadow-sm hover:bg-primary-600 hover:shadow-md",
  secondary:
    "border border-primary-300 bg-white text-primary-700 hover:border-primary-500 hover:bg-primary-50 hover:shadow-sm",
  // Gold sits behind navy text at 6.9:1.
  accent:
    "bg-accent-500 text-primary-900 shadow-sm hover:bg-accent-400 hover:shadow-md",
  // For navy surfaces only. Overriding `secondary` with utility classes does
  // not work: both declarations land in the same layer, so the winner is CSS
  // source order rather than the order written in the class attribute, which
  // silently produced white text on a white button.
  outline:
    "border border-primary-300/70 bg-transparent text-white hover:border-accent-500 hover:bg-primary-700/70",
  // The reference "Learn more" button on the dark event boxes: light neutral.
  light: "bg-neutral-200 text-neutral-800 shadow-sm hover:bg-white",
  ghost: "text-primary-700 hover:bg-primary-50",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClass(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
