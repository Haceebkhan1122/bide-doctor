/* eslint-disable import/no-duplicates */
/* eslint-disable eqeqeq */
import { v4 as uuidv4 } from 'uuid';
import { getItem, setItem } from './localStorageHelper';
import { moment } from 'moment';
import API from '../utils/customAxios';

/**
 * API token will be required in each/every API
 * @param {*} token
 */
export const setAPIToken = (token) => {
  setItem('API_KEY', token);
};

/**
 * return API token saved in local storage
 * @returns
 */
export const getAPIToken = () => {
  const token = getItem('API_KEY');
  if (!token || token === null) return null;

  return `${token}`;
};

export const getUserId = () => {
  const userId = getItem('D_USER_ID');
  if (!userId || userId === null) return 0;

  return `${userId}`;
};

export const getQueryParams = (value, location) => {
  const { search } = location;
  const params = new URLSearchParams(search).get(value);
  return params;
};

const getOS = () => {
  let currentOS = 'not identified';
  if (navigator.appVersion.indexOf('Win') !== -1) {
    currentOS = 'windows';
  } else if (navigator.appVersion.indexOf('Mac') !== -1) {
    currentOS = 'mac';
  } else if (navigator.appVersion.indexOf('X11') !== -1) {
    currentOS = 'unix';
  } else if (navigator.appVersion.indexOf('Linux') !== -1) {
    currentOS = 'linux';
  }

  return currentOS;
};

export const getDeviceId = () => uuidv4();

export const validateEmail = (email) => {
  // eslint-disable-next-line operator-linebreak
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export default getOS;

export const navigateWithRefresh = (path) => {
  window.location.href = `${window.location.origin.toString()}/${path}`
}

export const getRemainingTime = (ts) => {
  const now = moment();
  const then = moment(ts);
  const diff = then.diff(now);
  const dur = moment.duration(diff);

  let parts = [];
  for (const part of ['days', 'hours', 'minutes', 'seconds']) {
    const d = dur[part]();
    dur.subtract(moment.duration(d, part));
    parts.push(d);
  }

  return parts;
}

export const formatTimeRemaining = (timeArray) => {
  let timeTypes = ['d', 'h', 'm', 's'];
  let timeRem = '';
  timeRem += `${timeArray[0]}${timeTypes[0]} `;
  timeRem += `${timeArray[1]}${timeTypes[1]} `;
  timeRem += `${timeArray[2]}${timeTypes[2]} `;
  timeRem += `${timeArray[3]}${timeTypes[3]}`;

  return timeRem;
}

export const playAudio = (url) => {
  var audio = document.createElement('audio');
  audio.src = url;
  audio.style.display = "none"; //added to fix ios issue
  audio.autoplay = false; //avoid the user has not interacted with your page issue
  audio.onended = function () {
    audio.remove(); //remove after playing to clean the Dom
  };
  document.body.appendChild(audio);
}

export const getAge = (dateString) => {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  if (isNaN(age)) {
    return null;
  }

  else {
    return age;
  }
}



export async function downloadPrescription(appointmentId) {
  try {

    const response = await API.get(`/appointment/download-prescription/${appointmentId}?is_html=1&is_download=1`);

    return response;

  } catch (error) {
    console.error(error);
    return error?.response?.data?.message || error?.message;
  }
}

export const capitalizeFirstLetter = (str) => {
  if (!str || typeof str === "undefined") {
    return "";
  }

  else {
    const arr = str.split(" ");

    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    const str2 = arr.join(" ");
    return str2;
  }
};

export const generateArray = (length) => {
  const array = [];
  for (let i = 0; i < length; i++) {
    array.push(i);
  }
  return array;
}

export const isElementRepeated = (array, element) => {
  const elementCount = {};

  for (let i = 0; i < array.length; i++) {
    const currentElement = array[i];
    if (elementCount[currentElement]) {
      elementCount[currentElement]++;
    } else {
      elementCount[currentElement] = 1;
    }
  }

  return elementCount[element] > 1;
}

export const getUniqueObjectsByKey = (arrayOfObjects, key) => {
  // Create a new Set to store the unique values of the key.
  const uniqueValues = new Set();

  // Declare a new array to store the unique objects.
  const uniqueObjects = [];

  // Iterate through the array of objects.
  for (const object of arrayOfObjects) {
    // Get the value of the key from the object.
    const value = object[key];

    // If the value is already in the Set, do nothing.
    if (uniqueValues.has(value)) {
      continue;
    }

    // Add the value to the Set and the array of unique objects.
    uniqueValues.add(value);
    uniqueObjects.push(object);
  }

  // Return the array of unique objects.
  return uniqueObjects;
}

export const getDegreesByInstituteWithYearOfCompletion = (arrayOfObjects) => {
  // Create a new Map to store the institutes and their degrees.
  const degreesByInstitute = new Map();

  // Iterate through the array of objects.
  for (const object of arrayOfObjects) {
    // Get the institute name from the object.
    const institute = object.institute_id;

    // Get the degrees from the object.
    const degrees = [object.degree_id];

    // Get the year of completion from the object.
    const yearOfCompletion = object.year_of_completion;

    // If the institute already exists in the Map, add the degrees and year of completion to it.
    if (degreesByInstitute.has(institute)) {
      degreesByInstitute.get(institute).push({
        institute: institute,
        degree: degrees[0],
        yearOfCompletion: yearOfCompletion
      });
    } else {
      // Otherwise, create a new entry in the Map with the institute, degrees, and year of completion.
      degreesByInstitute.set(institute, [{
        institute: institute,
        degree: degrees[0],
        yearOfCompletion: yearOfCompletion
      }]);
    }
  }

  // Return the Map as an array of objects.
  return Array.from(degreesByInstitute.values());
}

