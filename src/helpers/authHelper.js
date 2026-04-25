import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { getItem, setItem } from './localStorageHelper';

export const getAuthToken = () => {
  const token = Cookies.get('user_id');

  if (!token || token === null) return null;

  return `${token}`;
};

/**
 *
 * @param {boolean} rememberMe -> represent user should be saved permanently
 * @param {string} token -> logged in user token
 */
export const setAuthToken = (token) => {
  if (token) {
    // set data in local storage
    setItem('user_id', token);
  }
  Cookies.set('user_id', token);
};

export const IsUserLoggedIn = () => {
  const token = getItem('user-id');
  let isloggedIn = false;

  if (token) {
    Cookies.set('user_id', token);
    isloggedIn = true;
  }

  return isloggedIn;
};

export const IsUserSignup = () => {
  const user = useSelector((state) => state?.AutthReducer?.user);
  if (user?.is_sign_up) {
    return true;
  }
  return false;
};

export const IsUserSubscribe = () => {
  const user = useSelector((state) => state?.AutthReducer?.user);
  if (user?.is_subscribed) {
    return true;
  }
  return false;
};

export const clearSession = () => {
  Cookies.remove('user_id');
  localStorage.clear();
};

export const getUserId = () => {
  let id = Cookies.get('user_id');

  return id;
}
