import CryptoJS from "crypto-js";

const url = window.location.href.split(":");
const ip = url[0] + ":" + url[1];
const port = 3000;

export const login = async ({ email, password }) => {
  const data = {
    email: email,
    password: password,
  };
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    "ZP7777"
  ).toString();
  console.log("login ", ip, port);
  try {
    let response = await fetch(`${ip}:${port}/usuario/login`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: encrypted }),
    });
    let dataResponse = await response.json();
    return dataResponse;
  } catch (error) {
    console.log(error);
  }
};

export const register = async ({ email, password, nombre, username }) => {
  const data = {
    email: email,
    password: password,
    nombre: nombre,
    username: username,
  };

  try {
    let response = await fetch(`${ip}:${port}/usuario/register`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let dataResponse = await response.json();
    return dataResponse;
  } catch (error) {
    console.log(error);
  }
};

export const logout = async () => {
  try {
    let response = await fetch(`${ip}:${port}/usuario/logout`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let dataResponse = await response.json();
    return dataResponse;
  } catch (error) {
    console.log(error);
  }
};
