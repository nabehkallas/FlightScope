import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    padding: 20,
    gap: 10,
  },
  button: {
    marginRight: 15,
    paddingVertical: 8,
  },
  signOutButton: {
    backgroundColor: '#050955',
    
     ...Platform.select({
      native: {
    left:35,
      }
    }),
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signOutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  dropdownContainer: {
    width: '70%',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    color: '#000',
    borderWidth: 1,
    borderColor: '#BDBDBD', // A light grey border
    fontFamily: 'Exo2_400Regular',
  },
  suggestionsListContainer: {
    backgroundColor: '#050955', // A very light grey for the dropdown background
    borderRadius: 5,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rightButtonsContainer: {
    // Moves the clear and dropdown icons to the left
    height: 30,
    alignSelf: 'center',
    ...Platform.select({
      native: {
        left: 0.2,
      },
      web: {
        right: 20,
      },
    }),
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0', // Light grey separator line
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    gap: 10,
  },
  dateInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    color: '#000',
    borderWidth: 1,
    borderColor: '#BDBDBD', // Reuse textInput styles
    flex: 1,
    justifyContent: 'center',
  },
  dateText: {
    color: '#BDBDBD',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
  },
  modalButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    flex: 0.45, // Each button takes up 45% of the container width
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#050955',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#F0F0F0', // A light grey background
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },
  resetButtonText: {
    color: '#050955',
    fontWeight: 'bold',
  },
  searchButton: {
    width: '70%',
    backgroundColor: '#050955',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    ...Platform.select({
      web: {
        color: '#050955',
      },
    }),
    marginBottom: 10,
  },
  radioButtonGroupContainer: {
    width: '70%',
    marginBottom: 20,
  },
  radioButtonRow: {
    
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  passengerContainer: {
    width: '70%',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 15,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    gap: 10,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterLabel: {
    fontSize: 16,
    color: '#333',
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  counterButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#050955',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
});

export const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 5,
    color: 'black',
    paddingRight: Platform.OS === 'web' ? 10 : 30,
    backgroundColor: '#FFFFFF',
    height: 48, // Explicit height for consistency
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 5,
    color: 'black',
    paddingRight: Platform.OS === 'web' ? 10 : 30,
    backgroundColor: '#FFFFFF',
    height: 48, // Explicit height for consistency
  },
  inputWeb: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    color: '#000',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    height: 48, // Explicit height for consistency
  },
  placeholder: {
    color: '#BDBDBD',
  },
  iconContainer: {
    top: 12,
    right: 15,
  },
  
});