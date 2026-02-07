import { Car } from "lucide-react";

const InvoiceHeader = () => {
  return (
    <div className="text-center pb-6 border-b border-border">
      {/* Brand */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-subtle">
          <Car className="w-5 h-5 text-primary" />
        </div>

        <span className="text-xl font-bold text-foreground">
          Park<span className="text-primary">Mate</span>
        </span>
      </div>

      {/* Invoice Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">
        Booking Invoice
      </h1>
    </div>
  );
};

export default InvoiceHeader;
