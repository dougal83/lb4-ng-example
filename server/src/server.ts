import * as express from 'express';
import * as http from 'http';
import pEvent from 'p-event';
import * as path from 'path';

import { ApplicationConfig } from '@loopback/core';

import { ServerApplication } from './application';

export class ExpressServer {
  private app: express.Application;
  public readonly lbApp: ServerApplication;
  private server: http.Server;

  constructor(options: ApplicationConfig = {}) {
    this.app = express();
    this.lbApp = new ServerApplication(options);

    // Expose lb4 front-end assets via Express @ /api
    this.app.use('/api', this.lbApp.requestHandler);

    // Serve the public folder where ng app deployed
    this.app.use(express.static(path.join(__dirname, '../public')));
  }

  public async boot() {
    await this.lbApp.boot();
  }

  public async start() {
    const port = this.lbApp.restServer.config.port || 3000;
    const host = this.lbApp.restServer.config.host || '127.0.0.1';
    this.server = this.app.listen(port, host);
    await pEvent(this.server, 'listening');
  }

  // For testing purposes
  public async stop() {
    if (!this.server) return;
    this.server.close();
    await pEvent(this.server, 'close');
  }
}
