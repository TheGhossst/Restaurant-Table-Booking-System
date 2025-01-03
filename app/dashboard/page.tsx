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
import { Calendar } from 'lucide-react'

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold flex items-center">
            <Calendar className="mr-2 h-6 w-6" />
            Your Reservations
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {reservations.length} {reservations.length === 1 ? 'reservation' : 'reservations'}
          </span>
        </CardHeader>
        <CardContent>
          <ReservationList reservations={reservations} />
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Find a Restaurant</h2>
      <RestaurantSearch />
    </div>
  )
}