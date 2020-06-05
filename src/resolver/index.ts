import * as fs from 'fs';
import * as path from 'path';

// 해당 폴더내의 리솔버를 묶어서 한 개의 Array로 반환
const resolvers = [];

((): void => {
  try {
    const files = fs.readdirSync(path.dirname(__filename));
    for (const file of files) {
      if (file.indexOf('index') > -1) continue;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      resolvers.push(require(`./${file}`));
    }
  } catch (e) {
    console.error("We've thrown! Whoops!", e);
  }
})();

export default resolvers;
