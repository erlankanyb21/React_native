import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Avatar, Title } from 'react-native-paper';
import Resource from '@/constants/Resource';

class Profile extends Component {
  state = {
    firstName: '',
    lastName: '',
    selectedImage: null,
  };

  handleInputChange = (field:string, text:string) => {
    this.setState({ [field]: text });
  };

  handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      console.log('Отказано в доступе к галерее');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      this.setState({ selectedImage: result.assets[0].uri });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={100}
            source={
              this.state.selectedImage
                ? { uri: this.state.selectedImage }
                : { uri: Resource.image }
            }
            style={styles.avatar}
          />
        </View>
        <Title style={styles.title}>Профиль</Title>
        <TextInput
          placeholder="Имя"
          value={this.state.firstName}
          onChangeText={(text) => this.handleInputChange('firstName', text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Фамилия"
          value={this.state.lastName}
          onChangeText={(text) => this.handleInputChange('lastName', text)}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={this.handleImagePicker}
        >
          <Text style={styles.buttonText}>Выбрать фото</Text>
        </TouchableOpacity>
        {this.state.selectedImage && (
          <Image
            source={{ uri: this.state.selectedImage }}
            style={styles.image}
          />
        )}

        <Text style={styles.fullName}>
          {this.state.firstName} {this.state.lastName}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 50,
  },
  title: {
    marginTop: 10,
    textAlign: 'center',
    color: '#2c3e50',
    fontSize: 20,
  },
  input: {
    marginTop: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingVertical: 8,
    borderColor: '#3498db',
    width: '80%',
  },
  button: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  image: {
    width: '80%',
    height: 200,
    marginTop: 16,
    borderRadius: 8,
  },
  fullName: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
