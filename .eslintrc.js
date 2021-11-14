module.exports = {
  env: {
    node: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      modules: true,
    },
  },
  extends: [
    'airbnb-base',
    // 'prettier',
    'plugin:promise/recommended',
  ],
  plugins: ['promise' /*, 'prettier'*/],
  rules: {
    'no-console': 2,
    'prefer-arrow-callback': 2,
    'no-param-reassign': 0,
    'class-methods-use-this': 0,
    // 'semi': ['error', 'never'],
    // 'prettier/prettier': [
    //   'error', {
    //   singleQuote: true,
    //   semi: false,
    //   trailingComma: true // be same with airbnb comma-dangle rule
    // }]
  },
};
