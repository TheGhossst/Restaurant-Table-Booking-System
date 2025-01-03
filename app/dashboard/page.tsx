'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RestaurantSearch from './components/restaurant-search'
import { auth, db } from '../../api/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { Loading } from '../components/Loading'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ReservationList } from './components/reservation-list'
import { Calendar, Search } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [reservations, setReservations] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/auth/login')
      } else {
        setUser(currentUser)
        fetchReservations(currentUser.uid)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const fetchReservations = async (userId: string) => {
    const reservationsRef = collection(db, 'reservations')
    const q = query(reservationsRef, where('userId', '==', userId))
    const querySnapshot = await getDocs(q)
    const reservationsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setReservations(reservationsData)
  }

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-teal-400 to-indigo-500">
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          className="text-4xl font-bold mb-8 text-white text-center mt-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to Your Dashboard
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold flex items-center mb-2">
                <Calendar className="mr-2 h-6 w-6" />
                Your Reservations
              </CardTitle>
              <span className="text-sm">
                {reservations.length} {reservations.length === 1 ? 'reservation' : 'reservations'}
              </span>
            </CardHeader>
            <CardContent>
              <ReservationList reservations={reservations} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Search className="mr-2 h-6 w-6" />
                Find a Restaurant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RestaurantSearch />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
