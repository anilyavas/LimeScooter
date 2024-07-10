import { FontAwesome6 } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useRef } from 'react';
import { Text, Image, View, Alert } from 'react-native';

import { Button } from './Button';
import scooterImage from '../assets/scooter.png';

import { supabase } from '~/lib/supabase';
import { useAuth } from '~/providers/AuthProvider';
import { useScooter } from '~/providers/ScooterProvider';
export default function SelectedScooterSheet() {
  const { selectedScooter, duration, distance, isNearby } = useScooter();
  const { userId } = useAuth();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const startJourney = async () => {
    const { data, error } = await supabase
      .from('rides')
      .insert([{ user_id: userId, scooter_id: selectedScooter.id }])
      .select();
    if (error) {
      Alert.alert('Failed to start the ride!');
    } else {
      console.warn('Ride started');
      console.log(data);
    }
  };

  useEffect(() => {
    if (selectedScooter) {
      bottomSheetRef.current?.expand();
    }
  }, [selectedScooter]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={[200]}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: '#414442' }}>
      {selectedScooter && (
        <BottomSheetView style={{ flex: 1, padding: 10, gap: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image source={scooterImage} style={{ width: 60, height: 60 }} />
            <View style={{ flex: 1, gap: 5 }}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>Lime - S</Text>
              <Text style={{ color: 'grey', fontSize: 16 }}>
                id-{selectedScooter.id} · Yıldırımlar Sk.
              </Text>
            </View>
            <View style={{ gap: 5 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  alignSelf: 'flex-start',
                }}>
                <FontAwesome6 name="flag-checkered" size={18} color="#42E100" />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                  {(distance / 1000).toFixed(1)} km
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  gap: 5,
                }}>
                <FontAwesome6 name="clock" size={18} color="#42E100" />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                  {(duration / 60).toFixed(0)} min
                </Text>
              </View>
            </View>
          </View>
          {/* Bottom part */}
          <View>
            <Button disabled={!isNearby} title="Start journey" onPress={startJourney} />
          </View>
        </BottomSheetView>
      )}
    </BottomSheet>
  );
}
