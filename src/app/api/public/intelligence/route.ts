import { NextRequest, NextResponse } from "next/server";

type JsonRecord = Record<string, unknown>;

async function fetchJson(url: string, init?: RequestInit, timeout = 8000): Promise<JsonRecord | null> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
        if (!response.ok) return null;
        return (await response.json()) as JsonRecord;
    } catch {
        return null;
    } finally {
        clearTimeout(timer);
    }
}

function asNumber(value: unknown, fallback = 0): number {
    return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export async function GET(req: NextRequest) {
    const lat = asNumber(Number(req.nextUrl.searchParams.get("lat")), 18.5204);
    const lng = asNumber(Number(req.nextUrl.searchParams.get("lng")), 73.8567);
    const year = new Date().getFullYear();

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation_probability,weather_code&daily=sunrise,sunset&timezone=auto`;
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi`;
    const quakesUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
    const issUrl = "https://api.wheretheiss.at/v1/satellites/25544";
    const flightsUrl = `https://opensky-network.org/api/states/all?lamin=${lat - 1.2}&lomin=${lng - 1.2}&lamax=${lat + 1.2}&lomax=${lng + 1.2}`;
    const newsUrl = "https://hn.algolia.com/api/v1/search?tags=front_page";
    const holidayUrl = `https://date.nager.at/api/v3/PublicHolidays/${year}/IN`;

    const overpassQuery = `[out:json][timeout:20];(node["amenity"~"hospital|bank|school|restaurant|pharmacy"](around:2200,${lat},${lng}););out body 25;`;

    const [weatherRaw, aqiRaw, quakesRaw, issRaw, flightsRaw, newsRaw, holidayRaw, placesRaw] = await Promise.all([
        fetchJson(weatherUrl),
        fetchJson(aqiUrl),
        fetchJson(quakesUrl),
        fetchJson(issUrl),
        fetchJson(flightsUrl),
        fetchJson(newsUrl),
        fetchJson(holidayUrl),
        fetchJson("https://overpass-api.de/api/interpreter", {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=UTF-8" },
            body: overpassQuery,
        }, 12000),
    ]);

    const weatherCurrent = (weatherRaw?.current as JsonRecord | undefined) ?? {};
    const weatherDaily = (weatherRaw?.daily as JsonRecord | undefined) ?? {};
    const weather = {
        temperature: asNumber(weatherCurrent.temperature_2m, 0),
        humidity: asNumber(weatherCurrent.relative_humidity_2m, 0),
        wind: asNumber(weatherCurrent.wind_speed_10m, 0),
        rainChance: asNumber(weatherCurrent.precipitation_probability, 0),
        sunrise: Array.isArray(weatherDaily.sunrise) ? String(weatherDaily.sunrise[0] ?? "-") : "-",
        sunset: Array.isArray(weatherDaily.sunset) ? String(weatherDaily.sunset[0] ?? "-") : "-",
    };

    const aqiCurrent = (aqiRaw?.current as JsonRecord | undefined) ?? {};
    const aqiValue = asNumber(aqiCurrent.us_aqi, 0);
    const aqi = {
        value: aqiValue,
        label: aqiValue <= 50 ? "Good" : aqiValue <= 100 ? "Moderate" : aqiValue <= 150 ? "Unhealthy for Sensitive" : "Unhealthy",
    };

    const quakeFeatures = (quakesRaw?.features as Array<JsonRecord> | undefined) ?? [];
    const earthquakes = quakeFeatures.slice(0, 25).map((feature) => {
        const properties = (feature.properties as JsonRecord | undefined) ?? {};
        const geometry = (feature.geometry as JsonRecord | undefined) ?? {};
        const coordinates = (geometry.coordinates as number[] | undefined) ?? [0, 0];
        return {
            magnitude: asNumber(properties.mag, 0),
            place: String(properties.place ?? "Unknown"),
            time: asNumber(properties.time, Date.now()),
            lng: asNumber(coordinates[0], 0),
            lat: asNumber(coordinates[1], 0),
        };
    });

    const iss = {
        lat: asNumber(issRaw?.latitude, lat),
        lng: asNumber(issRaw?.longitude, lng),
        visibility: String(issRaw?.visibility ?? "unknown"),
    };

    const flightStates = (flightsRaw?.states as Array<Array<unknown>> | undefined) ?? [];
    const flights = flightStates
        .slice(0, 40)
        .map((state) => ({
            callsign: String(state[1] ?? "N/A").trim() || "N/A",
            lng: asNumber(state[5], 0),
            lat: asNumber(state[6], 0),
            altitude: asNumber(state[7], 0),
        }))
        .filter((flight) => flight.lat !== 0 || flight.lng !== 0);

    const newsHits = (newsRaw?.hits as Array<JsonRecord> | undefined) ?? [];
    const news = newsHits.slice(0, 5).map((item) => ({
        title: String(item.title ?? "Untitled"),
        url: String(item.url ?? ""),
    }));

    const holidays = Array.isArray(holidayRaw) ? (holidayRaw as Array<JsonRecord>) : [];
    const today = new Date().toISOString().slice(0, 10);
    const events = holidays
        .filter((holiday) => String(holiday.date ?? "") >= today)
        .slice(0, 4)
        .map((holiday) => ({
            name: String(holiday.localName ?? holiday.name ?? "Public Holiday"),
            date: String(holiday.date ?? ""),
        }));

    const placesElements = (placesRaw?.elements as Array<JsonRecord> | undefined) ?? [];
    const nearbyPlaces = placesElements.slice(0, 25).map((node) => {
        const tags = (node.tags as JsonRecord | undefined) ?? {};
        return {
            lat: asNumber(node.lat, lat),
            lng: asNumber(node.lon, lng),
            name: String(tags.name ?? tags.amenity ?? "Place"),
            category: String(tags.amenity ?? "other"),
        };
    });

    const traffic = {
        status: "Moderate",
        source: "Estimated (public keyless mode)",
    };

    return NextResponse.json({
        weather,
        aqi,
        traffic,
        earthquakes,
        flights,
        iss,
        nearbyPlaces,
        events,
        news,
    });
}
