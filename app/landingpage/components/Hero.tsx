'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export function Hero() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <section
            className="relative h-[80vh] bg-cover bg-center flex items-center justify-center"
            style={{
                backgroundImage: "url('https://media.istockphoto.com/id/1018203624/photo/reservation-sign.jpg?s=612x612&w=0&k=20&c=dUQA0lrvB-PGma8Rz3NADCFk4bQH0p96QMGFMvXBQA0=')",
            }}
        >
            <div className="absolute inset-0 bg-black opacity-60"></div>
            <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-4">
                <h1 className="text-5xl font-bold mb-6">Experience Dining at Its Best</h1>
                <p className="text-xl mb-8">
                    Discover our exquisite menu, unparalleled service, and the perfect ambiance for every occasion. Reserve your table now to enjoy a memorable dining experience.
                </p>
                <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
                    <Link href={isAuthenticated ? '/dashboard' : '/login'} className="inline-flex items-center">
                        {isAuthenticated ? 'Go to Dashboard' : 'Get Started'} <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </div>
        </section>
    );
}
