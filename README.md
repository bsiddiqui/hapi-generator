# hapi-promise

Add generators and promises to your hapi handlers

```javascript
let server = new Hapi.Server()

// First register the plugin
server.register(require('hapi-generator'), err => {
  if (err) throw err
})

// Now you're free to pass an generator or promise as a handler
server.route({
  method: 'POST',
  path: '/generator',
  handler: {
    generator: function * (request, reply) {
      let result = yield database.find()
      return result // Just return it and the plugin will cal reply() for you
    }
  }
})

server.route({
  method: 'POST',
  path: '/generator',
  handler: {
    promise: function (request, reply) {
      // Errors are automatically handled too
      return database.find().then(() => { throw new Error('Wooops!') })
    }
  }
})

// If you wish to disable reply handling just pass reply: false
server.route({
  method: 'POST',
  path: '/home',
  handler: {
    generator: {
      reply: false,
      handler: function * (request, reply) {
        // Now the plugin will only call reply() for uncaught errors
        let data = yield database.find()
        reply.view('home', { data })
      }
    }
  }
})
```

### Testing

```bash
git clone git@github.com:estate/hapi-generator.git
cd bookshelf-bcrypt && npm install && npm test
```
