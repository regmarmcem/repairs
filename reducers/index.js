import { combineReducers } from 'redux';
import * as appReducer from './app';
import * as imagesReducer from './images';
import * as usersReducer from './users';
import * as commentsReducer from './comments';
import * as nav from './nav';

export default combineReducers(Object.assign({},
  appReducer,
  nav,
  imagesReducer,
  usersReducer,
  commentsReducer
));
