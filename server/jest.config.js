module.exports = {
  collectCoverageFrom: ['hand/**/*.js', 'tools/**/*.js'],
  reporters: [ 'default' ],
  testMatch: [ '<rootDir>/**/test/**/*.spec.js' ],
  testPathIgnorePatterns: [ '/node_modules/' ],
  // testURL: 'http://localhost/',
};
