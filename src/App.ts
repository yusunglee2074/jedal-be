import * as express from 'express';
import * as cors from 'cors';
import expressPlayground from 'graphql-playground-middleware-express';
import graphql from './graphql';
import 'reflect-metadata';
import { createConnection } from 'typeorm';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.setMiddleware();
    this.initGraphQL();
    this.catchErrors();
  }

  async connectDatabase() {
    // TODO: 하드코딩된 DB 패스워드 빼야함.
    await createConnection({
      type: 'mongodb',
      url: 'mongodb+srv://jedal:wpcjfekffur@jedal-xyvoz.gcp.mongodb.net/test?retryWrites=true&w=majority',
      useNewUrlParser: true,
      database: 'dev',
      synchronize: true,
      entities: [__dirname + '/entity/*.{js,ts}'],
      useUnifiedTopology: true,
    });
  }

  private setMiddleware(): void {
    this.express.get('/', expressPlayground({ endpoint: '/graphql' }));
    this.express.use(cors());
  }

  private initGraphQL(): void {
    this.express.use('/graphql', graphql);
  }

  private catchErrors(): void {}
}

export default new App();
