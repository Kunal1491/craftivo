import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const COLUMBUS = [39.9612, -82.9988]

export default function RoofingMap() {
  const mapRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    }).setView(COLUMBUS, 11)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    const marker = L.circleMarker(COLUMBUS, {
      radius: 10,
      color: '#C8753D',
      fillColor: '#C8753D',
      fillOpacity: 1,
      weight: 2,
    }).addTo(map)

    marker.bindPopup('<strong>Ridgeline Roofing Co.</strong><br>Serving Central Ohio<br>Columbus, OH')

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
    <div className="r-map" aria-label="Map showing Ridgeline Roofing service area in Central Ohio">
      <div ref={containerRef} className="r-map-canvas" role="img" aria-label="Interactive map centered on Columbus, Ohio" />
      <noscript>
        <p className="r-map-fallback">
          Ridgeline Roofing Co. — Serving Columbus, Dublin, Westerville, and surrounding Central Ohio communities. Fictional business · Concept Project
        </p>
      </noscript>
    </div>
  )
}
