require("dotenv").config();

const users = [
  {
    username: process.env.USERS,
    password: process.env.PASSWORD,
  },
];

const login = (username, password) => {
  if (username === users[0].username && password === users[0].password) {
    return true;
  } else {
    return false;
  }
};

module.exports = { login };
