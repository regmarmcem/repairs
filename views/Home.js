import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Button,
  AppState,
  KeyboardAvoidingView
} from 'react-native';
import { Linking } from 'expo';
import { connect } from 'react-redux';
import { ImagePicker, Permissions } from 'expo';
import ActionSheet from 'react-native-actionsheet';
import mapDispatchToPros from '../reducers/combined';
import IconButton from '../components/IconButton';
import Feed from '../components/feed';
import Settings from '../components/Settings';
import { searchIcon, addIcon } from '../utils/icons';
import { viewStyles, toolbarStyles, buttonsStyles } from '../styles';
import { blackColor } from '../styles/colors';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tag: '',
      email: '',
      appState: AppState.currentState
    };
  }

  componentDidMount() {
    if (!this.props.isActivated) {
      AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    }
  }

  onActivateButtonPress() {
    this.props.activate(this.state.email, this.props.uuid)
  }

  onEmailChange(email) {
    this.setState({ email: email })
  }

  onSearchImagesPress() {
    if (this.state.tag) {
      this.props.setCurrentSearchTag(this.state.tag);
      this.props.setIsAppWorking(true);
      this.props.fetchImages(this.state.tag)
      .then(() => {
        this.props.setIsAppWorking(false);
      })
      .catch(() => {
        this.props.setIsAppWorking(false);
      });
    }
  }

  onTagSearchChange(tag) {
    let _tag = '';
    if(tag) {
      const valuesToSplit = tag.trim();
      if(valuesToSplit.length) {
        _tag = valuesToSplit.split(' ')[0] || '';
      }
    }
    this.setState({ tag: _tag });
  }

  onAddImage() {
    this.addImageActionSheet.show();
  }

  onAddImageActionSheetPress = async(index) => {
    if(index !== Home.AddImageCancelButtonIndex) {
      const permissionType = (index === Home.AddImageFromGalleryButtonIndex) ? 'CAMERA_ROLL' : 'CAMERA';
      const methodName = (index === Home.AddImageFromGalleryButtonIndex) ? 'launchImageLibraryAsync' : 'launchCameraAsync';

      const permissions = Permissions[permissionType];
      const { status } = await Permissions.askAsync(permissions);

      console.log(permissions, status);
      if (status === 'granted') {
        let image = await ImagePicker[methodName]({
          mediaTypes: 'Images',
          base64: true,
        }).catch(error => console.log(permissions, { error }));
        image && this.onImageDataResolved(image)
      }
    }
  }


  onImageDataResolved(imageData) {
    this.props.navigation.navigate('ImageEditor', { imageData });
    console.log(this.props)
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active' && this.props.isActivated !== true) {
      this.props.fetchActivateStatus(this.state.email, this.props.uuid)
    }
    this.setState({ appState: nextAppState });
  }

  render() {
    if (this.props.isActivated === 'true') {
      return (
        <KeyboardAvoidingView style={viewStyles.viewContainer}>
          <View style={toolbarStyles.toolbar}>
            <Settings />
            <TextInput style={styles.searchInput}
              returnKeyType='search'
              placeholder={this.props.language.home.searchByTag}
              autoCapitalize='none'
              onChangeText={this.onTagSearchChange.bind(this)}
              onSubmitEditing={this.onSearchImagesPress.bind(this)}
              underlineColorAndroid='transparent'>
            </TextInput>
            <IconButton icon={searchIcon} color={blackColor} onPress={this.onSearchImagesPress.bind(this)}/>
            <IconButton icon={addIcon} color={blackColor} onPress={this.onAddImage.bind(this)}/>
          </View>
          <Feed style={{flex: 1}} navigation={this.props.navigation} />
          <ActionSheet
            ref={(o) => this.addImageActionSheet = o}
            options={this.props.language.home.addImageOptions}
            cancelButtonIndex={Home.AddImageCancelButtonIndex}
            onPress={this.onAddImageActionSheetPress.bind(this)}
          />
        </KeyboardAvoidingView>
      )
    } else {
      console.log(this.props.isActivated)
      return (
        <KeyboardAvoidingView>
          <TextInput style={styles.ActivateInput}
            placeholder='筑波大学のメールアドレスを入力してください'
            onChangeText={this.onEmailChange.bind(this)}
            onSubmitEditing={this.onActivateButtonPress.bind(this)}
            underlineColorAndroid='transparent'>
          </TextInput>
          <Button
            title="送信する"
            onPress={this.onActivateButtonPress.bind(this)}
          />
        </KeyboardAvoidingView>
      )
    }
  }

  static AddImageFromGalleryButtonIndex = 0;
  static AddImageFromCameraButtonIndex = 1;
  static AddImageCancelButtonIndex = 2;

  static mapStateToProps(state) {
    return {
      uuid: state.uuid,
      isActivated: state.isActivated,
      searchedImages: state.searchedImages,
      language: state.language,
      userId: state.userId
    };
  }
}

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 5
  },
  ActivateInput: {
     margin: 15,
     height: 40,
     borderColor: '#7a42f4',
     borderWidth: 1
  },
  submitButton: {
     backgroundColor: '#7a42f4',
     padding: 10,
     margin: 15,
     height: 40,
  }
});
export default connect(Home.mapStateToProps, mapDispatchToPros)(Home);
