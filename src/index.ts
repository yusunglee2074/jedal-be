import 'reflect-metadata';
import App from './App';
import * as env from 'dotenv';
import * as path from 'path';

if (process.env.NODE_ENV === 'production') {
  env.config({ path: path.join(__dirname, '../.env.production') });
} else {
  env.config({ path: path.join(__dirname, '../.env.development') });
}

const PORT = process.env.PORT;

// DB initialize

(async (): Promise<void> => {
  try {
    await App.connectDatabase();
    new App().express.listen(PORT, (err) => {
      if (err) {
        console.log("Can't launch express server");
      } else {
        console.log('success');
        console.log(`App listening at http://localhost:${PORT}`);
      }
    });
  } catch (e) {
    console.log('서버 실행 실패', e);
  }
})();
