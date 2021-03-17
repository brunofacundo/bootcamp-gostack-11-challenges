import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '@modules/products/infra/typeorm/entities/Product';

interface IFindProducts {
    id: string;
}

class ProductsRepository implements IProductsRepository {
    private ormRepository: Repository<Product>;

    constructor() {
        this.ormRepository = getRepository(Product);
    }

    public async create({ name, price, quantity }: ICreateProductDTO): Promise<Product> {
        const product = this.ormRepository.create({
            name,
            price,
            quantity
        });

        await this.ormRepository.save(product);

        return product;
    }

    public async findByName(name: string): Promise<Product | undefined> {
        const findProduct = await this.ormRepository.findOne({
            where: {
                name
            }
        });

        return findProduct;
    }

    public async findAllById(products: IFindProducts[]): Promise<Product[]> {
        const findProducts = await this.ormRepository.find({
            where: {
                id: In(products.map(product => product.id))
            }
        });

        return findProducts;
    }

    public async updateQuantity(products: IUpdateProductsQuantityDTO[]): Promise<Product[]> {
        let findProducts = await this.findAllById(products);

        const subQuantity = ({ id, quantity }: Product): number => {
            const product = products.find(findProduct => findProduct.id === id);

            if (product) {
                return quantity - product.quantity;
            }

            return quantity;
        };
        findProducts = findProducts.map(findProduct => ({ ...findProduct, quantity: subQuantity(findProduct) }));

        await this.ormRepository.save(findProducts);

        return findProducts;
    }
}

export default ProductsRepository;
