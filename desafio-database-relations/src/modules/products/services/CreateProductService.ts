import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '@modules/products/infra/typeorm/entities/Product';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';

interface IRequest {
    name: string;
    price: number;
    quantity: number;
}

@injectable()
class CreateProductService {
    constructor(
        @inject('ProductsRepository')
        private productsRepository: IProductsRepository
    ) {}

    public async execute({ name, price, quantity }: IRequest): Promise<Product> {
        const checksNameAlreadyExist = await this.productsRepository.findByName(name);
        if (checksNameAlreadyExist) {
            throw new AppError('Name already used');
        }

        return this.productsRepository.create({ name, price, quantity });
    }
}

export default CreateProductService;
