import { Platform, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  image: {
    ...Platform.select({
      web: {
        top: -50,
        flex: 0.8,
        width: '40%',
      },
      default: {
        top: -50,
        flex: 0.4,
        width: '100%',
      },
    }),
  },
  input: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: Colors.light.background,
  },
  error: {
    color: Colors.light.error,
    marginBottom: 10,
  },
  buttonLabel: {
    fontSize: 14,
    color: 'white',
  },
  loginButton: {
    width: '35%',
    marginTop: 20,
    paddingVertical: 4,
  },
  signUpButton: {
    width: '40%',
    marginTop: 20,
    paddingVertical: 4,
  },
});