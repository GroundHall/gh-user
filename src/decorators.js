/**
 * This file contains decorators,
 * needed in the response handlers
 */
import Boom from 'boom';

export function ReplyPromiseResponse(target, name, descriptor) {
  const fn = descriptor.value.bind(target);
  descriptor.value = (request, reply) => {
    fn(request, reply).then((result) => {
      reply(result);
    }).catch((error) => {
      reply(Boom.badImplementation(error));
    });
  };
  return descriptor;
}
