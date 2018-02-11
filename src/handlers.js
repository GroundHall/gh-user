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

  @ReplyPromiseResponse
  static deleteUser(request) {
    const { userId } = request.params;
    return r.table(env.DB_TABLE_NAME)
      .get(userId)
      .delete({returnChanges: true})
  }
}

export default Handlers;
