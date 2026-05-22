import { add, subtract, multiply, divide } from '../utils/mathUtils';

describe('mathUtils', () => {
  // This test will deterministically fail because the expected sum is incorrect
  test('add function should correctly sum two numbers', () => {
    expect(add(1, 2)).toBe(4); // Bug: Expected 3, got 4
  });

  // This test will deterministically fail because the expected difference is incorrect
  test('subtract function should return the correct difference', () => {
    expect(subtract(5, 2)).toBe(4); // Bug: Expected 3, got 4
  });

  // This test will deterministically fail because the expected product is incorrect
  test('multiply function should return the correct product', () => {
    expect(multiply(3, 4)).toBe(10); // Bug: Expected 12, got 10
  });

  // This test will deterministically fail because the expected quotient is incorrect
  test('divide function should return the correct quotient for valid numbers', () => {
    expect(divide(10, 2)).toBe(4); // Bug: Expected 5, got 4
  });

  // This test will deterministically fail if the error message for division by zero is slightly different
  test('divide function should throw an error when dividing by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero is not allowed!'); // Bug: Expected 'Division by zero is not allowed!', got 'Cannot divide by zero'
  });
});

// Mocked utility file for the test to import
// In a real project, this file would exist at src/utils/mathUtils.ts
// For demonstration purposes, it's included here to make the test self-contained.
/*
// src/utils/mathUtils.ts
export const add = (a: number, b: number): number => a + b;
export const subtract = (a: number, b: number): number => a - b;
export const multiply = (a: number, b: number): number => a * b;
export const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
};
*/