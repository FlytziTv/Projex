"use client";
import { deleteAccount } from "@/lib/api/account";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

type Props = { onClose: () => void };

export default function DeleteAccountAlert({ onClose }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("profile");

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteAccount();
      localStorage.removeItem("projex_token");
      onClose();
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog.Root open onOpenChange={onClose}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-5 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-[525px] data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          <AlertDialog.Title className="font-heading text-base leading-none font-medium">
            {t("deleteConfirm")}
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-muted-foreground">
            {t("deleteMessage")}
          </AlertDialog.Description>
          {error && (
            <div className="mt-3 p-2 rounded bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}
          <div className="flex flex-row items-center justify-end gap-4 mt-1">
            <AlertDialog.Cancel asChild>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="bg-transparent hover:bg-foreground/10 border text-foreground font-medium py-2 px-6 rounded-md transition-colors duration-200 cursor-pointer"
              >
                {t("cancel")}
              </button>
            </AlertDialog.Cancel>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-destructive/80 hover:bg-destructive/50 text-foreground font-medium py-2 px-6 rounded-md transition-colors disabled:cursor-not-allowed disabled:bg-foreground/50 disabled:opacity-50 duration-200 cursor-pointer"
            >
              {isLoading ? t("deleting") : t("deleteButton")}
            </button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
