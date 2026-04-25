import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";

export const debounce = (cb, wait, immediate) => {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) cb.apply(context, args);
    }, wait);
    if (immediate && !timeout) cb.apply(context, args);
  };
};

// asynchronously get from localStorage
export const asynchronouslyGetFromLocal = async (key) => {
  let value = localStorage.getItem(key);
  if (value) {
    return value;
  }
};

export const getCurrentUserData = async () => {
  const options = {
    headers: { 'Authorization': Cookies.get('token') }
  };

  const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/user-info`, options);

  Cookies.set('doctorName', response?.data?.data?.name)

  if (response?.data?.code === 200) {
    return response?.data?.data?.user;
  }

  else {
    return false;
  }
}


export const getDatesArray = (startDate, stopDate) => {
  var dateArray = [];
  // var currentDate = moment(startDate);
  // var stopDate = moment(stopDate);
  while (startDate <= stopDate) {
    dateArray.push(moment(startDate).format("YYYY-MM-DD"));
    startDate = moment(startDate).add(1, "days");
  }
  return dateArray;
}

export const swapElements = (arr, i1, i2) => {
  // Step 1
  let temp = arr[i1];

  // Step 2
  arr[i1] = arr[i2];

  // Step 3
  arr[i2] = temp;
}
