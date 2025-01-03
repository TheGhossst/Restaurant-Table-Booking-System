'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '../components/NavBar';

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const noNavbarRoutes = ['/auth/login', '/auth/signup'];

    return (
        <>
            {!noNavbarRoutes.includes(pathname) && <Navbar />}
            <main>
                {children}
            </main>
        </>
    );
}
