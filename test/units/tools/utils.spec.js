let chai = require('chai')
chai.should()
let {expect} = require('chai')

const {walkSync} = require('../../../lib/tools/utils')


describe('Utils', function () {

  describe('walkSync', function () {

    it('should be return this file', () => {
      const result = walkSync(__dirname, {depth: 1})
      expect(result).to.eql([`${__dirname}/utils.spec.js`])
    })

    it('should do not return file with bad extension', () => {
      const result = walkSync(`${__dirname}/../fixtures/simple`)
      expect(result).to.eql([`${__dirname}/../fixtures/simple/good.js`])
    })

    it('should return file with specific extension', () => {
      const result = walkSync(`${__dirname}/../fixtures/simple`, {exts: ['bad']})
      expect(result).to.eql([`${__dirname}/../fixtures/simple/file.bad`])
    })

    it('should require only file that match with regex', () => {
      const regex = new RegExp('^\/[a-zA-Z0-9-_]*\/defs')
      const result = walkSync(`${__dirname}/../fixtures/modules`,{regex})
      expect(result).to.eql(
        [
          `${__dirname}/../fixtures/modules/module1/defs/file1.js`,
          `${__dirname}/../fixtures/modules/module2/defs/file2.js`,
        ]
      )
    })

  })

})
