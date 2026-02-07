"use client";

import { motion, useInView } from "framer-motion";
import { Car, Twitter, Github, Linkedin, Instagram } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const socialLinks = [
  { icon: Twitter, href: "https://x.com/AyushRai374911", label: "Twitter" },
  { icon: Github, href: "https://github.com/AyushRai7", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/ayush-rai-271985291/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/ayush_rai077/", label: "Instagram" },
];

export default function Footer() {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, {
    once: true,
    margin: "-120px",
  });

  return (
    <motion.footer
      ref={footerRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative border-t border-border/30 bg-card/30"
      id="contact"
    >
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Park<span className="text-primary">Mate</span>
              </span>
            </Link>

            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              The smarter way to find and book parking. Save time, reduce stress,
              and never circle the block again.
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* WHERE TO FIND */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">WHERE TO FIND</h4>
            <Link
              href="https://www.google.com/maps/search/?api=1&query=IIIT+Kota+Permanent+Campus,Ranpur,Kota,Rajasthan-325003"
              target="_blank"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              <p className="ml-2 mb-1 mt-5">IIIT KOTA, Ranpur,</p>
              <p className="ml-2">Kota, Rajasthan-325003</p>
            </Link>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">CONTACT US</h4>
            <p className="text-muted-foreground hover:text-foreground text-sm mb-4 mt-5">
              +91-9717835155
            </p>
            <Link href="mailto:ayushrai1729@gmail.com">
              <p className="text-muted-foreground hover:text-foreground text-sm">
                ayushrai1729@gmail.com
              </p>
            </Link>
          </div>

          {/* DISCOVER */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">DISCOVER</h4>
            <div className="flex flex-col gap-2 mt-5">
              <Link href="/" className="text-muted-foreground hover:text-foreground text-sm mb-2">
                Home
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground text-sm mb-2">
                About Parkmate
              </Link>
              <Link href="/" className="text-muted-foreground hover:text-foreground text-sm mb-2">
                Contact Us
              </Link>
              <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} ParkMate. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Made with 💚 for drivers everywhere
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
