import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const currentSearchTag = createReducer({}, {
  [types.SET_CURRENT_SEARCH_TAG](state, action) {
    return action.tag;
  }
})

export const isActivated = createReducer(null, {
  [types.SET_ACTIVATED](state, action) {
    return action.isActivated;
  }
})

export const userId = createReducer(null, {
  [types.SET_USER_ID](state, action) {
    return action.userId;
  }
})
