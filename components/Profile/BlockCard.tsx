import { cn } from "@/lib/utils";

export function BlockCard({
  title,
  description,
  message,
  children,
  button,
  onclick,
  className,
}: {
  title: string;
  description: string;
  message: string;
  children: React.ReactNode;
  button?: string;
  onclick?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border border-border/40 rounded-sm w-full flex flex-col",
        className,
      )}
    >
      <div className="bg-muted/20 p-4 flex flex-col gap-4 h-full">
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-semibold">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
      <div className="flex flex-row items-center justify-between p-3 border-t border-border/40 ">
        <p className="pl-1 text-sm text-muted-foreground h-7 content-center">
          {message}
        </p>
        {button && (
          <button
            onClick={onclick}
            className="text-sm font-medium h-7 px-4 bg-foreground text-background hover:bg-foreground/80 active:scale-95 rounded transition-all duration-200"
          >
            {button}
          </button>
        )}
      </div>
    </div>
  );
}
