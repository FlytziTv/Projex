export function BlockDelete({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="border border-destructive/40 rounded-sm w-full">
      <div className="bg-muted/20 p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-semibold">Delete Account</h4>
          <p className="text-sm text-muted-foreground">
            This action is irreversible. All your data will be permanently
            deleted, including your projects, tasks, and account information.
            Please make sure to back up any important data before proceeding. If
            you are sure about this action, click the button below to delete
            your account.
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-end p-3 bg-destructive/10 border-t border-destructive/20">
        <button
          onClick={onOpen}
          className="text-sm font-medium h-7 px-3 bg-destructive text-foreground hover:bg-destructive/80 active:scale-95 rounded transition-all duration-200"
        >
          Delete Personal Account
        </button>
      </div>
    </div>
  );
}
