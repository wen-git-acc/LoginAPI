const messageListKeys = [
  "UserNotFound",
  "InvalidPassword",
  "LoginSuccesful",
  "LoginFailed",
  "InvalidBodyRequest",
  "EmailIsRegistered",
] as const;

type messageKeysType = (typeof messageListKeys)[number];

type messageListType = {
  [key in messageKeysType]: string;
};

const messageList: messageListType = {
  UserNotFound: "User is not found/Registered.",
  InvalidPassword: "Password is invalid.",
  LoginSuccesful: "Login is succcessful",
  LoginFailed: "Login attempt failed",
  InvalidBodyRequest: "Invalid body request",
  EmailIsRegistered: "This email is being used",
};
