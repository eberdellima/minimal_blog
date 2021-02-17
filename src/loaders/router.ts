import { Application, Router } from 'express';
import {configureRouter as configureCategoryRouter} from '../categories/router';
import {configureRouter as configurePostRouter} from '../posts/router';

export function loadRouters(app: Application) {

  const categoryRouter: Router = Router();
  configureCategoryRouter(categoryRouter);
  app.use('/categories', categoryRouter);

  const postRouter: Router = Router();
  configurePostRouter(postRouter);
  app.use('/posts', postRouter);

}