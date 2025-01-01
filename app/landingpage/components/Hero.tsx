import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
    return (
        <section className="relative h-[80vh] bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('https://media.istockphoto.com/id/1018203624/photo/reservation-sign.jpg?s=612x612&w=0&k=20&c=dUQA0lrvB-PGma8Rz3NADCFk4bQH0p96QMGFMvXBQA0=')" }}>
            <div className="absolute inset-0 opacity-60"></div>
            <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-4">
                <h1 className="text-5xl font-bold mb-6">blah baldasojdfsf dfd ssfsd fsd fsdf </h1>
                <p className="text-xl mb-8">dsfdsfdsf sdf sdfsd fsdfsdfsdf</p>
                <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 animate-shake">
                    <Link href="/booking" className="inline-flex items-center">
                        Book a Table <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </div>
        </section>
    )
}