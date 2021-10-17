const collectCoverageFrom = [
    'src/controller/loadData.ts',
    'src/controller/reports.ts',
    'src/controller/transformations.ts',
    'src/controller/validations/ajvEnhanced.ts',
    'src/controller/validations/validationDefs.ts'
];

const testRegex = [
    '/__test__/validation.test.ts$',
    '/__test__/loadData.test.ts$',
    '/__test__/transformations.test.ts$',
    '/__test__/reports.test.ts$'
];

export default {
    automock: false,
    collectCoverage: true,
    maxWorkers: "50%",
    collectCoverageFrom,
    coveragePathIgnorePatterns: ['node_modules', '__test__'],
    coverageDirectory: 'coverage',
    //coverageProvider: 'v8', //"v8" is still experimental, but use "v8" for walk through debugging
    coverageProvider: 'babel', //"v8" is still experimental, but use "v8" for walk through debugging


    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    preset: 'ts-jest/presets/js-with-ts',
    testEnvironment: 'node',
    verbose: true,
    cacheDirectory: '.jest-cache',
    testPathIgnorePatterns: ['/es6/'],
    testRegex,
    globals: {
        'ts-jest': {
            // ts-jest configuration goes here
            pretty: true,
            tsconfig: 'tsconfig-jest.json',
        }
    },

    setupFilesAfterEnv: [
        '<rootDir>/src/controller/__test__/mock-fetch.ts'
    ],
};


