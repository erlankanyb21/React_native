import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Avatar, Card, Title } from 'react-native-paper';

interface ProfileState {
  inputValue: string;
  selectedImage: string | null;
}

class Profile extends Component<{}, ProfileState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      inputValue: '',
      selectedImage: null,
    };
  }

  handleInputChange = (text: string) => {
    this.setState({ inputValue: text });
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
      <View style={{ padding: 16, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Card>
          <Card.Content>
            {/* Аватар с выбранным изображением */}
            <View style={{ alignItems: 'center' }}>
              <Avatar.Image
                size={100}
                source={
                  this.state.selectedImage
                    ? { uri: this.state.selectedImage }
                    : {}
                }
              />
            </View>
            <Title style={{ marginTop: 10, textAlign: 'center' }}>Профиль</Title>

            {/* Поле ввода */}
            <TextInput
              placeholder="Введите что-то"
              value={this.state.inputValue}
              onChangeText={this.handleInputChange}
              style={{ marginTop: 16, marginBottom: 16, borderBottomWidth: 1, paddingVertical: 8 }}
            />

            {/* Кнопка для отображения введенного значения */}
            <TouchableOpacity
              style={{
                backgroundColor: '#3498db',
                padding: 10,
                borderRadius: 5,
                marginBottom: 10,
              }}
              onPress={() => {
                alert(this.state.inputValue);
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Показать введенное значение</Text>
            </TouchableOpacity>

            {/* Выбор фото */}
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

            {/* Отображение выбранного фото */}
            {this.state.selectedImage && (
              <Image
                source={{ uri: this.state.selectedImage }}
                style={{ width: '100%', height: 200, marginTop: 16, borderRadius: 8 }}
              />
            )}
          </Card.Content>
        </Card>
      </View>
    );
  }
}

export default Profile;
