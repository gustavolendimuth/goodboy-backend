/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export default async (url: string, data: string) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data),
      },
    });

    return response.data;
  } catch (error:any) {
    throw new Error(error);
  }
};
