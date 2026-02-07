import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Shield, LayoutDashboard, XCircle, Clock, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: MapPin,
    title: 'Real-time Availability',
    description: 'See available parking slots in real-time with live updates. No more guessing games.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Shield,
    title: 'Secure Booking & Payments',
    description: 'Enterprise-grade security for all transactions. Your data stays protected.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: LayoutDashboard,
    title: 'Owner & User Dashboards',
    description: 'Comprehensive dashboards for slot owners and users. Manage everything in one place.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: XCircle,
    title: 'Easy Cancellation',
    description: 'Plans changed? Cancel hassle-free with our flexible cancellation policy.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Clock,
    title: 'Instant Confirmations',
    description: 'Get booking confirmations in seconds. QR code access for quick entry.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: CreditCard,
    title: 'Multiple Payment Options',
    description: 'Pay your way - cards, UPI, wallets, or net banking. All options available.',
    gradient: 'from-blue-500 to-indigo-500',
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group relative h-full bg-card/50 border-border/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Glow effect on hover */}
        <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" style={{ zIndex: -1 }} />

        <CardContent className="relative p-6">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-4`}>
            <div className="w-full h-full rounded-[10px] bg-background flex items-center justify-center">
              <feature.icon className="w-5 h-5 text-foreground" />
            </div>
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {feature.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {feature.description}
          </p>

          {/* Arrow indicator on hover */}
          {/* <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
            <span className="text-sm font-medium">Learn more</span>
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div> */}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <section id="features" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Features</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold text-foreground text-balance">
            Everything you need to{' '}
            <span className="gradient-text">park smarter</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Built for drivers who value their time. Simple, secure, and seamless parking experience.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
