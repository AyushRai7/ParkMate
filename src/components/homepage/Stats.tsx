import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { MapPin, Users, CheckCircle, Clock } from 'lucide-react';

const stats = [
  {
    icon: MapPin,
    value: 1000,
    suffix: '+',
    label: 'Slots Listed',
    description: 'Across 500+ cities',
  },
  {
    icon: Users,
    value: 500,
    suffix: '+',
    label: 'Active Users',
    description: 'And growing daily',
  },
  {
    icon: CheckCircle,
    value: 99,
    suffix: '%',
    label: 'Booking Success',
    description: 'Reliable every time',
  },
  {
    icon: Clock,
    value: 60,
    suffix: 's',
    label: 'Avg. Booking Time',
    description: 'Quick and easy',
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (current) => Math.floor(current));

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  useEffect(() => {
    return display.on('change', (latest) => {
      setDisplayValue(latest);
    });
  }, [display]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue}
      {suffix}
    </span>
  );
}

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group"
    >
      <div className="glass-card p-8 text-center h-full transition-all duration-300 hover:border-primary/30">
        {/* Icon */}
        <div className="inline-flex w-14 h-14 rounded-2xl bg-primary/10 items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <stat.icon className="w-7 h-7 text-primary" />
        </div>

        {/* Value */}
        <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
          <AnimatedCounter value={stat.value} suffix={stat.suffix} />
        </div>

        {/* Label */}
        <div className="text-foreground font-medium mb-1">{stat.label}</div>
        <div className="text-muted-foreground text-sm">{stat.description}</div>
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Trusted Platform</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold text-foreground text-balance">
            Numbers that{' '}
            <span className="gradient-text">speak volumes</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Join thousands of drivers who trust ParkMate for their daily parking needs.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
