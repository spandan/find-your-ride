"use client";

import { useEffect, useRef, useState } from "react";
import Map, {
  AttributionControl,
  Marker,
  NavigationControl,
  Popup,
  type MapRef,
} from "react-map-gl/maplibre";
import type { MapListing } from "@/lib/types";
import { MAP_STYLE_URL } from "@/lib/constants";
import { ListingHoverCard } from "./ListingHoverCard";
import { ListingPopup } from "./ListingPopup";
import { MapMarker } from "./MapMarker";
import "maplibre-gl/dist/maplibre-gl.css";

type MapViewProps = {
  center: { lat: number; lng: number };
  zoom: number;
  listings: MapListing[];
  selectedId: string | null;
  isLoggedIn: boolean;
  onSelectListing: (id: string | null) => void;
  onLogin: () => void;
};

export function MapView({
  center,
  zoom,
  listings,
  selectedId,
  isLoggedIn,
  onSelectListing,
  onLogin,
}: MapViewProps) {
  const mapRef = useRef<MapRef>(null);
  const prevView = useRef({ lat: center.lat, lng: center.lng, zoom });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const { lat, lng } = center;
    const prev = prevView.current;
    if (lat === prev.lat && lng === prev.lng && zoom === prev.zoom) return;

    mapRef.current?.flyTo({
      center: [lng, lat],
      zoom,
      duration: 900,
      essential: true,
    });
    prevView.current = { lat, lng, zoom };
  }, [center.lat, center.lng, zoom]);

  const selectedListing = selectedId
    ? listings.find((listing) => listing.id === selectedId)
    : null;

  const hoveredListing =
    isLoggedIn && hoveredId && hoveredId !== selectedId
      ? listings.find((listing) => listing.id === hoveredId)
      : null;

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: center.lng,
        latitude: center.lat,
        zoom,
      }}
      mapStyle={MAP_STYLE_URL}
      style={{ width: "100%", height: "100%" }}
      scrollZoom
      attributionControl={false}
      onClick={() => onSelectListing(null)}
    >
      <AttributionControl position="bottom-right" compact />
      <NavigationControl position="bottom-right" showCompass={false} />

      {listings.map((listing) => {
        const isSelected = selectedId === listing.id;
        const isHovered = hoveredId === listing.id;

        return (
          <Marker
            key={listing.id}
            longitude={listing.displayLongitude}
            latitude={listing.displayLatitude}
            anchor="center"
            onClick={(event) => {
              event.originalEvent.stopPropagation();
              onSelectListing(listing.id);
            }}
          >
            <div
              className="cursor-pointer touch-manipulation"
              aria-label="Family listing"
              onMouseEnter={() => setHoveredId(listing.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <MapMarker
                schoolGroup={listing.schoolGroup}
                status={listing.status}
                selected={isSelected}
                highlighted={!isSelected}
                hovered={isHovered}
              />
            </div>
          </Marker>
        );
      })}

      {hoveredListing && (
        <Popup
          longitude={hoveredListing.displayLongitude}
          latitude={hoveredListing.displayLatitude}
          anchor="bottom"
          offset={16}
          closeButton={false}
          closeOnClick={false}
          className="family-hover-popup"
          maxWidth="none"
        >
          <ListingHoverCard listing={hoveredListing} />
        </Popup>
      )}

      {selectedListing && (
        <Popup
          key={`${selectedListing.id}-${isLoggedIn}`}
          longitude={selectedListing.displayLongitude}
          latitude={selectedListing.displayLatitude}
          anchor="bottom"
          offset={24}
          closeOnClick={false}
          onClose={() => onSelectListing(null)}
          className="family-popup"
          maxWidth="none"
        >
          <ListingPopup
            listing={selectedListing}
            isLoggedIn={isLoggedIn}
            onLogin={onLogin}
          />
        </Popup>
      )}
    </Map>
  );
}
