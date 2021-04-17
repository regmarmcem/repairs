import * as types from './types';
import Api from '../lib/api';
import * as config from '../config';
import * as apiUtils from '../utils/api';

export function fetchImages(tag) {
  return (dispatch, getState) => {
    return Api.get(`${config.remoteServerURL}feed_images/fetch/${tag}`)
      .then((response) => {
        dispatch(setSearchedImages({ images: response.images }));
      })
      .catch((ex) => {
        const noItemsHeader = ex.headers.map['x-cld-error'];
        if (noItemsHeader && noItemsHeader.length) {
          dispatch(setSearchedImages({ images: []}));
        }
        else {
          throw ex;
        }
    });
  }
}

export function setSearchedImages({ images }) {
  return {
    type: types.SET_SEARCHED_IMAGES,
    images
  };
}

export function setCurrentSearchTag(tag) {
  return {
    type: types.SET_CURRENT_SEARCH_TAG,
    tag
  };
}

export function addCommentToImage(comment, feedImageId, userId) {
  return (dispatch, getState) => {
    const url = `${config.remoteServerURL}comments`;
    const params = {
      userId: userId,
      comment: comment,
      feedImageId: feedImageId
    };

    return Api.post(url, params)
    .then(comment => {
      dispatch({
        type: types.IMAGE_UPLOADED,
        comment: comment
      });
      return comment;
    })
    .catch(ex => {
      throw ex;
    });
  }
}

export function uploadImage(image) { //imageData, imageExtension, tagsArray, caption
  return (dispatch, getState) => {
    const url = `${config.remoteServerURL}feed_images/upload`;
    const params = {
      base64_data: image.data,
      tag: image.tags[0],
      caption: image.caption,
      latitude: image.location.latitude,
      longitude: image.location.longitude
    };

    return Api.post(url, params)
    .then(image => {
      console.log(image);
      dispatch({
        type: types.IMAGE_UPLOADED,
        image: image
      });
      return image;
    })
    .catch(ex => {
      throw ex;
    });
  }
}
