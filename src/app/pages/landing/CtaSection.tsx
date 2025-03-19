"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Experience the Future of Event Planning
          </h2>
          <p className="text-blue-100 mb-8">
            Join forward-thinking event professionals leveraging AI to deliver extraordinary experiences.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
            Start Your Free Trial
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-sm text-blue-200 mt-4">No credit card required. 14-day free trial.</p>
        </motion.div>
      </div>
    </section>
  );
}