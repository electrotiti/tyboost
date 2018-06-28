let chai = require('chai')
chai.should()
let {expect} = require('chai')

const Initializer = require('../../../lib/core/Initializer')

describe('Initializer', function () {

  describe('sync', function () {
    const initializer = new Initializer()
    let order = []

    it('should be empty', () => {
      initializer._steps.length.should.be.eq(0)
    })

    it('should have one step', () => {
      initializer.addStep(() => {
        order.push('step1')
      })

      initializer._steps.length.should.be.eq(1)
    })


    it('should run sync step in order', async () => {
      initializer.addStep(() => {
        order.push('step2')
      })

      initializer.addStep(() => {
        order.push('step3')
      })

      initializer._steps.length.should.be.eq(3)

      await initializer.process()

      order[0].should.be.eq('step1')
      order[1].should.be.eq('step2')
      order[2].should.be.eq('step3')
    })
  })

  describe('async', function () {
    const initializer = new Initializer()
    let order = []

    it('should run async step in order', async () => {
      initializer.addStep(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            order.push('step1')
            resolve()
          }, 100)
        })
      })

      initializer.addStep(() => {
        setTimeout(() => {
          order.push('step2')
        }, 10)
      })

      initializer.addStep(() => {
        order.push('step3')
      })

      initializer._steps.length.should.be.eq(3)

      await initializer.process()

      order[0].should.be.eq('step1')
      order[1].should.be.eq('step3')
      expect(order[2]).to.be.undefined

      setTimeout(()=>{
        order[2].should.be.eq('step2')
      },50)
    })
  })
})
