import React from "react";
import { useNavigate } from "react-router-dom";

export const redirectTo = (path) => {
  const nav = useNavigate();
  nav.push(path);
};

export const generateRandomNumber = ()=>  {
    const min = 100000; // Minimum value (inclusive)
    const max = 999999; // Maximum value (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

export const returnFormattedNumbert = (num) => {
    if (isNaN(num)) return 0
    return parseFloat(num)
}