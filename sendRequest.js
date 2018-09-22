const http = require('http');

// Decided to not reinvent the wheel and use this simple http request implementation
// and extend it since I didn't want to pull any npm dependencies and this is not the meat of the challenge
const sendRequest = (path, data) => {
  data = JSON.stringify(data);
  const options = {
    hostname: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  var response = [];

  return new Promise((resolve, reject) => {
    req = http.request(options, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => { response.push(chunk); });
      res.on('end', () => {
        // Lowercased response since I want to be consistent an realize Nodes Id do come with upper case characters
        let formatedRes = response.join('').toLowerCase();
        let parsedRes = JSON.parse(formatedRes);
        if (!parsedRes.errormsg) {
          resolve(parsedRes)
        } else {
          reject(parsedRes)
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

exports.sendRequest = sendRequest;