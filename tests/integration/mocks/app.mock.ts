import express from 'express';
import { loadRouters } from '../../../src/loaders/router';
import { loadServerConfiguration } from '../../../src/loaders/server';

const app = express();
loadServerConfiguration(app);
loadRouters(app);

export default app;