module.exports = {
  "parser": "babel-eslint",

  "extends": "eslint:recommended",

  "plugins": [
    "react"
  ],

  "rules": {
    /* For JS */
    "curly": 2,
    "dot-notation": 2,
    "func-style": [2, "declaration", {
      "allowArrowFunctions": true
    }],
    "indent": [2, 2],
    "key-spacing": [2, {
      "beforeColon": false,
      "afterColon": true
    }],
    "linebreak-style": [2, "unix"],
    "max-len": [2, 80, 4],
    "max-statements": [1, 20],
    "no-multi-spaces": 2,
    "no-new-wrappers": 2,
    "no-trailing-spaces": 2,
    "no-unused-expressions": [2, {
      "allowShortCircuit": true,
      "allowTernary": true
    }],
    "no-var": 2,
    "quotes": [2, "single"],
    "semi": 2,

    /* For JSX */
    "jsx-quotes": [2, "prefer-double"],
    "react/jsx-equals-spacing": [2, "never"],
    "react/jsx-indent": [2, 2],
    "react/jsx-indent-props": [1, 2],
    "react/jsx-key": 1,
    "react/no-direct-mutation-state": 2,
    "react/jsx-no-duplicate-props": 2,
    "react/jsx-no-undef": 1,
    "react/jsx-uses-react": 1,
    "react/self-closing-comp": 1,
    "react/wrap-multilines": 2
  }
}
