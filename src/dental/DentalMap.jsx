import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const AUSTIN = [30.2672, -97.7431]

export default function DentalMap() {
  const mapRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    }).setView(AUSTIN, 14)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    const marker = L.circleMarker(AUSTIN, {
      radius: 10,
      color: '#0C6570',
      fillColor: '#0C6570',
      fillOpacity: 1,
      weight: 2,
    }).addTo(map)

    marker.bindPopup('<strong>BrightSmile Dental</strong><br>123 Main Street<br>Austin, TX 78701')

    mapRef.current = map

    const resize = () => map.invalidateSize()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div className="d-map" aria-label="Map showing BrightSmile Dental location in Austin, Texas">
      <div ref={containerRef} className="d-map-canvas" role="img" aria-label="Interactive map centered on Austin, Texas" />
      <noscript>
        <p className="d-map-fallback">
          BrightSmile Dental — 123 Main Street, Austin, TX 78701. Fictional location · Concept Project
        </p>
      </noscript>
    </div>
  )
}
