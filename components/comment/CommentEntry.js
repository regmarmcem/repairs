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

class CommentEntry extends Component {

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

	onLocationPress() {
		this.props.navigation.navigate('CommentViewer', { imageData: this.props.image });
	}

	bottomPaddingRight() {
		return 5;
	}

	render() {
		const comment = this.props.comment;
		const bottomPaddingRight = this.bottomPaddingRight();
		return (
			<View style={styles.feedEntry}>
				<View style={styles.top}>
					<Image source={require('../../resources/img/logo.jpg')}
						style={styles.logoImage}>
					</Image>
				</View>
				<View style={styles.captionContainer}>
					<Text style={styles.captionText} >{comment}</Text>
				</View>

				<View style={[styles.bottom, { paddingRight: bottomPaddingRight }]}>
					<LikeButton />
					<IconButton icon={commentIcon} style={buttonsStyles.marginLeftButton} onPress={this.onCommentPress.bind(this)}/>
				</View>
			</View>
		);
	}

	static mapStateToProps(state) {
    return {
      language: state.language
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
		//Why this weird math??
		padding: 10,
		paddingBottom: 5,
		flexDirection: 'row'
	},
	rightButtonWrapper: {
		flex: 1,
		alignItems: 'flex-end'
	}
});

export default connect(CommentEntry.mapStateToProps, mapDispatchToPros)(CommentEntry);
