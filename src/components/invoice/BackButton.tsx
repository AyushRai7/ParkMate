import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const BackNavigationButton = () => {
  return (
    <Link href="/" className="fixed top-6 left-6 z-50 print:hidden">
      <Button
        variant="outline"
        className="
          gap-2 rounded-xl shadow-lg
          bg-card/70 backdrop-blur-md
          border-border
          text-foreground
          hover:bg-card
          transition
        "
      >
        <ArrowLeft className="w-4 h-4 text-primary" />
        Back to Home
      </Button>
    </Link>
  );
};

export default BackNavigationButton;
