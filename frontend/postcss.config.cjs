module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xxs': '24em', // 384px
        'mantine-breakpoint-xs': '30em', // 480px
        'mantine-breakpoint-sm': '48em', // 768px
        'mantine-breakpoint-md': '64em', // 1024px
        'mantine-breakpoint-lg': '75em', // 1200px
        'mantine-breakpoint-xl': '90em', // 1440px
      },
    },
  },
};
