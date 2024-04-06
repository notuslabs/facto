import { Button } from "@/components/ui/button";

type NavbarCreateAccountButtonProps = {
  text: string;
  onClick: () => void;
};

export function NavbarCreateAccountButton({ text, onClick }: NavbarCreateAccountButtonProps) {
  return (
    <Button variant="defaultGradient" onClick={onClick}>
      {text}
    </Button>
  );
}
