import { useState } from "react";
import Cookies from "universal-cookie";

export const useCookie = (key: string, value: any, options: any) => {
  const cookies = new Cookies();
  const [cookie, setCookie] = useState(() => {
    if (cookies.get(key)) {
      return cookies.get(key);
    }
    cookies.set(key, JSON.stringify(value), options);
  });
  const [lengthCookie, setLengthCookie] = useState(() => {
    if (cookies.get(key)) {
      return cookies.get(key).length;
    } else {
      return 0;
    }
  });

  const updateCookie = (value: any, options: any) => {
    setCookie(value);
    setLengthCookie(value.length);
    removeItem(key);
    cookies.set(key, JSON.stringify(value), options);
  };

  const removeItem = (key: any) => {
    cookies.remove(key);
  };

  return [cookie, updateCookie, removeItem, lengthCookie];
};
