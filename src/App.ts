import * as express from 'express';
import * as cors from 'cors';
import expressPlayground from 'graphql-playground-middleware-express';
import { createConnection } from 'typeorm';
import * as graphqlHTTP from 'express-graphql';
import { buildSchemaSync } from 'type-graphql';
import resolvers from './resolver';
import { initCacheData } from './cache';

// TODO: 클래스 말고 그냥 펑션으로 작성
class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.setMiddleware();
    this.initGraphQL();
    this.catchErrors();
    initCacheData();
  }

  static async connectDatabase(): Promise<void> {
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
      graphqlHTTP((req) => {
        return {
          schema: buildSchemaSync({ resolvers }),
          graphiql: false,
          // TODO: 추후 토큰 방식 인증 이용할 때 context 정의
          // context: {
          //   userId: req.headers.userId
          // },
        };
      })
    );
  }


  private catchErrors(): void {}
}

export default App;
