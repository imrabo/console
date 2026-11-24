import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issues in Vite/Webpack bundling
const customIcon = L.icon({
  iconUrl:
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236366F1" width="36px" height="36px"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

interface MapProps {
  lat?: number;
  lng?: number;
  interactive?: boolean;
  onLocationSelect?: (coords: { lat: number; lng: number }) => void;
  popupText?: string;
  zoom?: number;
}

// Sub-component to sync map view center when lat/lng changes externally
const ChangeMapView: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

// Sub-component to handle map click events in interactive mode
const MapEventsHandler: React.FC<{
  onSelect?: (coords: { lat: number; lng: number }) => void;
}> = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      if (onSelect) {
        onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
};

export const LeafletMap: React.FC<MapProps> = ({
  lat = 45.5152,
  lng = -122.6784,
  interactive = false,
  onLocationSelect,
  popupText = 'Selected Location',
  zoom = 13,
}) => {
  const position: [number, number] = [lat, lng];

  return (
    <div
      className="border-border/80 relative h-full w-full overflow-hidden rounded-xl border"
      style={{ minHeight: '300px' }}
    >
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={interactive}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position} icon={customIcon}>
          <Popup className="font-sans text-xs font-semibold">{popupText}</Popup>
        </Marker>

        <ChangeMapView center={position} />

        {interactive && onLocationSelect && <MapEventsHandler onSelect={onLocationSelect} />}
      </MapContainer>
      {interactive && (
        <div className="bg-background/90 border-border/60 text-muted-foreground pointer-events-none absolute bottom-2 left-2 z-[2] rounded border px-2 py-1 text-[10px] font-bold uppercase shadow-md backdrop-blur-sm select-none">
          Click map to adjust location coordinates
        </div>
      )}
    </div>
  );
};

export default LeafletMap;
