import App from './App';
import * as env from 'dotenv';
import path = require('path');

if (process.env.NODE_ENV === 'production') {
  env.config({ path: path.resolve(__dirname, '../.env.production') });
} else {
  env.config({ path: path.resolve(__dirname, '../.env.development') });
}

const PORT = process.env.PORT;

// DB initialize

(async () => {
  try {
    await App.connectDatabase();
    App.express.listen(PORT, (err) => {
      if (err) {
        console.log("Can't launch express server");
      } else {
        console.log('success');
        console.log(`App listening at http://localhost:${PORT}`);
      }
    });
  } catch (e) {
    console.log('DB 연결 실패', e);
  }
})();
