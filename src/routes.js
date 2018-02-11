import Handlers from './handlers';

import {
  UserModel,
  UserModelRequired
} from './db/model';


const routes = [
  {
    method: 'GET',
    path: '/users',
    handler: Handlers.getAllUsers
  },
  {
    method: 'GET',
    path: '/users/{userId}',
    handler: Handlers.getUser
  },
  {
    method: 'GET',
    path: '/users/email/{email}',
    handler: Handlers.getUserByEmail
  },
  {
    method: 'POST',
    path: '/users',
    handler: Handlers.createUser,
    config: {
      validate: {
        payload: UserModelRequired
      }
    }
  },
  {
    method: 'PUT',
    path: '/users/{userId}',
    handler: Handlers.putUser,
    config: {
      validate: {
        payload: UserModelRequired
      }
    }
  },
  {
    method: 'PATCH',
    path: '/users/{userId}',
    handler: Handlers.patchUser,
    config: {
      validate: {
        payload: UserModel
      }
    }
  },
  {
    method: 'DELETE',
    path: '/users/{userId}',
    handler: Handlers.deleteUser
  }
];

export default routes;
