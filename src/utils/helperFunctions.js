import moment from "moment/moment";
import { NavItem } from "react-bootstrap";

// set in localStorage function
export const setInLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};
// get from localStorage function
export const getFromLocalStorage = (key) => {
  return localStorage.getItem(key);
};
// remove from localStorage function
export const removeFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};

export const asynchronouslySetInLocal = async (item, data) => {
  const res = localStorage.setItem(`${item}`, data);
  return res;
};
export const asynchronouslyGetFromLocal = async (item) => {
  const res = localStorage.getItem(`${item}`);
  return res;
};
export const asynchronouslyRemoveFromLocal = async (item) => {
  localStorage.removeItem(item);
  // console.log(item)
};

export const getCurrentUserId = () => {
  if (localStorage.getItem("D_USER_ID")) {
    return localStorage.getItem("D_USER_ID");
  }
}

export const maskPhone = (phone) => {
  let num = phone.toString();

  let first3 = num.substring(0, 3);
  let last2 = num.substring(num.length - 2);

  let mask = phone.substring(3, phone.length - 2).replace(/\d/g, "*");
  mask = `${first3}${mask}${last2}`;

  return mask;
}



export const getDaysOfMonth = function () {
  const year = moment().year();
  const month = moment().month();

  var monthDate = moment(year + '-' + month, 'YYYY-MM');
  var daysInMonth = monthDate.daysInMonth();
  var arrDays = [];

  while (daysInMonth) {
    var current = moment().date(daysInMonth);
    arrDays.push(current.format('MM-DD-YYYY'));
    daysInMonth--;
  }
  return arrDays;
};


export const getMonthAndYear = function () {
  var monthDate = moment().date(1);
  var monthName = monthDate.format('MMMM YYYY');
  return [monthName];
}

export const capitalizeWithSplit = (str, splitBy) => {
  let splittedString = str.split(splitBy);

  let str1 = splittedString[0].charAt(0).toUpperCase() + splittedString[0].slice(1);
  let str2 = splittedString[1].charAt(0).toUpperCase() + splittedString[1].slice(1);

  return `${str1} ${str2}`;
}

export const formatDate = (date, formatString) => {
  return moment(date).format(formatString).toString().substring(0, 10)
}

export const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const isProduction = () => {
  let baseUrl = process.env.REACT_APP_BASE_URL;

  if (baseUrl.includes("staging")) {
    return false;
  }

  else {
    return true;
  }
}

export async function dataUrlToFile(dataUrl, fileName) {
  const type = dataUrl.match(/^data:(.+);base64/)?.[1];
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: type });
}

export const generateDobArray = (type) => {
  let arr = [];
  let endLimit;

  if(type === "day") {
    endLimit = 31;
  }

  else {
    endLimit = 12;
  }

  for(let i=1; i<=endLimit; i++) {
    if(i<10) {
      arr.push(`0${i}`);
    }

    else {
      arr.push(i);
    }
    
  }

  return arr;
}

export const generateDobYears = () => {
  let arr = [];

  for(let i=1940; i<=2023; i++) {
    arr.unshift(i);
  }

  return arr;

}

export function isDigits(input) {
  const regex = /^\d+$/;
  return regex.test(input);
}

export function isAlphabetsOnly(input) {
  const regex = /^[a-zA-Z\s]+$/;
  return regex.test(input);
}