export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.jest.json',
    }],
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.ts',
  },
  setupFilesAfterSetup: ['<rootDir>/src/setupTests.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/**/__mocks__/**',
    '!src/**/__tests__/**',
    '!src/components/checkout/**',
    '!src/components/summary/**',
    '!src/components/status/**',
    '!src/components/product/**',
    '!src/services/**',
    '!src/types/**',
  ],
};