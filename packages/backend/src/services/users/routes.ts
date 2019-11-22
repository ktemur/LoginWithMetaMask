import * as express from 'express';
import * as jwt from 'express-jwt';

import { config } from '../../config';
import * as controller from './controller';

export const userRouter = express.Router();


userRouter.route('/').get(controller.find);


userRouter
  .route('/:userId')
  .get(jwt({ secret: config.secret }), controller.get);


userRouter.route('/').post(controller.create);


userRouter
  .route('/:userId')
  .patch(jwt({ secret: config.secret }), controller.patch);
