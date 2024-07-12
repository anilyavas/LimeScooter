import * as Location from 'expo-location';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { useAuth } from './AuthProvider';

import { supabase } from '~/lib/supabase';

const RideContext = createContext({});

export default function RideProvider({ children }: PropsWithChildren) {
  const { userId } = useAuth();

  const [ride, setRide] = useState();

  const [rideRoute, setRideRoute] = useState([]);

  useEffect(() => {
    const fetchActiveRide = async () => {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', userId)
        .is('finished_at', null)
        .limit(1)
        .single();

      if (data) {
        setRide(data);
      }
    };
    fetchActiveRide();
  }, []);

  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;

    const watchLocation = async () => {
      subscription = await Location.watchPositionAsync({ distanceInterval: 50 }, (newLocation) => {
        console.log('New Location: ', newLocation.coords.longitude, newLocation.coords.latitude);
        setRideRoute((currentRoute) => [
          ...currentRoute,
          [newLocation.coords.longitude, newLocation.coords.latitude],
        ]);
        //  const from = point([newLocation.coords.longitude, newLocation.coords.latitude]);
        //  const to = point([selectedScooter.long, selectedScooter.lat]);
        //  const distance = getDistance(from, to, { units: 'meters' });
        //  if (distance < 100) {
        //    setIsNearby(true);
        //  }
      });
    };

    if (ride) {
      watchLocation();
    }

    // unsubscribe
    return () => {
      subscription?.remove();
    };
  }, [ride]);

  const startRide = async (scooterId: number) => {
    if (ride) {
      Alert.alert('Cannot start a new ride while another one is in progress');
      return;
    }
    const { data, error } = await supabase
      .from('rides')
      .insert([{ user_id: userId, scooter_id: scooterId }])
      .select();
    if (error) {
      Alert.alert('Failed to start the ride!');
      console.log(error);
    } else {
      setRide(data[0]);
    }
  };

  const finishRide = async () => {
    if (!ride) {
      return;
    }
    const { error } = await supabase
      .from('rides')
      .update({ finished_at: new Date() })
      .eq('id', ride.id);

    if (error) {
      Alert.alert('Failed to finish the ride');
    } else {
      setRide(undefined);
    }
  };

  console.log('Current ride: ', ride);
  return (
    <RideContext.Provider value={{ startRide, ride, finishRide, rideRoute }}>
      {children}
    </RideContext.Provider>
  );
}

export const useRide = () => useContext(RideContext);
