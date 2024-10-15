const jwt = require("jsonwebtoken");
const axios = require("axios");
const generateAuthToken = async function () {
  if (!this) throw Error("There is error");
  console.log(process.env.SECRET_CODE);
  const token = jwt.sign({ _id: this._id }, "thisismykey", {
    expiresIn: "7 day",
  });

  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

const PublishUserLoggedInOutEvent = async (payload) => {
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

const supportFunctionForLoginUser = async ({
  response,
  code,
  message,
  res,
}) => {
  if (code === 200) {
    const publishLogResponse = await PublishUserLoggedInOutEvent({
      data: { user: response.user, token: response.token },
      event: "USER_LOGGED_IN",
    });

    if (publishLogResponse.status === 200) {
      res.status(publishLogResponse.status).send({
        response,
        message: message + " and " + publishLogResponse.data.message,
        code,
      });
    } else {
      res.status(publishLogResponse.status).send({
        message: publishLogResponse.response.data,
        code: publishLogResponse.status,
        response: "",
      });
    }
  } else {
    res.status(code).send({ response, message, code });
  }
};

const supportFunctionForLogoutUser = async ({
  response,
  code,
  message,
  res,
}) => {
  if (code === 200) {
    const publishLogResponse = await PublishUserLoggedInOutEvent({
      data: { user: "", token: "" },
      event: "USER_LOGGED_OUT",
    });

    if (publishLogResponse.status === 200) {
      res.status(publishLogResponse.status).send({
        response,
        message: message + " and " + publishLogResponse.data.message,
        code,
      });
    } else {
      res.status(publishLogResponse.status).send({
        message: publishLogResponse.response.data,
        code: publishLogResponse.status,
        response: "",
      });
    }
  } else {
    res.status(code).send({ response, message, code });
  }
};

module.exports = {
  generateAuthToken,
  PublishUserLoggedInOutEvent,
  supportFunctionForLoginUser,
  supportFunctionForLogoutUser,
};
