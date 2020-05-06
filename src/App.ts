import * as express from 'express';
import * as cors from 'cors';
import expressPlayground from 'graphql-playground-middleware-express';
import { createConnection } from 'typeorm';
import * as graphqlHTTP from 'express-graphql';
import { buildSchemaSync } from 'type-graphql';
import resolvers from './resolver';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.setMiddleware();
    this.initGraphQL();
    this.catchErrors();
  }

  async connectDatabase(): Promise<void> {
    await createConnection({
      type: 'mongodb',
      url: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@jedal-xyvoz.gcp.mongodb.net/test?retryWrites=true&w=majority`,
      useNewUrlParser: true,
      database: process.env.DB_NAME,
      synchronize: true,
      entities: [__dirname + '/scheme/*.{js,ts}'],
      useUnifiedTopology: true,
    });
  }

  private setMiddleware(): void {
    this.express.get('/', expressPlayground({ endpoint: '/graphql' }));
    this.express.use(cors());
  }

  private initGraphQL(): void {
    this.express.use(
      '/graphql',
      graphqlHTTP({
        schema: buildSchemaSync({ resolvers }),
        graphiql: false,
      })
    );
  }

  private catchErrors(): void {}
}

export default new App();
