import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...prettierConfig.rules,
      '@typescript-eslint/no-unused-vars': ['warn'],
      'prettier/prettier': ['error'],
      // 'no-console': 'warn',
    },
    settings: {},
  },
];
