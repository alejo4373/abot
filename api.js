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
  console.log('requestMove => ', 'x:', x, 'y:', y)
  return sendRequest('/move', payload)
}

const requestScan = (callsign) => {
  return sendRequest('/scan', { callsign })
}

const requestClaim = (callsign, callback) => {
  sendRequest('/claim', { callsign })
    .then(res => {
      callback(res)
    })
    .catch(err => {
      console.log('[Error] /move', err);
    })
}

module.exports = {
  requestRegister,
  requestScan,
  requestMove,
  requestClaim,
}