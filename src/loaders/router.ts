import { Application, Router } from 'express';
import {configureRouter as configureCategoryRouter} from '../categories/router';
import {configureRouter as configurePostRouter} from '../posts/router';
import { Connection, getConnection } from 'typeorm';

export function loadRouters(app: Application, connection: Connection) {

  const applicationConnection = connection ? connection : getConnection();

  const categoryRouter: Router = Router();
  configureCategoryRouter(categoryRouter, applicationConnection);
  app.use('/categories', categoryRouter);

  const postRouter: Router = Router();
  configurePostRouter(postRouter, applicationConnection);
  app.use('/posts', postRouter);

}