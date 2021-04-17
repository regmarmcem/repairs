import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import CommentEntry from './CommentEntry';
import mapDispatchToPros from '../../reducers/combined';
import Icon from 'react-native-vector-icons/Ionicons';
import { imagesIcon } from '../../utils/icons';
import { yellowColor } from '../../styles/colors';

class Comment extends Component {
  constructor() {
    super();
    this.state = {
      refreshing: false
    }
  }

  comments() {
    return Object.keys(this.props.comments).map(key => this.props.comments[key]);
  }

  _onRefresh() {
    this.props.fetchImages(this.props.currentSearchTag);
  }

  render() {
    const comments = this.comments();
    return (
      comments.length ?
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          {
            comments.map(comment => {
              return <CommentEntry
                key={comment.id}
                comment={comment.comment}
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
      comments: state.fetchedComments,
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

export default connect(Comment.mapStateToProps, mapDispatchToPros)(Comment);
