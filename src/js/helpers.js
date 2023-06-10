import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

/*
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(`${url}`), timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // NOTE Really important to rethrow the error so the final catch in model.js can log useful data for the dev
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPost = fetch(url, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPost, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // NOTE Really important to rethrow the error so the final catch in model.js can log useful data for the dev
    throw err;
  }
};
*/
