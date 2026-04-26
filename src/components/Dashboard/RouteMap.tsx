import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { PickupRequest } from '../../types';

// Fix for default marker icons in react-leaflet using CDN
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

interface RouteMapProps {
  pickups: PickupRequest[];
}

interface Coordinate {
  lat: number;
  lng: number;
  label?: string;
}

// Helper to center map based on markers
function MapController({ coordinates }: { coordinates: Coordinate[] }) {
  const map = useMap();
  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates.map(c => [c.lat, c.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coordinates, map]);
  return null;
}

export default function RouteMap({ pickups }: RouteMapProps) {
  const [coords, setCoords] = useState<Coordinate[]>([]);

  useEffect(() => {
    // For manual geocoding or mocking
    // Ideally use a geocoding API, but here we just try to extract if available or mock
    const processLocations = async () => {
      const results: Coordinate[] = [];
      
      // Default center (Mumbai for example)
      const center = { lat: 19.0760, lng: 72.8777 };

      pickups.forEach((p, idx) => {
        // Just mock some coordinates around the center for demo if they are strings
        // In a real app, you'd use a geocoding service
        results.push({
          lat: center.lat + (Math.random() - 0.5) * 0.1,
          lng: center.lng + (Math.random() - 0.5) * 0.1,
          label: p.address
        });
      });
      setCoords(results);
    };

    processLocations();
  }, [pickups]);

  if (coords.length === 0) return null;

  const polylineCoords: [number, number][] = coords.map(c => [c.lat, c.lng]);

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
      <MapContainer 
        center={[coords[0].lat, coords[0].lng]} 
        zoom={13} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coords.map((coord, idx) => (
          <Marker key={idx} position={[coord.lat, coord.lng]} icon={DefaultIcon}>
            <Popup>
              <div className="font-sans">
                <p className="font-bold">Stop {idx + 1}</p>
                <p className="text-sm">{coord.label}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        {coords.length > 1 && (
          <Polyline positions={polylineCoords} color="#10b981" weight={4} opacity={0.6} dashArray="10, 10" />
        )}
        <MapController coordinates={coords} />
      </MapContainer>
    </div>
  );
}
