module.exports = {
  presets: [],
  plugins: [
    [
      'babel-plugin-root-import',
      {
        rootPathSuffix: 'src',
        rootPathPrefix: '~/',
      },
    ],
  ],
};
