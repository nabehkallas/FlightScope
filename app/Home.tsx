import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Exo2_400Regular, Exo2_700Bold, useFonts } from '@expo-google-fonts/exo-2';
import axios from 'axios';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { AutocompleteDropdown, AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { Calendar, DateData } from 'react-native-calendars';
import { useDebounce } from 'use-debounce';

import RadioButton from '../components/RadioButton';
import { useAuth } from '../context/AuthContext';
import { styles } from './home.styles';

export default function Home() {
  let [fontsLoaded] = useFonts({
    Exo2_400Regular,
    Exo2_700Bold,
  });
  // The useAuth hook now provides the signOut method from your context.
  const { signOut } = useAuth();
  const router = useRouter();
  const handleSignOut = () => {
    // This will call the signOut function from AuthContext,
    // which in turn calls Firebase's signOut method.
    signOut();
  };

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingInput, setEditingInput] = useState<'start' | 'end' | null>(null);
  const [tripType, setTripType] = useState<string | null>('OneWay');
  const [flightClass, setFlightClass] = useState<string | null>('economy');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [originQuery, setOriginQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [debouncedOriginQuery] = useDebounce(originQuery, 500);
  const [debouncedDestinationQuery] = useDebounce(destinationQuery, 500);
  const [originLocations, setOriginLocations] = useState<AirportResult[]>([]);
  const [destinationLocations, setDestinationLocations] = useState<AirportResult[]>([]);
  const [originLoading, setOriginLoading] = useState(false);
  const [destinationLoading, setDestinationLoading] = useState(false);
  const [originSkyId, setOriginSkyId] = useState<string | null>(null);
  const [originEntityId, setOriginEntityId] = useState<string | null>(null);
  const [destinationSkyId, setDestinationSkyId] = useState<string | null>(null);
  const [destinationEntityId, setDestinationEntityId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  interface AirportResult {
    skyId: string;
    presentation: {
      title: string;
      subtitle: string;
    };
    navigation: {
      entityId: string;
    };
  }

  const handleSearchFlights = async () => {
    setIsLoading(true);
    try {
      const requestParams = {
        market: 'en-US',
        adults: adults,
        children: children,
        infants: infants,
        cabinClass: flightClass,
        originSkyId: originSkyId,
        destinationSkyId: destinationSkyId,
        originEntityId: originEntityId,
        destinationEntityId: destinationEntityId,
        date: startDate,
        ...(tripType === 'RoundTrip' && endDate && { returnDate: endDate }),
      };
      console.log('Search Flights Request Parameters:', requestParams);

      const response = await axios.get(
        'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights',
        {
          headers: {
            'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
            'x-rapidapi-key': '85e13eb8d1msh13c0628c3ce4207p13d438jsnea6825247735',
          },
          params: requestParams,
        }
      );
      console.log('Flight search results:', response.data);
      router.push({
        pathname: '/Results',
        params: { flights: JSON.stringify(response.data.data) },
      });
    } catch (error) {
      console.error('Failed to search flights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAirports = useCallback(async (query: string, setLocations: React.Dispatch<React.SetStateAction<AirportResult[]>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (query.length < 2) {
      setLocations([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport',
        {
          headers: {
            'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
            'x-rapidapi-key': '85e13eb8d1msh13c0628c3ce4207p13d438jsnea6825247735',
          },
          params: {
            query: query,
            locale: 'en-US',
          },
        }
      );
      if (response.data && response.data.data) {
        setLocations(response.data.data);
      } else {
        setLocations([]);
      }
    } catch (error) {
      console.error('Failed to fetch airports:', error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAirports(debouncedOriginQuery, setOriginLocations, setOriginLoading);
  }, [debouncedOriginQuery, fetchAirports]);

  useEffect(() => {
    fetchAirports(debouncedDestinationQuery, setDestinationLocations, setDestinationLoading);
  }, [debouncedDestinationQuery, fetchAirports]);
  
  
  const handleOpenModal = (inputType: 'start' | 'end') => {
    setEditingInput(inputType);
  };

  useEffect(() => {
    setIsModalVisible(!!editingInput);
  }, [editingInput]);

  const handleDayPress = (day: DateData) => {
    if (editingInput === 'start') {
      setStartDate(day.dateString);
    } else if (editingInput === 'end') {
      setEndDate(day.dateString);
    }
    setEditingInput(null);
  };

  const handleResetDate = () => {
    if (editingInput === 'start') {
      setStartDate('');
    } else if (editingInput === 'end') {
      setEndDate('');
    }
    setEditingInput(null);
  };

  const handlePassengerChange = (
    type: 'adults' | 'children' | 'infants',
    operation: 'increment' | 'decrement'
  ) => {
    const totalPassengers = adults + children;

    if (type === 'adults') {
      if (operation === 'increment' && totalPassengers < 9) {
        setAdults(adults + 1);
      } else if (operation === 'decrement' && adults > 1) {
        const newAdults = adults - 1;
        setAdults(newAdults);
        // Ensure infants are not more than adults
        if (infants > newAdults) {
          setInfants(newAdults);
        }
      }
    } else if (type === 'children') {
      if (operation === 'increment' && totalPassengers < 9) {
        setChildren(children + 1);
      } else if (operation === 'decrement' && children > 0) {
        setChildren(children - 1);
      }
    } else if (type === 'infants') {
      if (operation === 'increment' && infants < adults) {
        setInfants(infants + 1);
      } else if (operation === 'decrement' && infants > 0) {
        setInfants(infants - 1);
      }
    }
  };

  return (
    <AutocompleteDropdownContextProvider>
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: () => <ThemedText type="title">FlightScope</ThemedText>,
            headerRight: () => (
              <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
                <ThemedText style={styles.signOutButtonText}>Sign Out</ThemedText>
              </TouchableOpacity>
            ),
            headerTitleAlign: 'left',
            headerShadowVisible: true,
            
          }}
        />
        <ScrollView>
        <ThemedView style={styles.container}>
          <AutocompleteDropdown
            containerStyle={styles.dropdownContainer}
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={false}
            onSelectItem={(item) => {
              if (item) {
                setOriginSkyId(item.id);
                setOriginEntityId(item.entityId);
              }
            }}
            onChangeText={setOriginQuery}
            dataSet={originLocations.map(item => ({ id: item.skyId, title: item.presentation.title, subtitle: item.presentation.subtitle, entityId: item.navigation.entityId }))}
            loading={originLoading}
            renderItem={(item, text) => (
                <View style={{ padding: 15 }}>
                  <ThemedText style={{ fontWeight: 'bold' }}>{item.title}</ThemedText>
                  <ThemedText>{item.subtitle}</ThemedText>
                </View>
              )}
            textInputProps={{
              placeholder: 'Where From?',
              style: [styles.textInput, { fontFamily: fontsLoaded ? 'Exo2_400Regular' : 'sans-serif' }],
            }}
            rightButtonsContainerStyle={styles.rightButtonsContainer}
            suggestionsListContainerStyle={styles.suggestionsListContainer}
            suggestionsListTextStyle={{
              color: '#FFFFFF',
              fontFamily: fontsLoaded ? 'Exo2_400Regular' : 'sans-serif',
            }}
            flatListProps={{
              ItemSeparatorComponent: () => <View style={styles.separator} />,
            }}
          />
          <AutocompleteDropdown
            containerStyle={styles.dropdownContainer}
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={false}
            onSelectItem={(item) => {
              if (item) {
                setDestinationSkyId(item.id);
                setDestinationEntityId(item.entityId);
              }
            }}
            onChangeText={setDestinationQuery}
            dataSet={destinationLocations.map(item => ({ id: item.skyId, title: item.presentation.title, subtitle: item.presentation.subtitle, entityId: item.navigation.entityId }))}
            loading={destinationLoading}
            renderItem={(item, text) => (
                <View style={{ padding: 15 }}>
                  <ThemedText style={{ fontWeight: 'bold' }}>{item.title}</ThemedText>
                  <ThemedText>{item.subtitle}</ThemedText>
                </View>
              )}
            textInputProps={{
              placeholder: 'Where To?',
              style: [styles.textInput, { fontFamily: fontsLoaded ? 'Exo2_400Regular' : 'sans-serif' }],
            }}
            rightButtonsContainerStyle={styles.rightButtonsContainer}
            suggestionsListContainerStyle={styles.suggestionsListContainer}
            suggestionsListTextStyle={{
              color: '#FFFFFF',
              fontFamily: fontsLoaded ? 'Exo2_400Regular' : 'sans-serif',
            }}
            flatListProps={{
              ItemSeparatorComponent: () => <View style={styles.separator} />,
            }}
          />
          <View style={styles.dateContainer}>
            <TouchableOpacity style={styles.dateInput} onPress={() => handleOpenModal('start')}>
              <ThemedText style={[styles.dateText, !!startDate && { color: '#000' }]}>{startDate || 'Departure Date'}</ThemedText>
            </TouchableOpacity>
            {tripType === 'RoundTrip' && (
              <TouchableOpacity style={styles.dateInput} onPress={() => handleOpenModal('end')}>
                <ThemedText style={[styles.dateText, !!endDate && { color: '#000' }]}>{endDate || 'Return Date'}</ThemedText>
              </TouchableOpacity>
            )}
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setEditingInput(null)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Calendar
                  onDayPress={handleDayPress}
                  markedDates={{
                    [startDate]: { selected: true, selectedColor: '#050955' },
                    [endDate]: { selected: true, selectedColor: '#050955' },
                  }}
                  theme={{
                    todayTextColor: '#0a7ea4',
                    arrowColor: '#050955',
                  }}
                />
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.resetButton]}
                    onPress={handleResetDate}>
                    <ThemedText style={styles.resetButtonText}>Reset</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.closeButton]}
                    onPress={() => setEditingInput(null)}>
                    <ThemedText style={styles.closeButtonText}>Close</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <View style={styles.passengerContainer}>
            <ThemedText style={[styles.title, { fontFamily: fontsLoaded && Platform.OS !== 'web' ? 'Exo2_700Bold' : 'sans-serif' }]}>
              Passengers
            </ThemedText>
            <View style={styles.counterRow}>
              <ThemedText style={styles.counterLabel}>Adults</ThemedText>
              <View style={styles.counterControls}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => handlePassengerChange('adults', 'decrement')}>
                  <ThemedText style={styles.counterButtonText}>-</ThemedText>
                </TouchableOpacity>
                <ThemedText style={styles.counterValue}>{adults}</ThemedText>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => handlePassengerChange('adults', 'increment')}>
                  <ThemedText style={styles.counterButtonText}>+</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.counterRow}>
              <ThemedText style={styles.counterLabel}>Children</ThemedText>
              <View style={styles.counterControls}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => handlePassengerChange('children', 'decrement')}>
                  <ThemedText style={styles.counterButtonText}>-</ThemedText>
                </TouchableOpacity>
                <ThemedText style={styles.counterValue}>{children}</ThemedText>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => handlePassengerChange('children', 'increment')}>
                  <ThemedText style={styles.counterButtonText}>+</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.counterRow}>
              <ThemedText style={styles.counterLabel}>Infants</ThemedText>
              <View style={styles.counterControls}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => handlePassengerChange('infants', 'decrement')}>
                  <ThemedText style={styles.counterButtonText}>-</ThemedText>
                </TouchableOpacity>
                <ThemedText style={styles.counterValue}>{infants}</ThemedText>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => handlePassengerChange('infants', 'increment')}>
                  <ThemedText style={styles.counterButtonText}>+</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.radioButtonGroupContainer}>
            <ThemedText style={[styles.title, { fontFamily: fontsLoaded && Platform.OS !== 'web' ? 'Exo2_700Bold' : 'sans-serif' }]}>
              Trip Type
            </ThemedText>
            <View style={styles.radioButtonRow}>
              <RadioButton
                label="One Way"
                value="OneWay"
                selectedValue={tripType}
                onValueChange={setTripType}
              />
              <RadioButton
                label="Round Trip"
                value="RoundTrip"
                selectedValue={tripType}
                onValueChange={setTripType}
              />
              <RadioButton
                label="Any"
                value={null}
                selectedValue={tripType}
                onValueChange={setTripType}
              />
            </View>
          </View>
          <View style={styles.radioButtonGroupContainer}>
            <ThemedText style={[styles.title, { fontFamily: fontsLoaded && Platform.OS !== 'web' ? 'Exo2_700Bold' : 'sans-serif' }]}>
              Class
            </ThemedText>
            <View style={styles.radioButtonRow}>
              <RadioButton
                label="Economy"
                value="economy"
                selectedValue={flightClass}
                onValueChange={setFlightClass}
              />
              <RadioButton
                label="Business"
                value="business"
                selectedValue={flightClass}
                onValueChange={setFlightClass}
              />
              <RadioButton
                label="First"
                value="first"
                selectedValue={flightClass}
                onValueChange={setFlightClass}
              />
              <RadioButton
                label="Premium Economy"
                value="premium_economy"
                selectedValue={flightClass}
                onValueChange={setFlightClass}
              />
              <RadioButton
                label="Any"
                value={null}
                selectedValue={flightClass}
                onValueChange={setFlightClass}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchFlights} disabled={isLoading || !originSkyId || !destinationSkyId}>
            {isLoading ? (
              <ThemedText style={styles.searchButtonText}>Searching...</ThemedText>
            ) : (
              <ThemedText style={styles.searchButtonText}>Search Flights</ThemedText>
            )}
          </TouchableOpacity>
        </ThemedView>
        </ScrollView>
      </>
    </AutocompleteDropdownContextProvider>
  );
}