'use client';

import { Clock, Calendar, Users } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { motion } from 'framer-motion';

export function Features() {
    const fadeInVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <motion.h2
                    className="text-4xl font-bold text-center mb-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }} // Animation will trigger every time it comes into view
                    transition={{ duration: 0.5 }}
                    variants={fadeInVariants}
                >
                    Simple Booking Process
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Calendar className="w-12 h-12 text-red-600" />,
                            title: "Select Your Date",
                            description: "Choose your preferred dining date from our available options.",
                        },
                        {
                            icon: <Clock className="w-12 h-12 text-red-600" />,
                            title: "Choose Your Time",
                            description: "Pick a time slot that suits your schedule perfectly.",
                        },
                        {
                            icon: <Users className="w-12 h-12 text-red-600" />,
                            title: "Specify Group Size",
                            description: "Let us know how many guests will be joining your culinary adventure.",
                        },
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.2 }} // Ensures repeated animation
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            variants={fadeInVariants}
                        >
                            <FeatureCard
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}