export function BlockTokens({ children }: { children?: React.ReactNode }) {
  return (
    <div className="border border-border/40 rounded-sm w-full col-span-2">
      <div className="bg-muted/20 p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-semibold">All Tokens Generated</h4>
          <p className="text-sm text-muted-foreground">
            Here you can see all the tokens you have generated, and revoke them
            if needed.
          </p>
        </div>
        {children}
      </div>
      <div className="flex flex-row items-center justify-end p-3 border-t border-border/40">
        <button className="text-sm font-medium h-7 px-3 bg-destructive text-foreground hover:bg-destructive/80 active:scale-95 rounded transition-all duration-200">
          Delete All Tokens
        </button>
      </div>
    </div>
  );
}
