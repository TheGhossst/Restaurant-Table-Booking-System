'use client'

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export function GetStarted() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <section className="py-20 bg-red-600 text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-6">Ready to Experience Findymfirst?</h2>
                <p className="text-xl mb-8">Book your table now and embark on a gastronomic journey.</p>
                <Button asChild size="lg" variant="outline" className="bg-white text-red-600 hover:bg-gray-100 animate-shake">
                    <Link href={isAuthenticated ? '/dashboard' : '/auth/login'}>Reserve Your Table</Link>
                </Button>
            </div>
        </section>
    );
}
