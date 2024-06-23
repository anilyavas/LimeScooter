import Mapbox, { MapView } from '@rnmapbox/maps';

const accessToken =
  'pk.eyJ1IjoiYW5pbHlhdmFzIiwiYSI6ImNseHFocTlndjA4MGgya3NlNDBzYnVwd24ifQ.0stTd8rND6fVJCDjBF1veQ';
Mapbox.setAccessToken(accessToken);

export default function Map() {
  return <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11" />;
}
