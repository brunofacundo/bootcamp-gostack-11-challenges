import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import Order from '@modules/orders/infra/typeorm/entities/Order';

interface IProduct {
    id: string;
    quantity: number;
}

interface IRequest {
    customer_id: string;
    products: IProduct[];
}

@injectable()
class CreateProductService {
    constructor(
        @inject('OrdersRepository')
        private ordersRepository: IOrdersRepository,

        @inject('ProductsRepository')
        private productsRepository: IProductsRepository,

        @inject('CustomersRepository')
        private customersRepository: ICustomersRepository
    ) {}

    public async execute({ customer_id, products }: IRequest): Promise<Order> {
        const customer = await this.customersRepository.findById(customer_id);
        if (!customer) {
            throw new AppError('Customer not found');
        }

        const getProductQuantity = (id: string, quantity: number): number => {
            const product = products.find(findProduct => findProduct.id === id);

            if (product) {
                if (product.quantity > quantity) {
                    throw new AppError('Product with insufficient quantity');
                }

                return product.quantity;
            }

            return 1;
        };

        const findProducts = await this.productsRepository.findAllById(products.map(product => ({ id: product.id })));
        const mapProducts = findProducts.map(product => ({
            product_id: product.id,
            price: product.price,
            quantity: getProductQuantity(product.id, product.quantity)
        }));

        const order = await this.ordersRepository.create({ customer, products: mapProducts });

        const updateQuatityProducts = mapProducts.map(product => ({
            id: product.product_id,
            quantity: product.quantity
        }));
        await this.productsRepository.updateQuantity(updateQuatityProducts);

        return order;
    }
}

export default CreateProductService;
