// frontend/src/test/setup.js
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom'; // This is the fix

afterEach(() => {
  cleanup();
});