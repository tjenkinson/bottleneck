i = 0
global.t0 = Date.now()
class Rules
  constructor: (nbConcurrent=0, rules) ->
    @Bottleneck = require "./Bottleneck"
    rules.sort (a, b) -> a.per - b.per
    @intervals = new Array rules.length
    limiters = (while rule = rules.pop() then @makeLimiter rule).reverse()
    limiters[-1..].forEach (x) -> x.changeSettings nbConcurrent # Works even if no rules
    @head = limiters.shift()
    limiters.reduce (prev, limiter) =>
      prev.chain limiter
    , @head
    setTimeout ->

    , @
  makeLimiter: (rule) ->
    limiter = (new @Bottleneck 0).changeReservoir rule.nbCalls
    @intervals = Date.now() + rules.per
    limiter
  submit: -> @head.submit.apply {}, Array.prototype.slice.call arguments, 0
  submitPriority: -> @head.submitPriority.apply {}, Array.prototype.slice.call arguments, 0
  stopAll: ->

module.exports = Rules
