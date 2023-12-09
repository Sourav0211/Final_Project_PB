
module.exports = {
    clearMocks: true,
    coverageDirectory: "coverage",
    testEnvironment: "node",
    transform: {
        '^.+\\.jsx?$': ['babel-jest', { presets: ['@babel/preset-react'] }],
      },
    transformIgnorePatterns: [
      "/node_modules/(?!axios)/"
    ],
  };