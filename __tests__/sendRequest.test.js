require('dotenv').config();

const { sendRequest } = require('../sendRequest');

describe('sendRequest', () => {
  it('sends /register request and receive id', () => {
    expect.assertions(1)
    return sendRequest('/register', {}).then(res => {
      expect(res.status).toHaveProperty('id');
    })
  })
})