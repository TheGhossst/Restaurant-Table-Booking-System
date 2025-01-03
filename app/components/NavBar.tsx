'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { smoothScroll } from '../utils/smoothScroll';
import { auth } from '@/api/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface NavItem {
    href: string;
    label: string;
}

// Static Nav Items
const navItemsForRoot: NavItem[] = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
];

const navItemsForDashboard: NavItem[] = [
    { href: '/', label: 'Home' }
];

const navItemsForRestaurant: NavItem[] = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' }
];

const navItemsForReservation: NavItem[] = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' }
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => setIsOpen(!isOpen);

    const getBasePath = () => {
        const segments = pathname.split('/').filter(Boolean);
        return segments.length > 0 ? segments[0] : '/';
    };

    const basePath = getBasePath();

    const renderNavItems = () => {
        switch (basePath) {
            case 'dashboard':
                return <NavItemsForDashBoard mobile={false} navItems={navItemsForDashboard} />;
            case 'restaurants':
                return <NavItemsForResturant mobile={false} navItems={navItemsForRestaurant} />;
            case 'reservation':
                return <NavItemsForReservation mobile={false} navItems={navItemsForReservation} />;
            default:
                return <NavItems mobile={false} navItems={navItemsForRoot} />;
        }
    };

    return (
        <nav className={`${basePath == 'dashboard' ? 'bg-transparent' : 'bg-white' } shadow-sm fixed w-full z-10`}>
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
                            {renderNavItems()}
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
                        {renderNavItems()}
                        <div className="mt-4">
                            <AuthButtons mobile />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

// General NavItems Component
function NavItems({ mobile = false, navItems }: { mobile?: boolean, navItems: NavItem[] }) {
    const baseClasses = "text-gray-700 hover:text-black transition-colors duration-200";
    const mobileClasses = "block px-3 py-2 rounded-md text-base font-medium";
    const desktopClasses = "px-3 py-2 rounded-md text-sm font-medium";

    return (
        <>
            {navItems.map((item) => (
                <a
                    key={item.href}
                    href={item.href}
                    className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses}`}
                    onClick={(e) => smoothScroll(e, item.href.slice(1))}
                >
                    {item.label}
                </a>
            ))}
        </>
    );
}

function NavItemsForDashBoard({ mobile = false, navItems }: { mobile?: boolean, navItems: NavItem[] }) {
    const baseClasses = "text-gray-700 hover:text-black transition-colors duration-200";
    const mobileClasses = "block px-3 py-2 rounded-md text-base font-medium";
    const desktopClasses = "px-3 py-2 rounded-md text-sm font-medium";

    return (
        <>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses}`}
                >
                    {item.label}
                </Link>
            ))}
        </>
    );
}
function NavItemsForResturant({ mobile = false, navItems }: { mobile?: boolean, navItems: NavItem[] }) {
    const baseClasses = "text-gray-700 hover:text-black transition-colors duration-200";
    const mobileClasses = "block px-3 py-2 rounded-md text-base font-medium";
    const desktopClasses = "px-3 py-2 rounded-md text-sm font-medium";

    return (
        <>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses}`}
                >
                    {item.label}
                </Link>
            ))}
        </>
    );
}


function NavItemsForReservation({ mobile = false, navItems }: { mobile?: boolean, navItems: NavItem[] }) {
    const baseClasses = "text-gray-700 hover:text-black transition-colors duration-200";
    const mobileClasses = "block px-3 py-2 rounded-md text-base font-medium";
    const desktopClasses = "px-3 py-2 rounded-md text-sm font-medium";

    return (
        <>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses}`}
                >
                    {item.label}
                </Link>
            ))}
        </>
    );
}

function AuthButtons({ mobile = false }: { mobile?: boolean }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

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
            router.push("/");
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