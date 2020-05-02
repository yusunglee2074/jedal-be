import 'reflect-metadata';
import App from './App';

const PORT = 3000;

// DB initialize

(async (): Promise<void> => {
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
