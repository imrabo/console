"use client";

import { useEffect, useRef } from "react";
import maplibregl, { Map as MapLibreMap, Marker } from "maplibre-gl";

interface MapMotion {
    dx: number;
    dy: number;
    isDragging: boolean;
}

type OverlayPoint = {
    lat: number;
    lng: number;
    name?: string;
    category?: string;
    magnitude?: number;
    callsign?: string;
    altitude?: number;
};

export type ImraboMapPointDetail = {
    type: "place" | "earthquake" | "flight";
    title: string;
    subtitle: string;
    lat: number;
    lng: number;
    x: number;
    y: number;
};

export function ImraboMap({
    onMotion,
    onLocation,
    onPointHover,
    nearbyPlaces,
    earthquakes,
    flights,
    iss,
    visibility,
}: {
    onMotion: (motion: MapMotion) => void;
    onLocation: (location: { lat: number; lng: number; label: string }) => void;
    onPointHover?: (detail: ImraboMapPointDetail | null) => void;
    nearbyPlaces?: OverlayPoint[];
    earthquakes?: OverlayPoint[];
    flights?: OverlayPoint[];
    iss?: { lat: number; lng: number } | null;
    visibility?: {
        nearbyPlaces: boolean;
        earthquakes: boolean;
        flights: boolean;
        iss: boolean;
    };
}) {
    const mapRef = useRef<MapLibreMap | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const markerRef = useRef<Marker | null>(null);
    const issMarkerRef = useRef<Marker | null>(null);
    const watchIdRef = useRef<number | null>(null);
    const lastCenterRef = useRef<{ lng: number; lat: number } | null>(null);
    const latestLocationRef = useRef<{ lat: number; lng: number }>({ lat: 18.5204, lng: 73.8567 });

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
            center: [73.8567, 18.5204],
            zoom: 11,
            pitch: 35,
            bearing: -8,
            attributionControl: false,
            dragRotate: false,
        });

        mapRef.current = map;

        map.on("load", () => {
            const el = document.createElement("div");
            el.className = "imrabo-location-marker";
            el.style.width = "16px";
            el.style.height = "16px";
            el.style.borderRadius = "9999px";
            el.style.background = "#00ffff";
            el.style.border = "2px solid #ffffff";
            el.style.boxShadow = "0 0 12px #00ffff, 0 0 24px #00ffff, 0 0 36px rgba(0,255,255,0.8)";
            el.style.position = "relative";
            el.style.zIndex = "20";

            const pulse = document.createElement("span");
            pulse.className = "imrabo-location-pulse";
            pulse.style.position = "absolute";
            pulse.style.inset = "-12px";
            pulse.style.borderRadius = "9999px";
            pulse.style.border = "2px solid rgba(0,255,255,0.55)";
            pulse.style.pointerEvents = "none";

            pulse.animate(
                [
                    { transform: "scale(0.7)", opacity: 0.8 },
                    { transform: "scale(1.8)", opacity: 0 },
                ],
                { duration: 1800, iterations: Number.POSITIVE_INFINITY, easing: "ease-out" }
            );

            el.appendChild(pulse);
            markerRef.current = new maplibregl.Marker({ element: el })
                .setLngLat([latestLocationRef.current.lng, latestLocationRef.current.lat])
                .addTo(map);

            lastCenterRef.current = { lng: map.getCenter().lng, lat: map.getCenter().lat };
        });

        map.on("dragstart", () => {
            onMotion({ dx: 0, dy: 0, isDragging: true });
        });

        map.on("dragend", () => {
            onMotion({ dx: 0, dy: 0, isDragging: false });
        });

        map.on("move", () => {
            const center = map.getCenter();
            const prev = lastCenterRef.current;
            if (!prev) {
                lastCenterRef.current = { lng: center.lng, lat: center.lat };
                return;
            }

            const dx = (center.lng - prev.lng) * 1000;
            const dy = (center.lat - prev.lat) * 1000;
            onMotion({ dx, dy, isDragging: map.isMoving() });
            lastCenterRef.current = { lng: center.lng, lat: center.lat };
        });

        const driftInterval = setInterval(() => {
            const current = map.getCenter();
            map.easeTo({
                center: [current.lng + (Math.random() - 0.5) * 0.004, current.lat + (Math.random() - 0.5) * 0.004],
                duration: 4000,
                easing: (v) => v,
            });
        }, 30000);

        return () => {
            clearInterval(driftInterval);
            markerRef.current?.remove();
            issMarkerRef.current?.remove();
            map.remove();
            mapRef.current = null;
        };
    }, [onMotion]);

    useEffect(() => {
        if (!navigator.geolocation) return;

        const updateLocation = (lat: number, lng: number) => {
            latestLocationRef.current = { lat, lng };
            onLocation({ lat, lng, label: "Live" });
            markerRef.current?.setLngLat([lng, lat]);
            mapRef.current?.easeTo({ center: [lng, lat], duration: 1200 });
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                updateLocation(position.coords.latitude, position.coords.longitude);
            },
            () => undefined,
            { enableHighAccuracy: true }
        );

        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                updateLocation(position.coords.latitude, position.coords.longitude);
            },
            () => undefined,
            { enableHighAccuracy: true, maximumAge: 5000 }
        );

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, [onLocation]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !map.isStyleLoaded()) return;

        const sourceId = "imrabo-nearby-source";
        const layerId = "imrabo-nearby-layer";

        const data = {
            type: "FeatureCollection" as const,
            features: (nearbyPlaces ?? []).map((place) => ({
                type: "Feature" as const,
                geometry: { type: "Point" as const, coordinates: [place.lng, place.lat] as [number, number] },
                properties: { category: place.category ?? "other", name: place.name ?? "place" },
            })),
        };

        const source = map.getSource(sourceId) as maplibregl.GeoJSONSource | undefined;
        if (!source) {
            map.addSource(sourceId, { type: "geojson", data });
            map.addLayer({
                id: layerId,
                type: "circle",
                source: sourceId,
                paint: {
                    "circle-radius": 4,
                    "circle-color": [
                        "match",
                        ["get", "category"],
                        "hospital",
                        "#7df9ff",
                        "bank",
                        "#00ff9f",
                        "school",
                        "#22d3ee",
                        "restaurant",
                        "#f59e0b",
                        "#00ffff",
                    ],
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#0b1220",
                    "circle-opacity": 0.9,
                },
            });

            map.on("mousemove", layerId, (event) => {
                const feature = event.features?.[0];
                if (!feature) return;
                const props = (feature.properties ?? {}) as { name?: string; category?: string };
                map.getCanvas().style.cursor = "pointer";
                onPointHover?.({
                    type: "place",
                    title: props.name ?? "Nearby Place",
                    subtitle: props.category ? `Category: ${props.category}` : "Public place",
                    lat: event.lngLat.lat,
                    lng: event.lngLat.lng,
                    x: event.point.x,
                    y: event.point.y,
                });
            });

            map.on("mouseleave", layerId, () => {
                map.getCanvas().style.cursor = "";
                onPointHover?.(null);
            });
        } else {
            source.setData(data);
        }

        if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, "visibility", visibility?.nearbyPlaces === false ? "none" : "visible");
        }
    }, [nearbyPlaces, visibility?.nearbyPlaces, onPointHover]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !map.isStyleLoaded()) return;

        const sourceId = "imrabo-earthquake-source";
        const layerId = "imrabo-earthquake-layer";

        const data = {
            type: "FeatureCollection" as const,
            features: (earthquakes ?? []).map((item) => ({
                type: "Feature" as const,
                geometry: { type: "Point" as const, coordinates: [item.lng, item.lat] as [number, number] },
                properties: { magnitude: item.magnitude ?? 0, place: item.name ?? "quake" },
            })),
        };

        const source = map.getSource(sourceId) as maplibregl.GeoJSONSource | undefined;
        if (!source) {
            map.addSource(sourceId, { type: "geojson", data });
            map.addLayer({
                id: layerId,
                type: "circle",
                source: sourceId,
                paint: {
                    "circle-radius": ["interpolate", ["linear"], ["get", "magnitude"], 0, 3, 8, 14],
                    "circle-color": "#fb7185",
                    "circle-opacity": 0.55,
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#fda4af",
                },
            });

            map.on("mousemove", layerId, (event) => {
                const feature = event.features?.[0];
                if (!feature) return;
                const props = (feature.properties ?? {}) as { place?: string; magnitude?: string | number };
                const magnitude = Number(props.magnitude ?? 0);
                map.getCanvas().style.cursor = "pointer";
                onPointHover?.({
                    type: "earthquake",
                    title: props.place ?? "Earthquake",
                    subtitle: `Magnitude: ${Number.isFinite(magnitude) ? magnitude.toFixed(1) : "0.0"}`,
                    lat: event.lngLat.lat,
                    lng: event.lngLat.lng,
                    x: event.point.x,
                    y: event.point.y,
                });
            });

            map.on("mouseleave", layerId, () => {
                map.getCanvas().style.cursor = "";
                onPointHover?.(null);
            });
        } else {
            source.setData(data);
        }

        if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, "visibility", visibility?.earthquakes === false ? "none" : "visible");
        }
    }, [earthquakes, visibility?.earthquakes, onPointHover]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !map.isStyleLoaded()) return;

        const sourceId = "imrabo-flight-source";
        const layerId = "imrabo-flight-layer";

        const data = {
            type: "FeatureCollection" as const,
            features: (flights ?? []).map((flight) => ({
                type: "Feature" as const,
                geometry: { type: "Point" as const, coordinates: [flight.lng, flight.lat] as [number, number] },
                properties: { callsign: flight.callsign ?? "FLIGHT", altitude: flight.altitude ?? 0 },
            })),
        };

        const source = map.getSource(sourceId) as maplibregl.GeoJSONSource | undefined;
        if (!source) {
            map.addSource(sourceId, { type: "geojson", data });
            map.addLayer({
                id: layerId,
                type: "circle",
                source: sourceId,
                paint: {
                    "circle-radius": 3,
                    "circle-color": "#22d3ee",
                    "circle-opacity": 0.9,
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#7df9ff",
                },
            });

            map.on("mousemove", layerId, (event) => {
                const feature = event.features?.[0];
                if (!feature) return;
                const props = (feature.properties ?? {}) as { callsign?: string; altitude?: string | number };
                const altitude = Number(props.altitude ?? 0);
                map.getCanvas().style.cursor = "pointer";
                onPointHover?.({
                    type: "flight",
                    title: props.callsign ?? "Flight",
                    subtitle: `Altitude: ${Math.round(Number.isFinite(altitude) ? altitude : 0)} m`,
                    lat: event.lngLat.lat,
                    lng: event.lngLat.lng,
                    x: event.point.x,
                    y: event.point.y,
                });
            });

            map.on("mouseleave", layerId, () => {
                map.getCanvas().style.cursor = "";
                onPointHover?.(null);
            });
        } else {
            source.setData(data);
        }

        if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, "visibility", visibility?.flights === false ? "none" : "visible");
        }
    }, [flights, visibility?.flights, onPointHover]);

    useEffect(() => {
        if (!mapRef.current) return;

        if (visibility?.iss === false) {
            issMarkerRef.current?.remove();
            issMarkerRef.current = null;
            return;
        }

        if (!iss) return;

        const map = mapRef.current;
        if (!issMarkerRef.current) {
            const el = document.createElement("div");
            el.style.width = "14px";
            el.style.height = "14px";
            el.style.borderRadius = "9999px";
            el.style.background = "#a78bfa";
            el.style.border = "2px solid #ffffff";
            el.style.boxShadow = "0 0 10px #a78bfa, 0 0 20px #a78bfa";
            issMarkerRef.current = new maplibregl.Marker({ element: el }).setLngLat([iss.lng, iss.lat]).addTo(map);
        } else {
            issMarkerRef.current.setLngLat([iss.lng, iss.lat]);
        }
    }, [iss, visibility?.iss]);

    return <div ref={mapContainerRef} className="fixed inset-0 z-0" />;
}
