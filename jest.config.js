module.exports = {
    preset: 'react-native',
    collectCoverage: true,
    moduleDirectories: ['node_modules', 'app/utils'],
    snapshotSerializers: ['enzyme-to-json/serializer'],
    transformIgnorePatterns: [
        '<rootDir>/node_modules/native-base/',
        './node_modules/react-native-gesture-handler/jestSetup.js',
    ],
    setupFiles: ['./jest/setup.js'],
    setupFilesAfterEnv: ['./jest/jest-setup-after-env.js'],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/jest',
        '/native-base-theme/',
    ],
    testPathIgnorePatterns: ['/e2e'],
    moduleNameMapper: {
        '.+\\.(mp3|mp4|wav|woff|woff2)$': 'identity-obj-proxy',
    },
};
