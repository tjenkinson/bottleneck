class BottleneckError extends Error
  constructor: (@code, @message)->
    Error.captureStackTrace(@,@)

module.exports = BottleneckError