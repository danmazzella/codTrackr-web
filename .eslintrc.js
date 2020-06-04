module.exports = {
  "extends": [
    "airbnb",
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  "plugins": [],
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "node": true,
    "mocha": true,
    "es6": true
  },
  "ecmaFeatures": {
    "jsx": true,
    "es6": true,
    "classes": true
  },
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/sort-comp": "off",
    "react/jsx-filename-extension": "off",
    "react/jsx-one-expression-per-line": "off",
    "no-underscore-dangle": "off",
    "react/forbid-prop-types": "off",
    "eol-last": "off",
  },
  "globals": {
    "React": "writable"
  }
};