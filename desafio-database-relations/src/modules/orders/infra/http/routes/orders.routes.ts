import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import OrdersController from '@modules/orders/infra/http/controller/OrdersController';

const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            customer_id: Joi.string().uuid().required(),
            products: Joi.array().items({
                id: Joi.string().uuid().required(),
                quantity: Joi.number().required()
            })
        }
    }),
    ordersController.create
);
ordersRouter.get('/:id', ordersController.show);

export default ordersRouter;
