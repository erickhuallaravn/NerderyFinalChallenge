import { config } from 'dotenv';
import { resolve } from 'path';

config({
  path: resolve(__dirname, '.env'),
});

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^generated/prisma$': '<rootDir>/generated/prisma',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  collectCoverageFrom: ['src/**/*.(t|j)s'],

  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
