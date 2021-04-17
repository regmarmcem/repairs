import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import mapDispatchToPros from '../reducers/combined';
import { viewStyles, styleButtons, toolbarStyles, mapStyles } from '../styles';
import { closeIcon, checkmarkIcon } from '../utils/icons';
import { blackColor } from '../styles/colors';
import CheckBox from '../components/CheckBox';
import IconButton from '../components/IconButton';

class ImageEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      caption: '',
      saveLocation: true,
      mapCenter: null
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        mapCenter: {
          // 以下は端末の設定に左右されるから、筑波大学の中心に固定する
          latitude: 36.110223,
          longitude: 140.099677,
        }
      });
    }, (error) => {
      error && console.log(error);
    });
  }

  cancelIcon() {

  }

  uploadIcon() {

  }

  onBackPress() {
    this.props.navigation.goBack();
  }

  onUploadImage() {
    if(this.state.tags && this.state.tags.length) {
      const image = {
        data: this.props.imageData.base64,
        uri: this.props.imageData.uri,
        imageExtension: this.props.imageExtension,
        tags: this.state.tags,
        caption: this.state.caption.trim(),
        location: this.state.saveLocation && this.state.mapCenter ? this.state.mapCenter : null
      };
      this.props.setIsAppWorking(true);
      this.props.uploadImage(image)
      .then(response => {
        this.props.setIsAppWorking(false);
        this.onBackPress();
        if(this.state.tags.indexOf(this.props.currentSearchTag) > -1) {
          this.props.fetchImages(this.props.currentSearchTag);
        }
      })
      .catch(ex => {
        this.props.setIsAppWorking(false);
        console.log(ex);
      });
    }
  }

  onTagChange(tagsValue) {
    let tags = [];
    if(tagsValue) {
      const valuesToSplit = tagsValue.trim();
      if(valuesToSplit.length) {
        tags = valuesToSplit.split(' ');
      }
    }
    this.setState({tags});
  }

  onCaptionChange(caption) {
    this.setState({caption});
  }

  onSaveLocationChanged(checked) {
    this.setState({saveLocation: checked});
  }

  onMapMarkerDragEnd(e) {
    this.setState({mapCenter: e.nativeEvent.coordinate});
  }

  render() {
    const imageUri = `data:image/jpeg;base64,${this.props.imageData}`;
    return (
      <KeyboardAvoidingView style={viewStyles.viewContainer}>
        <View style={toolbarStyles.toolbar}>
          <View style={[styles.topBarSection, styles.topBarSectionStart]}>
            <IconButton icon={closeIcon} color={blackColor} onPress={this.onBackPress.bind(this)} />
          </View>
          <View style={[styles.topBarSection, styles.topBarSectionEnd]}>
            <IconButton icon={checkmarkIcon} color={blackColor} onPress={this.onUploadImage.bind(this)} />
          </View>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.formInputs}>
            <TextInput style={styles.textInput}
              placeholder={this.props.language.imageEditor.tagsPlaceholder}
              autoCapitalize='none'
              onChangeText={this.onTagChange.bind(this)}
              underlineColorAndroid='transparent'>
            </TextInput>
            <TextInput style={styles.textInput}
              placeholder={this.props.language.imageEditor.captionPlaceholder}
              onChangeText={this.onCaptionChange.bind(this)}
              onSubmitEditing={this.onUploadImage.bind(this)}
              underlineColorAndroid='transparent'>
            </TextInput>
            <CheckBox checked={this.state.saveLocation}
                label={this.props.language.imageEditor.includeLocation}
                onCheckedChange={this.onSaveLocationChanged.bind(this)} />
          </View>
          <View style={styles.formThumbnail}>
            <Image source={{uri: imageUri}} style={styles.thumbnail} />
          </View>
        </View>
        {
          this.state.mapCenter &&
          <View style={mapStyles.mapContainer}>
            <MapView
              ref={ref => { this.map = ref; }}
              style={mapStyles.map}
              initialRegion={{
                latitude: this.state.mapCenter.latitude,
                longitude: this.state.mapCenter.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
              }}>
              <MapView.Marker coordinate={this.state.mapCenter} draggable
                      onDragEnd={this.onMapMarkerDragEnd.bind(this)}/>
            </MapView>
          </View>
        }
      </KeyboardAvoidingView>
    )
  }

  static mapToStateProps(state) {
    return {
      imageData: state.nav.params.imageData,
      imageExtension: state.nav.params.imageData.fileName ? state.nav.params.imageData.fileName.split('.')[1].toLowerCase() : 'jpg',
      currentSearchTag: state.currentSearchTag,
      language: state.language
    };
  }
}

const styles = StyleSheet.create({
  topBarSection: {
    flex: 0.5
  },
  topBarSectionStart: {
    alignItems: 'flex-start'
  },
  topBarSectionEnd: {
    alignItems: 'flex-end'
  },
  formContainer: {
    flexDirection: 'row',
    paddingBottom: 20
  },
  formInputs: {
    flex: 1,
    padding: 15,
    paddingTop: 10
  },
  textInput: {
    height: 40
  },
  formThumbnail: {
    width: 115,
    height: 115,
    padding: 15
  },
  thumbnail: {
    height: 85,
    width: 85
  }
});

export default connect(ImageEditor.mapToStateProps, mapDispatchToPros)(ImageEditor);
