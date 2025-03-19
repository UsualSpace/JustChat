module.exports = {
    preset: "@shelf/jest-mongodb",
    testEnvironment: "node",
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
  };