module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '',
    testRegex: '.*\\.spec\\.ts$', // To find test files ending with .spec.ts
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverage: true,
    coverageDirectory: '../coverage',
    moduleDirectories: ['node_modules', 'NEST1'],

  };
  