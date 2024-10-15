const axios = require("axios");

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
    throw new Error(e);
  }
};

PublishShoppingEvent = async (payload) => {
  try {
    const response = axios.post(
      "http://localhost:8000/shopping/app-events",
      payload
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  PublishCustomerEvent,
  PublishShoppingEvent,
};
