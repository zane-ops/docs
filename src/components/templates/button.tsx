import { cn } from "~/lib/utils";

const buttonClassNames = [
  "border border-border",
  "bg-(--sl-color-bg-nav) dark:bg-bg hover:dark:bg-(--sl-color-grey-6)",
  "focus:dark:bg-bg/80 focus:border-(--sl-color-white)",
  "hover:border-(--sl-color-white) hover:bg-(--sl-color-gray-6)",
  "transition-colors rounded-lg shadow-sm",
  "inline-flex items-center justify-center",
  "px-4 py-2"
];

export function Button({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={cn(buttonClassNames, className)} />;
}

export function LinkButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} className={cn(buttonClassNames, className)} />;
}
