const collectCoverageFrom = [
    'src/**/*.ts'
];

const validationTest = [
    '/__test__/validation.test.ts$'
];


const testRegex = [
    ...validationTest
];

module.exports = {
    automock: false,
    collectCoverage: true,
    maxWorkers: "50%",
    collectCoverageFrom,
    coveragePathIgnorePatterns: ['node_modules', 'test', 'doc.ts'],
    coverageDirectory: 'coverage',
    //coverageProvider: 'babel', //"v8" is still experimental, but use "v8" for walk through debugging
    coverageProvider: 'v8', //"v8" is still experimental, but use "v8" for walk through debugging
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    cacheDirectory: '.jest-cache',
    testPathIgnorePatterns: ['/es6/', '/commonjs/'],
    testRegex,
    globals: {
        'ts-jest': {
            // ts-jest configuration goes here
            pretty: true,
            tsconfig: 'tsconfig-jest.json',
            diagnostics: true
        }
    },
    /*moduleNameMapper: {
        '^@dist/(.*)$': '<rootDir>/src/lib/distributions/$1',
        '^@common/(.*)$': [
            '<rootDir>/src/packages/common/$1',
            '<rootDir>/src/lib/common/$1',
            '<rootDir>/src/packages/__test__/$1',
        ],
        '^@special/(.*)$': '<rootDir>/src/lib/special/$1',
        '^@trig/(.*)$': '<rootDir>/src/lib/trigonometry/$1',
        '^@rng/(.*)$': '<rootDir>/src/lib/rng/$1',
        '^@lib/(.*)$': '<rootDir>/src/lib/$1',
        '^lib/(.*)$': '<rootDir>/src/lib/$1'

    },*/
    //setupFiles: ['<rootDir>/src/packages/__test__/jest-ext.d.ts'],
    /*setupFilesAfterEnv: [
        '<rootDir>/src/packages/__test__/jest-extension.ts',
        '<rootDir>/src/packages/__test__/mock-of-debug.ts'
    ],*/
};


