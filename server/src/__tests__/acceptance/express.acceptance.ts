import { Client } from '@loopback/testlab';

import { ExpressServer } from '../../server';
import { setupExpressApplication } from './test-helper';

describe('ExpressApplication', () => {
  let server: ExpressServer;
  let client: Client;

  before('setupApplication', async () => {
    ({server, client} = await setupExpressApplication());
  });

  after('closes application', async () => {
    await server.stop();
  });

  it('displays front page', async () => {
    await client
      .get('/')
      .expect(200)
      .expect('Content-Type', /text\/html/);
  });

  it('redirects to "api/explorer" from "api/explorer"', async () => {
    await client
      .get('/api/explorer')
      .expect(301)
      .expect('location', '/api/explorer/');
  });

  it('displays explorer page', async () => {
    await client
      .get('/api/explorer/')
      .expect(200)
      .expect('content-type', /html/)
      .expect(/url\: '\/api\/openapi\.json'\,/)
      .expect(/<title>LoopBack API Explorer/);
  });
});
