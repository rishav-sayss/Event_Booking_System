import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface EventMapProps {
  title: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
}

const eventIcon = L.divIcon({
  className: 'event-map-marker',
  html: '<span></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -14],
});

function getCoordinates(latitude: number | null, longitude: number | null): [number, number] | null {
  if (latitude === null || longitude === null || !Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;
  return [latitude, longitude];
}

export default function EventMap({ title, address, latitude, longitude }: EventMapProps) {
  const coordinates = getCoordinates(latitude, longitude);
  if (!coordinates) {
    return <div className="card p-6 text-sm text-slate-400">Map location is not available for this event yet.</div>;
  }

  const [mapLatitude, mapLongitude] = coordinates;
  const openStreetMapUrl = `https://www.openstreetmap.org/?mlat=${mapLatitude}&mlon=${mapLongitude}#map=16/${mapLatitude}/${mapLongitude}`;

  return (
    <div className="card overflow-hidden">
      <MapContainer center={coordinates} zoom={15} zoomControl={false} className="h-72 w-full sm:h-80">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />
        <Marker position={coordinates} icon={eventIcon}>
          <Popup>
            <strong>{title}</strong>
            <br />
            {address}
          </Popup>
        </Marker>
      </MapContainer>
      <a href={openStreetMapUrl} target="_blank" rel="noreferrer" className="block border-t border-white/10 px-4 py-3 text-center text-sm font-medium text-brand-300 transition hover:bg-white/5 hover:text-brand-200">
        Open location in OpenStreetMap
      </a>
    </div>
  );
}
