module.exports = {
    testEnvironment: "jest-environment-jsdom",
    moduleFileExtensions: ["js", "jsx", "json", "node"], // Support .jsx files
    moduleNameMapper: {
      "../constants.js$": "<rootDir>/__mocks__/constants.js", // specific mapping first
    },
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest", // Transform JS/JSX files using Babel
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"]
  };