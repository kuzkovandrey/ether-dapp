/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '\\.tsx$': '<rootDir>/node_modules/babel-jest',
  },
};
