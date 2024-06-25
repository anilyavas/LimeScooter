import Mapbox, {
  Camera,
  Images,
  LocationPuck,
  MapView,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';
import { featureCollection, point } from '@turf/helpers';

import pin from '~/assets/pin.png';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

export default function Map() {
  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
      <Camera followZoomLevel={14} followUserLocation />
      <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />
      <ShapeSource
        id="scooters"
        shape={featureCollection([
          point(
            [30.47949770028006, 39.77401676943287],
            point([30.4840821948872, 39.772508574662694])
          ),
        ])}>
        <SymbolLayer
          id="scooter-icons"
          style={{
            iconImage: 'pin',
          }}
        />
        <Images images={{ pin }} />
      </ShapeSource>
    </MapView>
  );
}
