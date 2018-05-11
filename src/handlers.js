import Boom from 'boom';
import dateformat from 'dateformat';
import env from './env.config';
import r from './db/config';
import {
  ReplyPromiseResponse
} from './decorators';

class Handlers {
  
  @ReplyPromiseResponse
  static getAllUsers() {
    return r.table(env.DB_TABLE_NAME);
  }
  
  @ReplyPromiseResponse
  static getUser(request) {
    const { userId } = request.params;
    return r.table(env.DB_TABLE_NAME).get(userId);
  }
  
  static getUserByEmail(request, reply) {
    const { email } = request.params;
    r.table(env.DB_TABLE_NAME).filter({
      email
    }).then(result => {
      if(result.length < 1) reply(null)
      else {
        const user = result[0];
        reply(user);
      }
    }).catch(err => {
      reply(Boom.badImplementation(err))
    });
  }

  @ReplyPromiseResponse
  static createUser(request) {
    const { payload } = request;
    return r.table(env.DB_TABLE_NAME).insert(
      r.expr(payload).merge({
        createdAt: r.now()
      }),
      // This tells rethinkdb that changes should be return
      {returnChanges: true}
    )
  }

  @ReplyPromiseResponse
  static putUser(request) {
    const { userId } = request.params;
    const { payload }  = request;
    payload.id = userId;
    return r.table(env.DB_TABLE_NAME)
      .get(userId)
      .replace(payload, {returnChanges: true})
  }

  @ReplyPromiseResponse
  static patchUser(request) {
    const { userId } = request.params;
    const { payload } = request;
    return r.table(env.DB_TABLE_NAME)
      .get(userId)
      .update(payload, {returnChanges: true})
  }

  static sendFriendRequest(request, reply) {
    const { payload: {fromId, toId} } = request;
    return Promise.all([
      r.table(env.DB_TABLE_NAME).get(toId).update({
        receivedFriendRequests: r.row('receivedFriendRequests').append(fromId)
      }),
      r.table(env.DB_TABLE_NAME).get(fromId).update({
        sendFriendRequests: r.row('sendFriendRequests').append(toId)
      })
    ]).then(result => {
      reply(result)
    }).catch(error => {
      reply(Boom.badImplementation(error));
    })
  }

  static cancelFriendRequest(request, reply) {
    const { payload: {fromId, toId} } = request;
    return Promise.all([
      r.table(env.DB_TABLE_NAME).get(toId).update({
        receivedFriendRequests: r.row('receivedFriendRequests')
        .filter(function (item) { return item.ne(fromId) }),
      }),
      r.table(env.DB_TABLE_NAME).get(fromId).update({
        sendFriendRequests: r.row('receivedFriendRequests')
        .filter(function (item) { return item.ne(toId) }),
      })
    ]).then(result => {
      reply(result)
    }).catch(error => {
      reply(Boom.badImplementation(error));
    })
  }

  static acceptFriendRequest(request, reply) {
    // fromId => from whom I received it
    // toId => I
    const { payload: { fromId, toId } } = request;
    return Promise.all([
      r.table(env.DB_TABLE_NAME).get(toId).update({
        receivedFriendRequests: r.row('receivedFriendRequests')
        .filter(function (item) { return item.ne(fromId) }),
      }),
      r.table(env.DB_TABLE_NAME).get(fromId).update({
        sendFriendRequests: r.row('receivedFriendRequests')
        .filter(function (item) { return item.ne(toId) }),
      }),
      r.table(env.DB_TABLE_NAME).get(toId).update({
        friends: r.row('friends').append(fromId)
      }),
      r.table(env.DB_TABLE_NAME).get(fromId).update({
        friends: r.row('friends').append(toId)
      })
    ]).then(result => {
      reply(result)
    }).catch(error => {
      reply(Boom.badImplementation(error));
    })
  }

  @ReplyPromiseResponse
  static deleteUser(request) {
    const { userId } = request.params;
    return r.table(env.DB_TABLE_NAME)
      .get(userId)
      .delete({returnChanges: true})
  }
}

export default Handlers;
