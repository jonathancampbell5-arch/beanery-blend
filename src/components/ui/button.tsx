import * as React from "react";
function clsx(...a:any[]){return a.filter(Boolean).join(" ");}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline";
  asChild?: boolean;
  className?: string;
};

export function Button({ variant="default", className, children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition";
  const styles = {
    default: "bg-black text-white hover:opacity-90",
    secondary: "bg-neutral-200 text-black hover:bg-neutral-300",
    outline: "border border-neutral-300 bg-white hover:bg-neutral-50"
  }[variant];
  return (
    <button className={clsx(base, styles, className)} {...props}>
      {children}
    </button>
  );
}
