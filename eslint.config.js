import { browser } from 'globals'
import pluginJs from '@eslint/js'
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js'

export default [
  { languageOptions: { globals: browser } },
  pluginJs.configs.recommended,
  pluginReactConfig,
  {
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  }
]
