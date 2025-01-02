'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RestaurantSearch from './components/restaurant-search';
import { Navbar } from '../components/NavBar';
import { auth } from '../../api/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/auth/login');
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Find a Restaurant</h1>
        <RestaurantSearch />
      </div>
    </div>
  );
}
