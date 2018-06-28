const rp = require('request-promise')
let chai = require('chai')
chai.should()

const url = 'http://127.0.0.1'

describe('Helper middleware', () => {
  it('#1 should load middleware by file', async () => {
    const server = require('../fixtures/server/middlewares/server1.js')
    server.boot()

    const result = await rp({method: 'GET', uri: `${url}:8084/route3`, json: true})
    result.param_pre_middleware1.should.be.eq('OK')
    server.close()
  })

  it('#2 should load router by folder', async () => {
    const server = require('../fixtures/server/middlewares/server2.js')
    server.boot()

    const result = await rp({method: 'GET', uri: `${url}:8084/route3`, json: true})
    result.param_pre_middleware1.should.be.eq('OK')

    let error = false
    try {
      await rp({method: 'GET', uri: `${url}:8084/route3?force_error=true`, json: true})
    } catch (e) {
      error = e
    }

    error.message.should.be.eq('500 - "Force error"')

    server.close()
  })

})
