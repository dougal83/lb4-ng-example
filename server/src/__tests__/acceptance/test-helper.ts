import { Client, givenHttpServerConfig, supertest } from '@loopback/testlab';

import { ServerApplication } from '../../application';
import { ExpressServer } from '../../server';

export async function setupExpressApplication(): Promise<AppWithClient> {
  const server = new ExpressServer({rest: givenHttpServerConfig()});
  await server.boot();
  await server.start();

  let lbApp = server.lbApp;

  const client = supertest('http://127.0.0.1:3000');

  return {server, client, lbApp};
}

export interface AppWithClient {
  server: ExpressServer;
  client: Client;
  lbApp: ServerApplication;
}
