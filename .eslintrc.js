module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: "eslint:recommended",
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        "handle-callback-err": "off",
        "max-nested-callbacks": [
            "error",
            {
                max: 4,
            },
        ],
        "max-statements-per-line": [
            "error",
            {
                max: 2,
            },
        ],
        "no-console": "off",
        "no-empty-function": "error",
        "no-floating-decimal": "error",
        "no-lonely-if": "error",
        "no-multi-spaces": "error",
        "no-multiple-empty-lines": [
            "error",
            {
                max: 2,
                maxEOF: 1,
                maxBOF: 0,
            },
        ],
        "no-var": "error",
        "object-curly-spacing": ["error", "always"],
        "prefer-const": "error",
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "space-before-blocks": "error",
        "space-before-function-paren": [
            "error",
            {
                anonymous: "never",
                named: "never",
                asyncArrow: "always",
            },
        ],
        "space-in-parens": "error",
        "space-infix-ops": "error",
        "space-unary-ops": "error",
        "spaced-comment": "error",
        yoda: "error",
    },
};
