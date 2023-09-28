module.exports = function (config) {
    config.set({
      frameworks: ["jasmine"],
      browsers: ["Chrome"],
      files: [
        "src/**/*.spec.ts" // Include your test files here
      ],
      preprocessors: {
        "src/**/*.spec.ts": ["webpack", "sourcemap"]
      },
      reporters: ["progress", "kjhtml"],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      singleRun: false,
      concurrency: Infinity
    });
  };
  