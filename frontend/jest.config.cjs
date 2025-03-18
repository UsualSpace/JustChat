module.exports = {
    testEnvironment: "jsdom",
    moduleFileExtensions: ["js", "jsx", "json", "node"], // Support .jsx files
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1", // Adjust alias if using @ imports
    },
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest", // Transform JS/JSX files using Babel
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"]
  };