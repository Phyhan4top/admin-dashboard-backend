import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiSummary(): any {
    return {
      name: 'User Management API',
      version: '1.0.0',
      description:
        'This API manages users with authentication, roles, and more.',
      endpoints: [
        { method: 'GET', path: '/api/users', description: 'Get all users' },
        {
          method: 'POST',
          path: '/api/users',
          description: 'Create a new user',
        },
        { method: 'PUT', path: '/api/users/:id', description: 'Update a user' },
        {
          method: 'DELETE',
          path: '/api/users/:id',
          description: 'Delete a user',
        },
        {
          method: 'PATCH',
          path: '/api/users/update-many',
          description: 'Update a users',
        },
        {
          method: 'DELETE',
          path: '/api/users/delete-many',
          description: 'Delete a users',
        },
        {
          method: 'POST',
          path: '/api/login',
          description: 'Authenticate a user',
        },
      ],
    };
  }
}
