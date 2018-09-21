const { sendRequest } = require('./sendRequest');

const requestRegister = () => {
  return sendRequest('/register', { callsign: '' })
}

const requestMove = (x, y, callsign) => {
  let payload = {
    callsign,
    x: x + '',
    y: y + ''
  }
  logger.log('requestMove => ', 'x:', x, 'y:', y)
  return sendRequest('/move', payload)
}

const requestScan = (callsign) => {
  return sendRequest('/scan', { callsign })
}

const requestClaim = (callsign, node) => {
  logger.log('claiming node:', node)
  return sendRequest('/claim', { callsign: callsign, node: node.id })
}

const requestMine = (callsign, node) => {
  logger.log('mining node', node.id)
  return sendRequest('/mine', { callsign, node: node.id })
}

module.exports = {
  requestRegister,
  requestScan,
  requestMove,
  requestClaim,
  requestMine
}