import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';

interface IRequest {
    name: string;
    email: string;
}

@injectable()
class CreateCustomerService {
    constructor(
        @inject('CustomersRepository')
        private customersRepository: ICustomersRepository
    ) {}

    public async execute({ name, email }: IRequest): Promise<Customer> {
        const checksEmailAlreadyExist = await this.customersRepository.findByEmail(email);
        if (checksEmailAlreadyExist) {
            throw new AppError('Email already used');
        }

        return this.customersRepository.create({ name, email });
    }
}

export default CreateCustomerService;
