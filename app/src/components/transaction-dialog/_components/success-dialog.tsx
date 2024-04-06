import { FloatingCubes } from "@/components/illustrations/floating-cubes";
import { buttonVariants } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, ClipboardCopy, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface SuccessDialogProps {
  type: "deposit" | "withdrawal";
  operationAmount: number;
  transactionHash: string | null | undefined;
  copyToClipboard: () => void;
}

export default function SuccessDialog({
  type,
  operationAmount,
  transactionHash,
  copyToClipboard,
}: SuccessDialogProps) {
  const t = useTranslations("success");

  return (
    <div className="relative mx-auto flex w-[355px] flex-col gap-12 sm:w-[451px]">
      <DialogHeader className="pt-[60.5px]">
        <DialogTitle className="flex flex-col items-center gap-2">
          <CheckCircle2 size={46.67} className="text-facto-primary" strokeWidth={2} />
          {t(`title-${type}`)}
        </DialogTitle>
      </DialogHeader>
      <FloatingCubes className="rotate-[-30.47 deg] absolute left-0 right-0 mx-auto" />
      <div className="flex flex-col gap-6 rounded-2xl bg-primary-foreground p-6">
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          {t(`amount-${type}`)}
          <span className="text-base font-medium text-primary">$ {operationAmount}</span>
        </div>

        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          {t("hash")}
          <div className="flex justify-between text-primary">
            <p className="max-w-[283px] overflow-hidden text-ellipsis text-base font-medium text-primary">
              {transactionHash}
            </p>
            <ClipboardCopy
              className="cursor-pointer hover:opacity-50"
              size={24}
              onClick={copyToClipboard}
            />
          </div>
        </div>

        <a
          className={cn(buttonVariants({ variant: "link" }), "w-fit bg-card")}
          target="_blank"
          rel="noreferrer nofollow"
          href={`https://explorer.solana.com/tx/${transactionHash}?cluster=devnet`}
        >
          {t("see-on")} <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
