import { Stack } from 'expo-router';

import ActiveRideSheet from '~/components/ActiveRideSheet';
import Map from '~/components/Map';
import SelectedScooterSheet from '~/components/SelectedScooterSheet';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home', headerShown: false }} />
      <Map />
      <SelectedScooterSheet />
      <ActiveRideSheet />
    </>
  );
}
