module.exports = {
    content: [
      './src/**/*.{html,ts,tsx}',
      'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
    ],
    theme: {
      extend: {},
    },
    plugins: [require('flowbite/plugin')],
  };