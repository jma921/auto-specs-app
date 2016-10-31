const localStorageMock = {
  Tooltip: jest.fn(),
  reactstrap: jest.fn(),
  base: jest.fn(),
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock