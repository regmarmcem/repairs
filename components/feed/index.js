import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import FeedEntry from './FeedEntry';
import mapDispatchToPros from '../../reducers/combined';
import Icon from 'react-native-vector-icons/Ionicons';
import { imagesIcon } from '../../utils/icons';
import { yellowColor } from '../../styles/colors';

class Feed extends Component {
  constructor() {
    super();
    this.state = {
      refreshing: false
    }
  }

  images() {
    return Object.keys(this.props.searchedImages).map(key => this.props.searchedImages[key]);
  }

  _onRefresh() {
    this.props.fetchImages(this.props.currentSearchTag);
  }

  render() {
    const images = this.images();
    return (
      images.length ?
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
            {
              images.map(image => {
                return <FeedEntry
                  key={image.id}
                  image={image}
                  commented={false}
                  commentCount={image.comment_count}
                  navigation={this.props.navigation} />;
              })
            }
        </ScrollView>
        :
        <View style={styles.textContainer}>
            <Icon name={imagesIcon} size={100} color={yellowColor} />
            <Text style={styles.centerText}>{this.props.language.feed.noImagesToDisplay}</Text>
        </View>
    );
  }

  static mapStateToProps(state) {
    return {
      searchedImages: state.searchedImages,
      language: state.language,
      currentSearchTag: state.currentSearchTag
    };
  }
}

const styles = StyleSheet.create({
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    centerText: {
        fontSize: 20
    }
});

export default connect(Feed.mapStateToProps, mapDispatchToPros)(Feed);
