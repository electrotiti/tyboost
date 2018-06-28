const rp = require('request-promise')
let chai = require('chai')
chai.should()

const url = 'http://127.0.0.1'

describe('Helper routes', () => {
  it('#1 should load simple router with function', async () => {
    const server = require('../fixtures/server/routes/server1.js')
    server.boot()

    const result = await rp({method: 'GET', uri: `${url}:8081/test1`, json: true})
    result.data.should.be.eq('test1')

    server.close()
  })

  it('#2 should load router by file', async () => {
    const server = require('../fixtures/server/routes/server2.js')
    server.boot()

    const result = await rp({method: 'GET', uri: `${url}:8082/route1`, json: true})
    result.data.should.be.eq('data1')

    const result2 = await rp({
      method: 'POST',
      uri: `${url}:8082/route1`,
      json: true,
      body: {data: 'test2-2'}
    })

    result2.data.should.be.eq('test2-2')
    server.close()
  })

  it('#3 should load router by folder', async () => {
    const server = require('../fixtures/server/routes/server3.js')
    server.boot()

    const result = await rp({method: 'GET', uri: `${url}:8083/route1`, json: true})
    result.data.should.be.eq('data1')

    const result2 = await rp({
      method: 'POST',
      uri: `${url}:8083/route1`,
      json: true,
      body: {data: 'test3-3'}
    })

    result2.data.should.be.eq('test3-3')

    const result3 = await rp({method: 'GET', uri: `${url}:8083/route2`, json: true})
    result3.data.should.be.eq('data2')

    const result4 = await rp({
      method: 'POST',
      uri: `${url}:8083/route2`,
      json: true,
      body: {data: 'test3-1-1'}
    })

    result4.data.should.be.eq('test3-1-1')

    server.close()
  })

})
