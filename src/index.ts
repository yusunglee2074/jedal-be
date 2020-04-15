import App from './App';

const PORT = 3000;

// DB initialize

(async () => {
  try {
    await App.connectDatabase();
  } catch (e) {
    console.log('DB 연결 실패', e);
  }
  App.express.listen(PORT, (err) => {
    if (err) {
      console.log("Can't launch express server");
    }
    console.log(`App listening at http://localhost:${PORT}`);
  });
})();
