export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^generated/prisma$': '<rootDir>/generated/prisma',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  collectCoverageFrom: [
    'src/**/customer.service.ts',
    'src/**/auth.service.ts',
    'src/**/promotional-discount.service.ts',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
