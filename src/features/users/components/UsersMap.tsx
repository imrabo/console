'use client';

import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

import type { UserType } from '../types';

import 'leaflet/dist/leaflet.css';

interface UsersMapProps {
  users: UserType[];
}

const defaultCenter: [number, number] = [20.5937, 78.9629];

/**
 * Fix Leaflet's default marker icons when using Next.js/Webpack/Turbopack.
 */
const userMarkerIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapBounds({ users }: UsersMapProps) {
  const map = useMap();

  useEffect(() => {
    const validUsers = users.filter(
      (user) =>
        user.location &&
        Number.isFinite(user.location.latitude) &&
        Number.isFinite(user.location.longitude)
    );

    if (validUsers.length === 0) {
      map.setView(defaultCenter, 5);
      return;
    }

    if (validUsers.length === 1) {
      const user = validUsers[0];

      if (!user.location) return;

      map.setView([user.location.latitude, user.location.longitude], 12);

      return;
    }

    const bounds = L.latLngBounds(
      validUsers.map((user) => [user.location!.latitude, user.location!.longitude])
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
    });
  }, [map, users]);

  return null;
}

export default function UsersMap({ users }: UsersMapProps) {
  const usersWithLocation = users.filter(
    (user) =>
      user.location &&
      Number.isFinite(user.location.latitude) &&
      Number.isFinite(user.location.longitude)
  );

  return (
    <div className="border-border overflow-hidden rounded-xl border">
      <div className="bg-card border-border flex items-center justify-between border-b px-4 py-3">
        <div>
          <h2 className="text-sm font-bold">Users Map</h2>

          <p className="text-muted-foreground mt-0.5 text-xs">User locations from OpenStreetMap</p>
        </div>

        <div className="text-muted-foreground text-xs">{usersWithLocation.length} users</div>
      </div>

      <div className="h-[500px] w-full">
        <MapContainer
          center={defaultCenter}
          zoom={5}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapBounds users={users} />

          {usersWithLocation.map((user) => {
            if (!user.location) return null;

            return (
              <Marker
                key={user.id}
                position={[user.location.latitude, user.location.longitude]}
                icon={userMarkerIcon}
              >
                <Popup>
                  <div className="min-w-[180px]">
                    <p className="font-semibold">{user.fullName || 'Unknown User'}</p>

                    <p className="mt-1 text-xs text-gray-500">{user.email || '-'}</p>

                    <p className="mt-2 text-xs">
                      {user.location.address ||
                        `${user.location.latitude.toFixed(
                          5
                        )}, ${user.location.longitude.toFixed(5)}`}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
