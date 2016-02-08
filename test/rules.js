describe.only('Rules', function () {
  it('Should respect multiple rules', function (done) {
    var c = makeTest()
    var rules = new Rules(
      1,
      [
        {nbCalls: 1, per: 100},
        {nbCalls: 3, per: 600}
      ]
    )

    c.limiter = rules

    c.limiter.submit(c.job, null, 1, c.noErrVal(1))
    c.limiter.submit(c.job, null, 2, c.noErrVal(2))
    c.limiter.submit(c.job, null, 3, c.noErrVal(3))
    c.limiter.submit(c.job, null, 4, c.noErrVal(4))
    c.limiter.submit(c.job, null, 5, c.noErrVal(5))
    c.limiter.submit(c.job, null, 6, c.noErrVal(6))
    c.limiter.submit(c.job, null, 7, c.noErrVal(7))
    c.limiter.submit(c.job, null, 8, c.noErrVal(8))
    c.limiter.submitPriority(1, c.job, null, 9, c.noErrVal(9))

    c.last(function (err, results) {
      console.log(c.results().calls.map(function (x) {return x.result}))
      c.checkResultsOrder([1,2,3,9,4,5,6,7,8])
      console.log(c.results().calls.map(function (x) {return x.time}))
      c.checkTimes([0, 100, 200, 600, 700, 800, 1200, 1300])
      // console.assert(c.asserts() === 2)
      console.log("Done")
      done()
    })
  })
})
