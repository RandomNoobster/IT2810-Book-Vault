import mantine from 'eslint-config-mantine';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...mantine,
  { ignores: ['**/*.{mjs,cjs,js,d.ts,d.mts}', 'src/generated/'] },
  { rules: { 'no-console': ['error', { allow: ['warn', 'error'] }] } }
);
