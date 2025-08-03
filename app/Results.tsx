import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ResultsScreen() {
  const { flights } = useLocalSearchParams();
  const flightData = flights ? JSON.parse(flights as string) : [];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Flight Results' }} />
      <ThemedText type="title">Flight Search Results</ThemedText>
      <ScrollView style={styles.scrollView}>
        {flightData.length > 0 ? (
          flightData.map((flight: any, index: number) => (
            <ThemedView key={index} style={styles.flightCard}>
              <ThemedText type="subtitle">{flight.legs[0].origin.name} ({flight.legs[0].origin.displayCode}) to {flight.legs[0].destination.name} ({flight.legs[0].destination.displayCode})</ThemedText>
              <ThemedText>Departure: {new Date(flight.legs[0].departure).toLocaleString()}</ThemedText>
              <ThemedText>Arrival: {new Date(flight.legs[0].arrival).toLocaleString()}</ThemedText>
              <ThemedText>Duration: {Math.floor(flight.legs[0].durationInMinutes / 60)}h {flight.legs[0].durationInMinutes % 60}m</ThemedText>
              <ThemedText>Price: {flight.price.formatted}</ThemedText>
              {/* Add more flight details as needed */}
            </ThemedView>
          ))
        ) : (
          <ThemedText>No flights found for your search criteria.</ThemedText>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  flightCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
