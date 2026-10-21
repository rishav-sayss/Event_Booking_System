import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (latitude: number, longitude: number) => void;
}

const pickerIcon = L.divIcon({
  className: 'event-map-marker',
  html: '<span></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const worldView: [number, number] = [20, 0];

function getCoordinates(latitude: number | null, longitude: number | null): [number, number] | null {
  if (latitude === null || longitude === null || !Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;
  return [latitude, longitude];
}

function MapPosition({ latitude, longitude }: Pick<LocationPickerProps, 'latitude' | 'longitude'>) {
  const map = useMap();
  useEffect(() => {
    const coordinates = getCoordinates(latitude, longitude);
    if (coordinates) map.setView(coordinates, Math.max(map.getZoom(), 15));
  }, [latitude, longitude, map]);
  return null;
}

function MapClickHandler({ onChange }: Pick<LocationPickerProps, 'onChange'>) {
  useMapEvents({ click: ({ latlng }) => onChange(Number(latlng.lat.toFixed(7)), Number(latlng.lng.toFixed(7))) });
  return null;
}

export default function LocationPicker({ latitude, longitude, onChange }: LocationPickerProps) {
  const markerPosition = getCoordinates(latitude, longitude);

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
      <MapContainer center={markerPosition || worldView} zoom={markerPosition ? 15 : 2} className="h-64 w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapPosition latitude={latitude} longitude={longitude} />
        <MapClickHandler onChange={onChange} />
        {markerPosition && <Marker position={markerPosition} icon={pickerIcon} draggable eventHandlers={{ dragend: (event) => { const position = event.target.getLatLng(); onChange(Number(position.lat.toFixed(7)), Number(position.lng.toFixed(7))); } }} />}
      </MapContainer>
      <p className="bg-ink-950/70 px-3 py-2 text-xs text-slate-400">Click the map or drag the marker to set the exact event location.</p>
    </div>
  );
}
