import { motion } from "framer-motion";
import { User, Phone, Car, Bike } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface BookingFormProps {
  formData: {
    userName: string;
    phone: string;
    vehicleNumber: string;
    vehicleType: "car" | "bike";
  };
  onFormChange: (field: string, value: string) => void;
  carAvailable: boolean;
  bikeAvailable: boolean;
}

export default function BookingForm({
  formData,
  onFormChange,
  carAvailable,
  bikeAvailable,
}: BookingFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            Booking Details
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="userName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="userName"
                placeholder="Enter your full name"
                value={formData.userName}
                onChange={(e) =>
                  onFormChange(
                    "userName",
                    e.target.value.replace(/[^a-zA-Z\s]/g, "")
                  )
                }
                className="pl-11 h-12"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="10 digit phone number"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);
                  onFormChange("phone", value);
                }}
                className="pl-11 h-12"
              />
            </div>
          </div>

          {/* Vehicle Number */}
          <div className="space-y-2">
            <Label htmlFor="vehicleNumber">Vehicle Number</Label>
            <div className="relative">
              <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="vehicleNumber"
                placeholder="MH01AB1234"
                value={formData.vehicleNumber}
                onChange={(e) =>
                  onFormChange(
                    "vehicleNumber",
                    e.target.value.toUpperCase().replace(/\s+/g, "")
                  )
                }
                className="pl-11 h-12 uppercase"
              />
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="space-y-3">
            <Label>Vehicle Type</Label>
            <RadioGroup
              value={formData.vehicleType}
              onValueChange={(value) => onFormChange("vehicleType", value)}
              className="grid grid-cols-2 gap-4"
            >
              {/* Car */}
              <Label
                htmlFor="car"
                className={`p-4 rounded-xl border-2 cursor-pointer flex gap-3 justify-center items-center
                ${
                  formData.vehicleType === "car"
                    ? "border-primary bg-primary/10"
                    : "border-border/50"
                }
                ${!carAvailable && "opacity-50 cursor-not-allowed"}`}
              >
                <RadioGroupItem
                  value="car"
                  id="car"
                  disabled={!carAvailable}
                  className="sr-only"
                />
                <Car className="w-5 h-5" />
                <span>Car</span>
              </Label>

              {/* Bike */}
              <Label
                htmlFor="bike"
                className={`p-4 rounded-xl border-2 cursor-pointer flex gap-3 justify-center items-center
                ${
                  formData.vehicleType === "bike"
                    ? "border-accent bg-accent/10"
                    : "border-border/50"
                }
                ${!bikeAvailable && "opacity-50 cursor-not-allowed"}`}
              >
                <RadioGroupItem
                  value="bike"
                  id="bike"
                  disabled={!bikeAvailable}
                  className="sr-only"
                />
                <Bike className="w-5 h-5" />
                <span>Bike</span>
              </Label>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
