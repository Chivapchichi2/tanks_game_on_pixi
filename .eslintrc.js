module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2019,
		sourceType: 'module'
	},
	ignorePatterns: ['node_modules', '_templates', '*.d.ts'],
	plugins: ['@typescript-eslint', 'unused-imports'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended'
	],
	rules: {
		'prefer-const': 'error',
		'no-useless-escape': 'off',
		'lines-between-class-members': 'off',
		'no-invalid-this': 'off',
		'@typescript-eslint/explicit-function-return-type': [
			'error',
			{
				allowExpressions: true,
				allowTypedFunctionExpressions: true
			}
		],
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/no-inferrable-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/no-unused-expressions': [
			'warn',
			{
				'allowTernary': true
			}
		],
		'@typescript-eslint/no-namespace': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-empty-interface': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-require-imports': 'error',
		'@typescript-eslint/lines-between-class-members': ['error', 'always', { 'exceptAfterSingleLine': true }],
		'@typescript-eslint/no-invalid-this': 'off',
		'@typescript-eslint/prefer-ts-expect-error': 'error',
		'unused-imports/no-unused-imports': 'error',
		'no-useless-constructor': 'off',
		'@typescript-eslint/no-useless-constructor': ['error']
	},
	env: {
		browser: true,
		node: true,
		es6: true
	}
};
