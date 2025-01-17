module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
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
