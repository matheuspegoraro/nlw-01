import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { 
  View, 
  ImageBackground, 
  Image, 
  StyleSheet, 
  Text, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Picker
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const navigation = useNavigation();

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);

      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') return; 

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
      const cityNames = response.data.map(city => city.nome);

      setCities(cityNames);
    });
  }, [selectedUf]);

  function handleNavigateToPoints() {
    if (selectedUf !== '0' && selectedCity !== '0') {
      navigation.navigate('Points', {
        uf: selectedUf, 
        city: selectedCity
      });
    } else {
      Alert.alert('Ooooops...', 'Por favor, selecione uma cidade e UF.');
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')}></Image> 
          <View>
            <Text style={styles.title}>Seu market place de coleta de resíduos.</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedUf}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => setSelectedUf(itemValue)}
            >
              <Picker.Item label="Selecione uma UF" value="0" />
              {ufs.map(uf => (
                <Picker.Item key={String(uf)} label={uf} value={uf} />
              ))}
            </Picker>
          </View>
          
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCity}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => setSelectedCity(itemValue)}
            >
              <Picker.Item label="Selecione uma cidade" value="0" />
              {cities.map(city => (
                <Picker.Item key={String(city)} label={city} value={city} />
              ))}
            </Picker>
          </View>
          
          <RectButton style={styles.button} onPress={ handleNavigateToPoints }>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#fff" size={24} />
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: '#1a1a1a'
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#ffffff',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  picker: {
    height: 60,
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
    fontSize: 16,
  },

  pickerContainer: {
    borderRadius: 10, 
    overflow: 'hidden', 
    height: 60,
    marginBottom: 8,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});