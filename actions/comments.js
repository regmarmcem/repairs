import * as types from './types';
import Api from '../lib/api';
import * as config from '../config';
import * as apiUtils from '../utils/api';

export function fetchComments(entryId) {
  return (dispatch, getState) => {
    return Api.get(`${config.remoteServerURL}comments/fetch/${entryId}`)
      .then((response) => {
        dispatch(setFetchedComments({ comments: response.comments }));
      })
      .catch((ex) => {
        const noItemsHeader = ex.headers.map['x-cld-error'];
        if (noItemsHeader && noItemsHeader.length) {
          dispatch(setFetchedComments({ comments: []}));
        }
        else {
          throw ex;
        }
    });
  }
}

export function setFetchedComments({ comments }) {
  return {
    type: types.SET_FETCHED_COMMENTS,
    comments
  };
}
