'use client';

import React, { useEffect, useRef } from 'react';
import { SSBCentre } from '@/lib/data/ssbCentres';
import 'leaflet/dist/leaflet.css';

interface SSBMapProps {
  centres: SSBCentre[];
  selectedCentreId: string | null;
  onSelectCentre: (centreId: string) => void;
  userLocation: { lat: number; lng: number } | null;
}

export default function SSBMap({
  centres,
  selectedCentreId,
  onSelectCentre,
  userLocation,
}: SSBMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapInstance = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const userMarkerRef = useRef<any>(null);

  useEffect(() => {
    const container = mapRef.current;
    if (typeof window === 'undefined' || !container) return;

    // Dynamically import Leaflet to avoid SSR errors
    import('leaflet').then((L) => {
      if (!container) return;

      // Fix default Leaflet icon paths if missing
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Initialize map instance if not existing
      if (!leafletMapInstance.current) {
        const map = L.map(container, {
          center: [22.5937, 78.9629], // India center coordinates
          zoom: 5,
          zoomControl: false,
        });

        // Add sleek CartoDB Dark Matter / Voyager tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        leafletMapInstance.current = map;
      }

      const map = leafletMapInstance.current;

      // Clear existing markers
      Object.values(markersRef.current).forEach((marker: any) => map.removeLayer(marker));
      markersRef.current = {};

      // Create Custom SVG DivIcons based on Service Category
      const getServicePinHtml = (service: string, isSelected: boolean) => {
        let color = '#f0a924';
        let iconSvg = '';

        if (service === 'Air Force') {
          color = '#38bdf8'; // Sky Blue
          iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13 8.5 4.8 6.7c-.7-.1-1.3.3-1.5.9l-.3.9c-.2.6.1 1.2.7 1.5l5.3 3.5-3 3-2-1c-.4-.2-.9 0-1.1.4l-.4.7c-.2.4 0 .9.4 1.1l3.5 2.5 2.5 3.5c.2.4.7.6 1.1.4l.7-.4c.4-.2.6-.7.4-1.1l-1-2 3-3 3.5 5.3c.3.6.9.9 1.5.7l.9-.3c.6-.2 1-.8.9-1.5z"/></svg>`;
        } else if (service === 'Army') {
          color = '#84cc16'; // Camo Green
          iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
        } else if (service === 'Navy') {
          color = '#60a5fa'; // Maritime Blue
          iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>`;
        } else if (service === 'Coast Guard') {
          color = '#f97316'; // Rescue Saffron
          iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="4"/></svg>`;
        }

        const scale = isSelected ? 'scale(1.25)' : 'scale(1)';
        const shadow = isSelected ? `0 0 24px ${color}` : `0 4px 12px rgba(0,0,0,0.5)`;
        const borderWidth = isSelected ? '3px' : '2px';

        return `
          <div style="
            transform: ${scale};
            transition: all 0.25s ease;
            cursor: pointer;
            position: relative;
          ">
            <div style="
              width: 38px;
              height: 38px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              background: #141417;
              border: ${borderWidth} solid ${color};
              box-shadow: ${shadow};
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                transform: rotate(45deg);
                color: ${color};
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                ${iconSvg}
              </div>
            </div>
          </div>
        `;
      };

      // Add markers for all SSB Centres
      centres.forEach((centre) => {
        const isSelected = selectedCentreId === centre.id;
        const customIcon = L.divIcon({
          html: getServicePinHtml(centre.service, isSelected),
          className: 'custom-ssb-pin',
          iconSize: [38, 38],
          iconAnchor: [19, 38],
          popupAnchor: [0, -36],
        });

        const marker = L.marker([centre.coordinates.lat, centre.coordinates.lng], {
          icon: customIcon,
          zIndexOffset: isSelected ? 1000 : 100,
        }).addTo(map);

        // Build Popup HTML Content
        const popupContent = `
          <div style="
            font-family: system-ui, sans-serif;
            min-width: 220px;
            padding: 2px;
            color: #f4f4f5;
          ">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
              <span style="
                font-size: 10px;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                padding: 2px 8px;
                border-radius: 9999px;
                background: ${centre.service === 'Air Force' ? 'rgba(56,189,248,0.2)' : centre.service === 'Army' ? 'rgba(132,204,22,0.2)' : centre.service === 'Navy' ? 'rgba(96,165,250,0.2)' : 'rgba(249,115,22,0.2)'};
                color: ${centre.service === 'Air Force' ? '#38bdf8' : centre.service === 'Army' ? '#84cc16' : centre.service === 'Navy' ? '#60a5fa' : '#f97316'};
                border: 1px solid ${centre.service === 'Air Force' ? 'rgba(56,189,248,0.4)' : centre.service === 'Army' ? 'rgba(132,204,22,0.4)' : centre.service === 'Navy' ? 'rgba(96,165,250,0.4)' : 'rgba(249,115,22,0.4)'};
              ">
                ${centre.service}
              </span>
              <span style="font-size: 10px; font-weight: 700; color: #a1a1aa; background: #27272a; padding: 2px 6px; border-radius: 4px;">
                ${centre.centreCode}
              </span>
            </div>
            
            <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 800; color: #ffffff;">
              ${centre.centre}
            </h4>
            
            <p style="margin: 0 0 10px 0; font-size: 11px; color: #a1a1aa;">
              📍 ${centre.city}, ${centre.state} • ${centre.boards.length} ${centre.boards.length === 1 ? 'Board' : 'Boards'}
            </p>
            
            <div style="display: flex; gap: 6px;">
              <button 
                id="btn-view-${centre.id}"
                style="
                  flex: 1;
                  padding: 7px 10px;
                  background: #f0a924;
                  color: #000;
                  border: none;
                  border-radius: 8px;
                  font-size: 11px;
                  font-weight: 800;
                  cursor: pointer;
                "
              >
                View Centre
              </button>
              
              ${centre.googleMapsUrl ? `
                <a 
                  href="${centre.googleMapsUrl}"
                  target="_blank"
                  rel="noopener noreferrer"
                  style="
                    padding: 7px 10px;
                    background: #27272a;
                    color: #f4f4f5;
                    border: 1px solid #3f3f46;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 700;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                  title="Open in Google Maps"
                >
                  🗺️
                </a>
              ` : ''}
            </div>
          </div>
        `;

        const popup = L.popup({
          className: 'ssb-map-popup',
          closeButton: true,
        }).setContent(popupContent);

        marker.bindPopup(popup);

        marker.on('click', () => {
          onSelectCentre(centre.id);
        });

        // Add click listener inside popup
        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-view-${centre.id}`);
          if (btn) {
            btn.onclick = () => {
              onSelectCentre(centre.id);
            };
          }
        });

        markersRef.current[centre.id] = marker;
      });

      // Fit bounds if centres exist and no specific selected centre
      if (centres.length > 0 && !selectedCentreId) {
        const bounds = L.latLngBounds(centres.map((c) => [c.coordinates.lat, c.coordinates.lng]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
      }
    });
  }, [centres]);

  // Handle Selected Centre Map Pan
  useEffect(() => {
    if (!leafletMapInstance.current || !selectedCentreId) return;

    const selectedCentre = centres.find((c) => c.id === selectedCentreId);
    if (selectedCentre) {
      leafletMapInstance.current.flyTo(
        [selectedCentre.coordinates.lat, selectedCentre.coordinates.lng],
        12,
        { duration: 1.2 }
      );

      const marker = markersRef.current[selectedCentreId];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedCentreId, centres]);

  // Handle User Geolocation Marker ("Near Me")
  useEffect(() => {
    if (!leafletMapInstance.current) return;

    import('leaflet').then((L) => {
      const map = leafletMapInstance.current;

      if (userLocation) {
        if (userMarkerRef.current) {
          map.removeLayer(userMarkerRef.current);
        }

        const userPinHtml = `
          <div style="position: relative; width: 24px; height: 24px;">
            <div style="
              position: absolute;
              top: 0; left: 0; right: 0; bottom: 0;
              border-radius: 50%;
              background: rgba(59, 130, 246, 0.4);
              animation: sonarRipple 2s infinite ease-out;
            "></div>
            <div style="
              width: 14px;
              height: 14px;
              margin: 5px;
              border-radius: 50%;
              background: #3b82f6;
              border: 2px solid #ffffff;
              box-shadow: 0 0 12px #3b82f6;
            "></div>
          </div>
        `;

        const userIcon = L.divIcon({
          html: userPinHtml,
          className: 'user-geo-pin',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
          icon: userIcon,
          zIndexOffset: 2000,
        })
          .addTo(map)
          .bindPopup('<b>📍 Your Approximate Location</b>')
          .openPopup();

        map.flyTo([userLocation.lat, userLocation.lng], 10, { duration: 1.5 });
      } else if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
    });
  }, [userLocation]);

  // Handle Map Container Resize
  useEffect(() => {
    const container = mapRef.current;
    if (!container || typeof window === 'undefined') return;

    const resizeObserver = new ResizeObserver(() => {
      if (leafletMapInstance.current) {
        leafletMapInstance.current.invalidateSize();
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[350px] md:min-h-full rounded-2xl overflow-hidden border theme-border shadow-xl">
      <div id="ssb-map-container" ref={mapRef} className="w-full h-full z-10" />

      {/* CSS overrides for dark Leaflet Popups */}
      <style jsx global>{`
        .ssb-map-popup .leaflet-popup-content-wrapper {
          background: #18181b !important;
          border: 1px solid #27272a !important;
          border-radius: 14px !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5) !important;
          padding: 8px !important;
        }
        .ssb-map-popup .leaflet-popup-tip {
          background: #18181b !important;
          border: 1px solid #27272a !important;
        }
        .ssb-map-popup .leaflet-popup-close-button {
          color: #a1a1aa !important;
          padding: 6px !important;
        }
        .ssb-map-popup .leaflet-popup-close-button:hover {
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
