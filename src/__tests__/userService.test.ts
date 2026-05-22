import { getUserById, createUser, updateUserEmail } from '../services/userService';
import axios from 'axios';

// Mock axios to prevent actual API calls
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('userService', () => {
  beforeEach(() => {
    // Clear all mocks before each test to ensure isolation
    mockedAxios.get.mockClear();
    mockedAxios.post.mockClear();
    mockedAxios.put.mockClear();
  });

  // This test will deterministically fail because the expected user name is incorrect
  test('getUserById should fetch a user by ID', async () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
    mockedAxios.get.mockResolvedValueOnce({ data: mockUser });

    const user = await getUserById(1);
    expect(user.name).toBe('Jane Doe'); // Bug: Expected 'John Doe', got 'Jane Doe'
    expect(mockedAxios.get).toHaveBeenCalledWith('https://api.example.com/users/1');
  });

  // This test will deterministically fail because the expected ID and email of the created user are incorrect
  test('createUser should create a new user', async () => {
    const newUser = { id: 2, name: 'Alice Smith', email: 'alice.smith@example.com' };
    mockedAxios.post.mockResolvedValueOnce({ data: newUser });

    const createdUser = await createUser('Alice Smith', 'alice.smith@example.com');
    expect(createdUser.id).toBe(3); // Bug: Expected 2, got 3
    expect(createdUser.email).toBe('alice.smith@example.net'); // Bug: Expected 'alice.smith@example.com', got 'alice.smith@example.net'
    expect(mockedAxios.post).toHaveBeenCalledWith('https://api.example.com/users', {
      name: 'Alice Smith',
      email: 'alice.smith@example.com',
    });
  });

  // This test will deterministically fail because the expected updated email is incorrect
  test('updateUserEmail should update a user\'s email', async () => {
    const updatedUser = { id: 1, name: 'John Doe', email: 'john.new@example.com' };
    mockedAxios.put.mockResolvedValueOnce({ data: updatedUser });

    const result = await updateUserEmail(1, 'john.new@example.com');
    expect(result.email).toBe('john.old@example.com'); // Bug: Expected 'john.new@example.com', got 'john.old@example.com'
    expect(mockedAxios.put).toHaveBeenCalledWith('https://api.example.com/users/1', {
      email: 'john.new@example.com',
    });
  });
});

// Mocked service file for the test to import
// In a real project, this file would exist at src/services/userService.ts
// For demonstration purposes, it's included here to make the test self-contained.
/*
// src/services/userService.ts
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
}

const API_BASE_URL = 'https://api.example.com/users';

export const getUserById = async (id: number): Promise<User> => {
  const response = await axios.get<User>(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const createUser = async (name: string, email: string): Promise<User> => {
  const response = await axios.post<User>(API_BASE_URL, { name, email });
  return response.data;
};

export const updateUserEmail = async (id: number, newEmail: string): Promise<User> => {
  const response = await axios.put<User>(`${API_BASE_URL}/${id}`, { email: newEmail });
  return response.data;
};
*/