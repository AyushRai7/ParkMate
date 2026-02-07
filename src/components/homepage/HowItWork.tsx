import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Search, MousePointerClick, Car } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Search Location',
    description: 'Enter your destination and see all available parking spots nearby with real-time availability.',
  },
  {
    number: '02',
    icon: MousePointerClick,
    title: 'Select & Book',
    description: 'Choose your preferred slot, select duration, and complete secure payment in seconds.',
  },
  {
    number: '03',
    icon: Car,
    title: 'Park & Go',
    description: 'Arrive at your spot, scan your QR code for entry, and enjoy stress-free parking.',
  },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative"
    >
      {/* Connector line */}
      {index < steps.length - 1 && (
        <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/10" />
      )}

      <div className="relative flex flex-col items-center text-center">
        {/* Step number */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: index * 0.2 + 0.2, type: 'spring', stiffness: 200 }}
          className="relative mb-6"
        >
          {/* Outer glow ring */}
          <div className="absolute inset-0 w-32 h-32 rounded-full bg-primary/20 blur-xl animate-pulse-glow" />
          
          {/* Main circle */}
          <div className="relative w-32 h-32 rounded-full gradient-border flex items-center justify-center bg-card">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-accent/10" />
            <step.icon className="w-10 h-10 text-primary relative z-10" />
          </div>

          {/* Step number badge */}
          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
            {step.number}
          </div>
        </motion.div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-foreground mb-3">
          {step.title}
        </h3>
        <p className="text-muted-foreground max-w-xs leading-relaxed">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <section id="how-it-works" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute inset-0 grid-pattern opacity-10" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">How it Works</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold text-foreground text-balance">
            Park in{' '}
            <span className="gradient-text">3 simple steps</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            From search to parking in under 60 seconds. That&apos;s the ParkMate promise.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
