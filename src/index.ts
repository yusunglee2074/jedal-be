import App from './App';

const PORT = 3000;

// DB initialize

(async () => {
  try {
    await App.connectDatabase();
    App.express.listen(PORT, (err) => {
      if (err) {
        console.log("Can't launch express server");
      } else {
        console.log(`App listening at http://localhost:${PORT}`);
      }
    });
  } catch (e) {
    console.log('DB 연결 실패', e);
  }
})();
