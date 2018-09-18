const { sendRequest } = require('./sendRequest');

const requestRegister = async (callback) => {
  try {
    const res = await sendRequest('/register', { callsign: '' })
    callback(res);
  } catch (err) {
    console.log('[Error] /register', err);
  }
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

const requestScan = (callsign, callback) => {
  sendRequest('/scan', { callsign })
    .then(res => {
      callback(res)
    })
    .catch(err => {
      console.log('[Error] /move', err);
    })
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