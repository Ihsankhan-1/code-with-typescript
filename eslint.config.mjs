import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

// Dynamically import plugins using `await import()` to support ES modules
const eslintConfig = await (async () => {
  const typescriptEslintPlugin = (await import('@typescript-eslint/eslint-plugin')).default
  const reactHooksPlugin = (await import('eslint-plugin-react-hooks')).default
  const prettierPlugin = (await import('eslint-plugin-prettier')).default
  const typescriptParser = (await import('@typescript-eslint/parser')).default

  return [
    // Base config
    ...compat.extends('next/core-web-vitals', 'next/typescript'),

    {
      plugins: {
        '@typescript-eslint': typescriptEslintPlugin,
        'react-hooks': reactHooksPlugin,
        prettier: prettierPlugin,
      },
      languageOptions: {
        parser: typescriptParser,
        parserOptions: {
          sourceType: 'module',
          ecmaVersion: 'latest',
        },
      },
      rules: {
        // TypeScript
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-object-type': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',

        // React hooks
        'react-hooks/exhaustive-deps': 'off',

        // JS
        'no-var': 'off',
        'prefer-const': 'off',

        // Prettier
        'prettier/prettier': ['warn', { endOfLine: 'auto' }],
      },
    },
  ]
})()

export default eslintConfig
