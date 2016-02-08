global.TEST = true
global.Bottleneck = require('../lib/index.js')
global.DLList = require('../lib/DLList.js')
global.Rules = require('../lib/Rules.js')
global.makeTest = function (arg1, arg2, arg3, arg4) {
  // ASSERTION
  var asserts = 0
  var getAsserts = function () {
    return asserts
  }
  var assertWrapped = function (eq) {
      asserts++
      console.assert(eq)
    }

  // OTHERS
  var start = Date.now()
  var calls = []
  var getResults = function () {
    return {
      elapsed: Date.now() - start,
      callsDuration: calls[calls.length - 1].time,
      calls: calls,
      asserts: asserts
    }
  }

  var getLimiter
  var context = {
    job: function (err, result, cb) {
      calls.push({err: err, result: result, time: Date.now()-start})
      if (process.env.DEBUG) console.log(result, calls)
      cb(err, result)
    },
    promise: function (err, result) {
      return new Bottleneck.Promise(function (resolve, reject) {
        calls.push({err: err, result: result, time: Date.now()-start})
        if (process.env.DEBUG) console.log(result, calls)
        if (err == null) {
          return resolve(result)
        } else {
          return reject(result)
        }
      })
    },
    pNoErrVal: function (promise, expected) {
      promise.then(function (actual) {
        assertWrapped(actual === expected)
      }).catch(function () {
        assertWrapped(false === "The promise failed")
      })
    },
    noErrVal: function (expected) {
      return function (err, actual) {
        assertWrapped(err === null)
        assertWrapped(actual === expected)
      }
    },
    last: function (cb) {
      getLimiter().submit(function (cb) {cb(null, getResults())}, cb)
    },
    limiter: new Bottleneck(arg1, arg2, arg3, arg4),
    assert: assertWrapped,
    asserts: getAsserts,
    results: getResults,
    checkResultsOrder: function (order) {
      for (var i = 0; i < Math.max(calls.length, order.length); i++) {
        console.assert(order[i] === calls[i].result)
      }
    },
    checkDuration: function (shouldBe) {
      var results = getResults()
      var min = shouldBe - 10
      var max = shouldBe + 50
      console.assert(results.callsDuration > min)
      console.assert(results.callsDuration < max)
    },
    checkTimes: function (times) {
      var results = getResults()
      for (var i = 0; i < Math.max(calls.length, times.length); i++) {
        console.assert(
          (calls[i].time > (times[i] - 10)) &&
          (calls[i].time < (times[i] + 50))
        )
      }
    }
  }

  getLimiter = function () {
    return context.limiter
  }

  return context
}

var fs = require('fs')
var files = fs.readdirSync('./test')
for (var f in files) {
  var stat = fs.statSync('./test/' + files[f])
  if (!stat.isDirectory()) {
    try {
      require('./' + files[f])
    } catch (e) {
      console.error(e.toString())
    }
  }
}
