import { motion } from 'framer-motion';
import { Wallet, Shield, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FareSummaryProps {
  vehicleType: 'car' | 'bike';
  isSlotAvailable: boolean;
  onBookNow: () => void;
  onChangevenue: () => void;
  isBooking: boolean;
}

export default function FareSummary({
  vehicleType,
  isSlotAvailable,
  onBookNow,
  onChangevenue,
  isBooking,
}: FareSummaryProps) {
  // Fixed fare: Car = ₹100, Bike = ₹50
  const baseFare = vehicleType === 'car' ? 100 : 50;
  const gst = Math.round(baseFare * 0.18);
  const total = baseFare + gst;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="space-y-4"
    >
      {/* Fare Card */}
      <Card className="glass-card border-border/50 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <CardHeader className="pb-4 relative">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            Fare Summary
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 relative">
          {/* Fare breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Base Fare ({vehicleType === 'car' ? 'Car' : 'Bike'})</span>
              <span className="text-foreground font-medium">₹{baseFare}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-border/50">
              <span className="text-muted-foreground">GST (18%)</span>
              <span className="text-foreground font-medium">₹{gst}</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t border-border/50">
            <span className="text-lg font-semibold text-foreground">Total Amount</span>
            <span className="text-2xl font-bold gradient-text">₹{total}</span>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Secure payment via Stripe
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Book Now Button */}
        <Button
          onClick={onBookNow}
          disabled={!isSlotAvailable || isBooking}
          size="lg"
          className={`w-full h-14 text-lg font-semibold transition-all duration-300 ${
            isSlotAvailable && !isBooking
              ? 'glow-primary'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {isBooking ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="h-5 w-5 mr-2 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
              />
              Processing...
            </>
          ) : isSlotAvailable ? (
            <>
              Book & Pay ₹{total}
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </>
          ) : (
            <>
              <AlertCircle className="mr-2 w-5 h-5" />
              No Slots Available
            </>
          )}
        </Button>

        {/* Change Venue Button */}
        <Button
          onClick={onChangevenue}
          variant="outline"
          size="lg"
          disabled={isBooking}
          className="w-full h-12 border-border/50 hover:bg-muted/50"
        >
          <RotateCcw className="mr-2 w-4 h-4" />
          Search Different Venue
        </Button>
      </div>

      {/* No slots message */}
      {!isSlotAvailable && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-destructive/10 border border-destructive/20"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">No slots available</p>
              <p className="text-sm text-muted-foreground mt-1">
                Unfortunately, there are no {vehicleType} slots available at this venue. 
                Please try a different venue or check back later.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}