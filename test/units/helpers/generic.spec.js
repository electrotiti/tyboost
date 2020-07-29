let chai = require('chai')
chai.should()
let {expect} = require('chai')

const generic = require('../../../lib/helpers/generic')

describe('Helper Generic', function () {
  it('should be require files', () => {
    const regex = new RegExp('^\/[a-zA-Z0-9-_]*\/defs')

    const globalResult = []
    const saveResult = (res) => {
      globalResult.push(res)
    }

    generic(`${__dirname}/../fixtures/modules`, {regex}, saveResult)

    expect(globalResult).to.eql(
      [
        {
          "value": "file1"
        },
        {
          "value": "file2"
        }
      ]
    )

  })
})
