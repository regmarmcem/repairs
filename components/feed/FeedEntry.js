import React, { Component } from 'react';
import {
	View,
	Image,
	Dimensions,
	Text,
	StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import * as imageUtils from '../../utils/images';
import buttonsStyles from '../../styles/common/buttons';
import LikeButton from '../LikeButton';
import IconButton from '../IconButton';
import { locationIcon, commentIcon, moreIcon } from '../../utils/icons';
import { blackColor, lightGray } from '../../styles/colors';
import mapDispatchToPros from '../../reducers/combined';

class FeedEntry extends Component {

  constructor(props) {
		super(props);
		this.state = {
			imageWidth: Math.ceil(Dimensions.get('window').width)
		};
	}

	onLocationPress() {
		if (this.props.image.latitude && this.props.image.longitude) {
			const location = {
				latitude: parseFloat(this.props.image.latitude),
				longitude: parseFloat(this.props.image.longitude),
			};
			this.props.navigation.navigate('MapContainer', { marker: location });
		}
	}

	onCommentPress() {
		this.props.navigation.navigate('CommentContainer', { imageData: this.props.image })
	}

	onMoreIconPress() {
		this.props.fetchComments(this.props.image.id)
		this.props.navigation.navigate('CommentViewer', { imageData: this.props.image, comments: this.props.comments });
	}

	bottomPaddingRight() {
		return 5;
	}

	render() {
		const image = this.props.image;
		const imageUrl = imageUtils.resolveImageUrl(image, this.state.imageWidth);
		const bottomPaddingRight = this.bottomPaddingRight();
		const imageHasLocation = image.latitude && image.longitude;
		const hasComment = this.props.commentCount > 0 ? true : false

		return (
			<View style={styles.feedEntry}>
				<View style={styles.top}>
					<Image source={require('../../resources/img/gorilla-logo.jpg')}
						style={styles.logoImage}>
					</Image>
					{
						imageHasLocation &&
						<View style={styles.rightButtonWrapper}>
							<IconButton icon={locationIcon} onPress={this.onLocationPress.bind(this)} />
						</View>
					}
				</View>
				<Image source={{ uri: imageUrl }}
					style={[styles.image, { width: this.state.imageWidth }]}>
				</Image>
				{
					image.caption &&
					<View style={styles.captionContainer}>
						<Text style={styles.captionText} >{image.caption}</Text>
					</View>
				}
				{
					!this.props.commented &&
					<View style={[styles.bottom, { paddingRight: bottomPaddingRight }]}>
						<LikeButton />
						<IconButton icon={commentIcon} style={buttonsStyles.marginLeftButton} onPress={this.onCommentPress.bind(this)}/>
						{
							hasComment &&
							<View style={styles.rightButtonWrapper}>
								<IconButton icon={moreIcon} onPress={this.onMoreIconPress.bind(this)} />
							</View>
						}
					</View>
				}
			</View>
		);
	}

	static mapStateToProps(state) {
    return {
      language: state.language,
			comments: state.fetchedComments
    };
  }

}

const styles = StyleSheet.create({
	feedEntry: {
		borderBottomColor: blackColor,
		borderBottomWidth: 1,
	},
	top: {
		height: 60,
		padding: 10,
		flexDirection: 'row'
	},
	logoImage: {
		width: 40,
		height: 40
	},
	image: {
		height: 400
	},
	captionContainer: {
		padding: 10
	},
	captionText: {
		fontSize: 16,
		color: lightGray
	},
	bottom: {
		padding: 10,
		paddingBottom: 5,
		flexDirection: 'row'
	},
	rightButtonWrapper: {
		flex: 1,
		alignItems: 'flex-end'
	}
});

export default connect(FeedEntry.mapStateToProps, mapDispatchToPros)(FeedEntry);
