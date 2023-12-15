import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Avatar, Card, Title } from 'react-native-paper';
import Resource from '@/constants/Resource';

interface ProfileState {
  firstName: string;
  lastName: string;
  selectedImage: string | null;
}

class Profile extends Component<{}, ProfileState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      selectedImage: null,
    };
  }

  handleInputChange = (field: string, text: string) => {
    this.setState({ [field]: text } as any);
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <Avatar.Image
            size={100}
            source={
              this.state.selectedImage
                ? { uri: this.state.selectedImage }
                : { uri: Resource.image }
            }
            style={{ borderRadius: 50 }}
          />
        </View>
        <Title style={{ marginTop: 10, textAlign: 'center', color: '#2c3e50', fontSize: 20 }}>
          Профиль
        </Title>
        <TextInput
          placeholder="Имя"
          value={this.state.firstName}
          onChangeText={(text) => this.handleInputChange('firstName', text)}
          style={{
            marginTop: 16,
            marginBottom: 16,
            borderBottomWidth: 1,
            paddingVertical: 8,
            borderColor: '#3498db',
          }}
        />
        <TextInput
          placeholder="Фамилия"
          value={this.state.lastName}
          onChangeText={(text) => this.handleInputChange('lastName', text)}
          style={{
            marginTop: 16,
            marginBottom: 16,
            borderBottomWidth: 1,
            paddingVertical: 8,
            borderColor: '#3498db',
          }}
        />

        <TouchableOpacity
          style={{
            backgroundColor: '#2ecc71',
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
          }}
          onPress={this.handleImagePicker}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Выбрать фото</Text>
        </TouchableOpacity>
        {this.state.selectedImage && (
          <Image
            source={{ uri: this.state.selectedImage }}
            style={{ width: '100%', height: 200, marginTop: 16, borderRadius: 8 }}
          />
        )}

        <Text>
          {this.state.firstName}  {this.state.lastName}
        </Text>
      </View>
    );
  }
}

export default Profile;
