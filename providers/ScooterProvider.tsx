import getDistance from '@turf/distance';
import { point } from '@turf/helpers';
import * as Location from 'expo-location';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import { getDirections } from '~/services/directions';
const ScooterContext = createContext({});

export default function ScooterProvider({ children }: PropsWithChildren) {
  const [selectedScooter, setSelectedScooter] = useState();
  const [direction, setDirection] = useState();
  const [isNearby, setIsNearby] = useState(false);

  useEffect(() => {
    Location.watchPositionAsync({ distanceInterval: 100 }, (newLocation) => {
      if (selectedScooter) {
        console.log('Location updated: ', newLocation);
        const from = point([newLocation.coords.longitude, newLocation.coords.latitude]);
        const to = point([selectedScooter.long, selectedScooter.lat]);
        const distance = getDistance(from, to, { units: 'meters' });
        console.log(distance);
        if (distance < 50) {
          setIsNearby(true);
        }
      }
    });
    // unsubscribe
  }, []);
  useEffect(() => {
    const fetchDirections = async () => {
      const myLocation = await Location.getCurrentPositionAsync();

      const newDirection = await getDirections(
        [myLocation.coords.longitude, myLocation.coords.latitude],
        [selectedScooter.long, selectedScooter.lat]
      );
      setDirection(newDirection);
    };

    if (selectedScooter) {
      fetchDirections();
    }
  }, [selectedScooter]);
  console.log('Selected: ', selectedScooter);

  return (
    <ScooterContext.Provider
      value={{
        selectedScooter,
        setSelectedScooter,
        direction,
        directionCoordinates: direction?.routes?.[0]?.geometry.coordinates,
        duration: direction?.routes?.[0]?.duration,
        distance: direction?.routes?.[0]?.distance,
        isNearby,
      }}>
      {children}
    </ScooterContext.Provider>
  );
}

export const useScooter = () => useContext(ScooterContext);
