'use strict'

let lab = exports.lab = require('lab').script()
let expect = require('code').expect
let co = require('co')
let Hapi = require('hapi')
let Bluebird = require('bluebird')

let plugin = require('../')

lab.experiment('general', () => {
  lab.test('generators should work', co.wrap(function * () {
    let server = new Hapi.Server()
    server.connection()
    server.register(plugin, err => { if (err) throw err })

    server.route({
      method: 'GET',
      path: '/',
      handler: {
        generator: function * (request, reply) {
          return yield Bluebird.resolve().delay(100).return({ hello: 'world' })
        }
      }
    })

    let res = yield server.inject({
      method: 'GET',
      url: '/'
    })

    expect(res.result).to.equal({ hello: 'world' })
  }))

  lab.test('promises should work', co.wrap(function * () {
    let server = new Hapi.Server()
    server.connection()
    server.register(plugin, err => { if (err) throw err })

    server.route({
      method: 'GET',
      path: '/',
      handler: {
        promise: function (request, reply) {
          return Bluebird.resolve().delay(100).return({ hello: 'world' })
        }
      }
    })

    let res = yield server.inject({
      method: 'GET',
      url: '/'
    })

    expect(res.result).to.equal({ hello: 'world' })
  }))
})
