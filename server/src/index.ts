import { ApplicationConfig } from '@loopback/core';

import { ExpressServer } from './server';

export {ExpressServer};

export async function main(options: ApplicationConfig = {}) {
  const server = new ExpressServer(options);
  await server.boot();
  await server.start();

  console.log(`Server is running... [Default: http://127.0.0.1:3000]`);
}
