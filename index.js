'use strict'

let co = require('co')

exports.register = (server, options, next) => {
  server.handler('promise', (route, options) => {
    return (request, reply) => {
      if (options && options.reply === false) {
        options.handler(request, reply).catch(err => reply(err))
      } else {
        options(request, reply).then(reply, reply)
      }
    }
  })

  server.handler('generator', (route, options) => {
    return (request, reply) => {
      if (options && options.reply === false) {
        co(options.handler.bind(null, request, reply)).catch(reply)
      } else {
        co(options.bind(null, request, reply)).then(reply)
      }
    }
  })

  next()
}

exports.register.attributes = {
  name: 'hapi-generator',
  version: '1.0.0'
}
