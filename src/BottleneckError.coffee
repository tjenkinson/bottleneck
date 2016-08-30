class BottleneckError extends Error
  constructor: (@code, @message)->
    Error.captureStackTrace && Error.captureStackTrace(@,@)

module.exports = BottleneckError