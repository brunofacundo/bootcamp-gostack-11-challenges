import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '@modules/orders/infra/typeorm/entities/Order';

class OrdersRepository implements IOrdersRepository {
    private ormRepository: Repository<Order>;

    constructor() {
        this.ormRepository = getRepository(Order);
    }

    public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
        const order = this.ormRepository.create({
            customer,
            order_products: products.map(product => ({
                product_id: product.product_id,
                price: product.price,
                quantity: product.quantity
            }))
        });

        await this.ormRepository.save(order);

        return order;
    }

    public async findById(id: string): Promise<Order | undefined> {
        const findOrder = await this.ormRepository.findOne(id);

        return findOrder;
    }
}

export default OrdersRepository;
