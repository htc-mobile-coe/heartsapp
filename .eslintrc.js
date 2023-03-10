module.exports = {
    root: true,
    extends: ['@react-native-community', 'prettier'],
    'env': {
        'browser': true,
        'es2021': true,
        'react-native/react-native': true,
        'jest': true,
    },
    'extends': [
        'plugin:react/recommended',
    ],
    'overrides': [
    ],
    "parser": "@babel/eslint-parser",
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module',
        'ecmaFeatures': {
            'jsx': true,
        },
    },
    'plugins': [
        'react',
        'react-native',
        'jest',
    ],
    'rules': {
        'no-console': 1,
        'no-restricted-imports': [
            'error',
            {
                patterns: ['./storybook'],
            },
        ],
        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'react/display-name': 'off',
        'react/prop-types': 'off',
        'react/no-children-prop': 'off',
    },
    'settings': {
        'react': {
          'version': 'detect'
        },
    },
};
