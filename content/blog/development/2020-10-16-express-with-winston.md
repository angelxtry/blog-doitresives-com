---
title: "Express에 winston 추가"
date: 2020-10-16 21:10:71
category: development
---

Express 서버에 logging을 위해 winston을 사용했다.

winston 사용법을 간단하게 적어보자.

```ts
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const { combine, timestamp, printf } = winston.format;

const logDir = 'logs';
const logFormat = printf((info) => `${info.timestamp}|${info.level}|${info.message}`);

export const logger = winston.createLogger({
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports: [
    new winstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD-HH',
      dirname: logDir,
      filename: '%DATE%.log',
      maxFiles: '7d',
      maxSize: '20m',
      zippedArchive: true,
    }),
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD-HH',
      dirname: `${logDir}/error`,
      filename: '%DATE%.error.log',
      maxFiles: '7d',
      maxSize: '20m',
      zippedArchive: true,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  );
}

export const stream = {
  write: (message) => logger.info(message),
};
```

`winston`과 `winston-daily-rotate-file`을 함께 설치했다.

printf를 이용하여 `timestamp|level|message` 형식으로 출력하게 설정했다.

timestamp는 YYYY-MM-DD HH:mm:ss 형식으로 출력한다.

winston은 `transports`를 통해 다양한 방식(?)으로 로그를 남길 수 있다.

`winston-daily-rotate-file`을 이용하여 다음과 같이 설정했다.

- 파일명은 2020-10-16-21.log 처럼 생성된다.
- 경로는 logs
- 최대 보관 주기는 7일. 7일이 지난 파일은 삭제된다.
- 파일의 크기는 20m. 20m를 넘으면 다른 파일이 생성된다.
- 다른 파일이 생성될 때 기존 파일은 압축된다.

그리고 production 모드가 아닌 경우 transports에 console 출력도 포함시켰다.

winston은 기본적으로 다음과 같은 level을 설정할 수 있다.

```js
{ 
  error: 0, 
  warn: 1, 
  info: 2, 
  http: 3,
  verbose: 4, 
  debug: 5, 
  silly: 6 
}
```

숫자가 높은 level을 설정하면 숫자가 낮은 level이 자동으로 포함된다.

위의 코드에서 `info`와 `error`를 설정했는데, info에는 error의 내용이 함께 기록된다.

level과 각 level의 color도 커스텀할 수 있다.

마지막으로 `stream`은 Express에서 자주 사용하는 morgan의 log를 파일로 출력하기 위해 만들어 둔다.

이제 Express 코드를 확인해보자.

```ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { common, logger, stream } from './config';

const app = express();
app.use(
  cors({
    origin: common.corsUrl,
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan('combined', { stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { port } = common;
export const start = () => {
  app.listen(port, () => {
    logger.info(`server is on ${port}`);
  });
};
```

logger와 stream을 모두 import 했다.

morgan의 log는 stream으로 파일에 기록한다.

일반적으로는 `logger.info`나 `logger.error`를 이용하여 로그를 기록한다.

## 참고자료

[[Node.js] Logging 라이브러리 winston 적용하기](https://velog.io/@ash/Node.js-%EC%84%9C%EB%B2%84%EC%97%90-logging-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-winston-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0)

[winston - npm](https://www.npmjs.com/package/winston)

[winston-daily-rotate-file](https://github.com/winstonjs/winston-daily-rotate-file)
