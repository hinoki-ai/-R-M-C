'use client';

import { Wrapper, Status } from '@googlemaps/react-wrapper';
import React, { useRef, useEffect, useState, ReactElement } from 'react';
import { AlertTriangle, Building, MapPin, ShoppingCart, Layers, Satellite, Map, Route, Eye, PenTool, Square, Circle, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface Location {
  id: string;
  name: string;
  type: 'residence' | 'business' | 'service' | 'emergency';
  coordinates: [number, number]; // [lat, lng]
  address: string;
  phone?: string;
  description: string;
  category?: string;
  rating?: number;
}

interface GoogleMapProps {
  locations: Location[];
  selectedLocation: Location | null;
  onLocationSelect: (location: Location) => void;
  className?: string;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'emergency': return AlertTriangle;
    case 'business': return ShoppingCart;
    case 'service': return Building;
    default: return MapPin;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'emergency': return '#ef4444'; // red-500
    case 'business': return '#10b981'; // green-500
    case 'service': return '#3b82f6'; // blue-500
    default: return '#6b7280'; // gray-500
  }
};

// Map Component
const MapComponent = ({
  center,
  zoom,
  locations,
  selectedLocation,
  onLocationSelect
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
  locations: Location[];
  selectedLocation: Location | null;
  onLocationSelect: (location: Location) => void;
}): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom]);

  return (
    <div ref={ref} className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-10">
        <p className="text-white bg-black p-2 rounded">Map Component - Simplified</p>
      </div>
    </div>
  );
};
// Loading Component
function MapLoadingComponent(): ReactElement {
  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
        <p className="text-gray-600">Cargando mapa...</p>
      </div>
    </div>
  );
}

// Error Component
function MapErrorComponent(): ReactElement {
  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-100">
      <div className="text-center p-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-2" />
        <p className="text-gray-600 mb-2">Error al cargar el mapa</p>
        <p className="text-sm text-gray-500">
          Verifica que la clave de API de Google Maps esté configurada correctamente.
        </p>
      </div>
    </div>
  );
}

// Main Google Maps Component
export default function GoogleMap({
  locations,
  selectedLocation,
  onLocationSelect,
  className = ''
}: GoogleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <MapErrorComponent />;
  }

  // Default center for Pinto Los Pellines, Chile
  const defaultCenter: google.maps.LatLngLiteral = {
    lat: -36.698,
    lng: -71.897
  };

  const render = (status: Status): ReactElement => {
    switch (status) {
      case Status.LOADING:
        return <MapLoadingComponent />;
      case Status.FAILURE:
        return <MapErrorComponent />;
      case Status.SUCCESS:
        return (
          <MapComponent
            center={defaultCenter}
            zoom={13}
            locations={locations}
            selectedLocation={selectedLocation}
            onLocationSelect={onLocationSelect}
          />
        );
      default:
        return <MapLoadingComponent />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Wrapper
        apiKey={apiKey}
        libraries={['places', 'geometry', 'drawing', 'visualization']}
        render={render}
      />
    </div>
  );
}
