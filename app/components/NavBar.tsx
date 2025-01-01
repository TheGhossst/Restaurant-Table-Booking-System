'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { smoothScroll } from '../utils/smoothScroll';
import { auth } from '@/api/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

const navItems = [
    { href: '/', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="bg-white shadow-md fixed w-full z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center text-xl font-bold text-gray-800">
                            <UtensilsCrossed className="w-6 h-6 mr-2 text-gray-700" />
                            Findymfirst
                        </Link>

                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            <NavItems />
                            <AuthButtons />
                        </div>
                    </div>
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-expanded={isOpen}
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <NavItems mobile />
                        <div className="mt-4">
                            <AuthButtons mobile />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

function NavItems({ mobile = false }: { mobile?: boolean }) {
    const baseClasses = "text-gray-700 hover:text-black transition-colors duration-200";
    const mobileClasses = "block px-3 py-2 rounded-md text-base font-medium";
    const desktopClasses = "px-3 py-2 rounded-md text-sm font-medium";

    return (
        <>
            {navItems.map((item) => (
                item.href.startsWith('#') ? (
                    <a
                        key={item.href}
                        href={item.href}
                        className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses}`}
                        onClick={(e) => smoothScroll(e, item.href.slice(1))}
                    >
                        {item.label}
                    </a>
                ) : (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses}`}
                    >
                        {item.label}
                    </Link>
                )
            ))}
        </>
    );
}

function AuthButtons({ mobile = false }: { mobile?: boolean }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className={`${mobile ? 'flex flex-col space-y-2' : 'flex items-center space-x-2'}`}>
            {user ? (
                <Button onClick={handleLogout} variant="outline" className="w-full">
                    Logout
                </Button>
            ) : (
                <>
                    <Button asChild variant="outline">
                        <Link href="/auth/login">Login</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/auth/signup">Sign Up</Link>
                    </Button>
                </>
            )}
        </div>
    );
}