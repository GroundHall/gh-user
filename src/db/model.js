/**
 * This file handles the model/models for
 * the perticular microservice
 */

import Joi from 'joi';

export const UserModel = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  avatarURL: Joi.string(),
  type: Joi.string(), // oneOf(['teacher', 'student', 'admin'])
  friends: Joi.array().items(Joi.string()).default([]),
  sendFriendRequests: Joi.array().items(Joi.string()).default([]),
  receivedFriendRequests: Joi.array().items(Joi.string()).default([])
}).required();

export const UserModelRequired = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  avatarURL: Joi.string(),
  type: Joi.string().required(), // oneOf(['teacher', 'student', 'admin'])
  friends: Joi.array().items(Joi.string()).default([]),
  sendFriendRequests: Joi.array().items(Joi.string()).default([]),
  receivedFriendRequests: Joi.array().items(Joi.string()).default([])
}).required();
