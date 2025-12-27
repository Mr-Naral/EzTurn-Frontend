import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useCallback, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '24px'
};

const MapContainer = ({ userLocation, shops, onMarkerClick }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback(mapInstance) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={userLocation}
      zoom={14}
      options={{ 
        disableDefaultUI: true,
        clickableIcons: false 
      }}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* 🧍 User Marker */}
      <Marker 
        position={userLocation} 
        label="U"
      />

      {/* 🏪 Shop Markers */}
      {shops.map((shop) => (
        <Marker
          key={shop.id}
          position={{ lat: shop.latitude, lng: shop.longitude }}
          onClick={() => onMarkerClick(shop)}
          title={shop.shopName}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          }}
        />
      ))}
    </GoogleMap>
  ) : (
    <div className="h-[400px] w-full bg-gray-200 animate-pulse rounded-3xl" />
  );
};

export default MapContainer;