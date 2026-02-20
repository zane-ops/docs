import { cn } from "~/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={cn(
        "w-full px-4 py-2 rounded-md border border-border bg-bg text-(--sl-color-text) focus:outline-none focus:ring-2 focus:ring-(--sl-color-accent)",
        className
      )}
    />
  );
}
