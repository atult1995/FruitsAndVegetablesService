const axios = require("axios");

const LOGGED_IN_USER = {
  user: {},
  token: "",
};

PublishCustomerEvent = async (payload) => {
  try {
    const response = axios.post(
      "http://localhost:8000/customer/app-events",
      { data: payload.data, event: payload.event },
      {
        headers: payload.headers,
      }
    );
    return response;
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  LOGGED_IN_USER,
  PublishCustomerEvent,
};
