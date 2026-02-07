import { motion } from 'framer-motion';
import { MapPin, Car, Bike, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface VenueCardProps {
  venue: {
    name: string;
    address: string;
    carSlots: { available: number; total: number };
    bikeSlots: { available: number; total: number };
    timing: string;
  };
}

export default function VenueCard({ venue }: VenueCardProps) {
  const carAvailable = venue.carSlots.available > 0;
  const bikeAvailable = venue.bikeSlots.available > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="glass-card border-border/50 overflow-hidden">
        <CardContent className="p-6">
          {/* Venue Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">{venue.name}</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">{venue.address}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">{venue.timing}</span>
            </div>
          </div>

          {/* Slot Availability */}
          <div className="grid grid-cols-2 gap-4">
            {/* Car Slots */}
            <div className={`p-4 rounded-xl border ${
              carAvailable 
                ? 'bg-primary/5 border-primary/20' 
                : 'bg-destructive/5 border-destructive/20'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  carAvailable ? 'bg-primary/20' : 'bg-destructive/20'
                }`}>
                  <Car className={`w-5 h-5 ${carAvailable ? 'text-primary' : 'text-destructive'}`} />
                </div>
                <span className="font-medium text-foreground">Car Parking</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-2xl font-bold ${carAvailable ? 'text-primary' : 'text-destructive'}`}>
                    {venue.carSlots.available}
                  </span>
                  <span className="text-muted-foreground">/{venue.carSlots.total}</span>
                </div>
                {carAvailable ? (
                  <div className="flex items-center gap-1 text-primary">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Available</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-destructive">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Full</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bike Slots */}
            <div className={`p-4 rounded-xl border ${
              bikeAvailable 
                ? 'bg-accent/5 border-accent/20' 
                : 'bg-destructive/5 border-destructive/20'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  bikeAvailable ? 'bg-accent/20' : 'bg-destructive/20'
                }`}>
                  <Bike className={`w-5 h-5 ${bikeAvailable ? 'text-accent' : 'text-destructive'}`} />
                </div>
                <span className="font-medium text-foreground">Bike Parking</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-2xl font-bold ${bikeAvailable ? 'text-accent' : 'text-destructive'}`}>
                    {venue.bikeSlots.available}
                  </span>
                  <span className="text-muted-foreground">/{venue.bikeSlots.total}</span>
                </div>
                {bikeAvailable ? (
                  <div className="flex items-center gap-1 text-accent">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Available</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-destructive">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Full</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
