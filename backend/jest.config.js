// backend/jest.config.js
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^app$': '<rootDir>/src/app.js',
    '^models/(.*)$': '<rootDir>/src/models/$1',
    '^controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^routes/(.*)$': '<rootDir>/src/routes/$1',
    '^middleware/(.*)$': '<rootDir>/src/middleware/$1'
  }
};