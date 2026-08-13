import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import WhyCraftivo from './components/WhyCraftivo'
import Contact from './components/Contact'
import Footer from './components/Footer'
import DentalPage from './dental/DentalPage'
import RoofingPage from './roofing/RoofingPage'
import './App.css'

function App() {
  const [route, setRoute] = useState(window.location.pathname)

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Standalone dental concept — own nav, footer, and art direction
  if (route === '/work/dental-clinic') {
    return <DentalPage />
  }

  if (route === '/work/ridgeline-roofing') {
    return <RoofingPage />
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <WhyCraftivo />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
