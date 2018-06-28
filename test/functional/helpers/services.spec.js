const rp = require('request-promise')
let chai = require('chai')
chai.should()

const url = 'http://127.0.0.1'

describe('Helper services', () => {
  it('#1 should load service by file', async () => {
    const server = require('../fixtures/server/services/server1.js')
    server.boot()

    const result = await rp({method: 'GET', uri: `${url}:8085/route4`, json: true})
    result.data.should.be.eq('data-service-1')
    server.close()
  })

  it('#2 should load service by folder', async () => {
    const server = require('../fixtures/server/services/server2.js')
    server.boot()

    const result = await rp({method: 'GET', uri: `${url}:8086/route5`, json: true})
    result.data.should.be.deep.eq({res1: "value1", res2: "default"})


    const result2 = await rp({method: 'GET', uri: `${url}:8086/route5/test2`, json: true})
    result2.data.should.be.deep.eq(    {data_service2: {res1: "value1", res2: "default"}, data_service3: {param1: 'value1', param2: 'value2'}})

    server.close()
  })

})
