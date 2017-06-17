import * as express from 'express';
import * as favicon from 'serve-favicon';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { LoggerInstance } from 'winston';

import { TYPES } from './inversify/types';
import { container } from './inversify/config';
import { HttpError } from './models/http-error.model';
import { apiRouter } from './api'

const app = express();
const logger = container.get<LoggerInstance>(TYPES.Logger);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', logUrls, apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new HttpError('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err: HttpError, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;

function logUrls(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.info(`${req.method} ${req.url}`);
  next();
}