import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const fetchedComments = createReducer({}, {
  [types.SET_FETCHED_COMMENTS](state, action) {
    let newState = {};
    action.comments.forEach(comment => {
      newState[comment.id] = comment;
    });
    return newState;
  }
});
