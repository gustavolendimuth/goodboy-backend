/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import https from 'https';

const invoiceService = async (url: string, data: string)
: Promise<string> => {
  const options: https.RequestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data),
    },
  };

  // if (optionalHeaders) {
  //   options.headers = Object.assign(options.headers, optionalHeaders);
  // }

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let response = '';

      res.on('data', (chunk: unknown) => {
        response += chunk;
      });

      res.on('end', () => {
        resolve(response);
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(data);
    req.end();
  });
};

export default invoiceService;
