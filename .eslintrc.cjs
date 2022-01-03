module.exports = {
    extends: [
        'eslint:recommended'
    ],
    parser: '@babel/eslint-parser',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
        node: true
    }
}
