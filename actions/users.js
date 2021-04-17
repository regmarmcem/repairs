import { AsyncStorage } from 'react-native';
import * as types from './types';
import Api from '../lib/api';
import * as config from '../config';
import * as apiUtils from '../utils/api';

export function activate(email, uuid) { //imageData, imageExtension, tagsArray, caption
  return (dispatch, getState) => {
    const url = `${config.remoteServerURL}users/authenticate`;
    const params = { email: email, password: uuid }

    return Api.post(url, params)
    .then((res) => {
      console.log("email was sent.")
      return res
    })
    .catch(ex => {
      throw ex;
    });
  }
}

export function fetchActivateStatus(email, uuid) {
  return (dispatch, getState) => {
    const url = `${config.remoteServerURL}users/user_json/${encodeURIComponent(email)}/${encodeURIComponent(uuid)}`;
    return Api.get(url)
    .then((response) => {
      const isActivated = response.activated.toString()
      const userId = response.id.toString()
      AsyncStorage.setItem('isActivated', isActivated)
      AsyncStorage.setItem('userId', userId)
      dispatch(setActivated(isActivated))
      dispatch(setUserId(userId))
    })
    .catch((ex) => {
      console.log("API Call error")
      throw ex;
    });
  }
}

export function setActivated(isActivated) {
  return {
    type: types.SET_ACTIVATED,
    isActivated: isActivated
  }
}

export function setUserId(userId) {
  return {
    type: types.SET_USER_ID,
    userId: userId
  }
}
