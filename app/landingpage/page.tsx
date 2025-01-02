import { Hero } from './components/Hero'
import { About } from './components/About'
import { Features } from './components/Features'
import { GetStarted } from './components/GetStarted'
import { Footer } from './components/Footer'


export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col" id = 'home'>
            <Hero />
            <About />
            <Features />
            <GetStarted />
            <Footer />
        </div>
    )
}