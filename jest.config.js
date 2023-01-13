// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

/** @type {import('@jest/types').Config.InitialOptions} */
const customJestConfig = {
  collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/*.d.ts', '!**/node_modules/**'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = async () => {
  const jestConfig = await createJestConfig(customJestConfig)()

  const esmPackages = []

  return {
    ...jestConfig,
    /**
     * transformIgnorePatternsの設定がnext/jestに上書きされるのを回避するためここに書く
     * @see https://stackoverflow.com/questions/71427330/nextjs-jest-transform-transformignorepatterns-not-working-with-esm-modules
     */
    transformIgnorePatterns: [
      // esmが使われているパッケージを除いてIgnoreする
      `node_modules/(?!(${esmPackages.join('|')})/)`,
      '^.+\\.module\\.(css|sass|scss)$',
    ],
  }
}
