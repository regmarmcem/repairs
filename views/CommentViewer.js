import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Button,
  AppState,
  ScrollView
} from 'react-native';
import { Linking } from 'expo';
import { connect } from 'react-redux';
import { ImagePicker, Permissions } from 'expo';
import ActionSheet from 'react-native-actionsheet';
import mapDispatchToPros from '../reducers/combined';
import IconButton from '../components/IconButton';
import FeedEntry from '../components/feed/FeedEntry';
import Comment from '../components/comment';
import Settings from '../components/Settings';
import { searchIcon, addIcon } from '../utils/icons';
import { viewStyles, toolbarStyles, buttonsStyles } from '../styles';
import { blackColor } from '../styles/colors';

class CommentViewer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tag: '',
      email: '',
      appState: AppState.currentState
    };
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
      this.props.setComment(this.state.tag)
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


  onImageDataResolved(imageData) {
    this.props.navigation.navigate('ImageEditor', { imageData });
    console.log(this.props)
  }

  render() {
    return (
      <ScrollView style={viewStyles.viewContainer}>
        <View style={toolbarStyles.toolbar}>
          <Settings />
        </View>
        <FeedEntry key={this.props.imageData.id} image={this.props.imageData} commented={true} navigation={this.props.navigation} />;
        <Comment style={{flex: 1}} navigation={this.props.navigation} comments={this.props.comments} />
      </ScrollView>
    )
  }

  static AddImageFromGalleryButtonIndex = 0;
  static AddImageFromCameraButtonIndex = 1;
  static AddImageCancelButtonIndex = 2;

  static mapStateToProps(state) {
    return {
      imageData: state.nav.params.imageData,
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
export default connect(CommentViewer.mapStateToProps, mapDispatchToPros)(CommentViewer);
