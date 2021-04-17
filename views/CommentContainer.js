import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
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
import FeedEntry from '../components/feed/FeedEntry';

class CommentContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      caption: '',
      saveLocation: true,
      mapCenter: null,
      comment: ''
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        mapCenter: {
          // 以下は端末の設定に左右されるから、筑波大学の中心に固定する()
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
        //If the new image contains the current search tag we need to fetch images again
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

  onAddCommentToImage() {
    if (this.state.comment.length > 0) {
      this.props.setIsAppWorking(true);
      this.props.addCommentToImage(this.state.comment, this.props.imageData.id, this.props.userId)
      .then(response => {
        this.props.setIsAppWorking(false);
        //ここに,responseに基づくfeedの更新処理が入るべき?
        // store.dispatch()
        this.onBackPress();
      })
      .catch(ex => {
        this.props.setIsAppWorking(false);
        console.log(ex);
      });
    }
  }

  onCommentChange(comment) {
    if (comment.length > 0) {
      this.setState({comment});
    }
  }

  onTagChange(tagsValue) {
    let tags = [];
    if (tagsValue) {
      const valuesToSplit = tagsValue.trim();
      if (valuesToSplit.length) {
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
    return (
      <KeyboardAvoidingView style={viewStyles.viewContainer}>
        <View style={toolbarStyles.toolbar}>
          <View style={[styles.topBarSection, styles.topBarSectionStart]}>
            <IconButton icon={closeIcon} color={blackColor} onPress={this.onBackPress.bind(this)} />
          </View>
          <View style={[styles.topBarSection, styles.topBarSectionEnd]}>
            <IconButton icon={checkmarkIcon} color={blackColor} onPress={this.onAddCommentToImage.bind(this)} />
          </View>
        </View>
        <ScrollView>
          <View>
            {/* TODO: imageの取得方法(actions/addCommentToEntry?)の戻り値を正しく実装する。　*/ }
            <FeedEntry key={this.props.imageData.id} image={this.props.imageData} commented={true} navigation={this.props.navigation} />;
          </View>
          <View style={styles.formContainer}>
            <View style={styles.formInputs}>
              <TextInput style={styles.textInput}
                multiline={true}
                placeholder={this.props.language.commentContainer.commentPlaceholder}
                autoCapitalize='none'
                autoFocus={true}
                onChangeText={this.onCommentChange.bind(this)}
                underlineColorAndroid='transparent'
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }

  static mapToStateProps(state) {
    return {
      imageData: state.nav.params.imageData,
      language: state.language,
      uuid: state.uuid,
      userId: state.userId
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
    height: 500
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

export default connect(CommentContainer.mapToStateProps, mapDispatchToPros)(CommentContainer);
