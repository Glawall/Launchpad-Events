module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      "@babel/preset-env",
      {
        targets: "> 0.25%, not dead",
        useBuiltIns: "entry",
        corejs: 3,
      },
    ],
    "@babel/preset-react",
  ];

  const plugins = [
    [
      "module-resolver",
      {
        root: ["./"],
        alias: {
          "@": "./backend",
        },
      },
    ],
  ];

  return {
    presets,
    plugins,
  };
};
