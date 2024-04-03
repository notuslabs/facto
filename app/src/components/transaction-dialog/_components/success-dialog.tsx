import { FloatingCubes } from "@/components/illustrations/floating-cubes";
import { buttonVariants } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, ClipboardCopy, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import copy from "copy-to-clipboard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SuccessDialogProps {
  type: "deposit" | "withdrawal";
  operationAmount: number;
  transactionHash: string;
  externalLink: string;
}

export default function SuccessDialog({
  type,
  operationAmount,
  transactionHash,
  externalLink,
}: SuccessDialogProps) {
  const t = useTranslations("success");

  function handleCopyToClipboard() {
    copy(transactionHash.toString());
    toast.success(t("hash-copied"));
  }

  return (
    <div className="relative flex w-[451px] flex-col gap-12">
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
              onClick={handleCopyToClipboard}
            />
          </div>
        </div>

        <a
          className={cn(buttonVariants({ variant: "link" }), "w-fit bg-card")}
          target="_blank"
          rel="noreferrer nofollow"
          href={externalLink}
        >
          {t("see-on")} <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
