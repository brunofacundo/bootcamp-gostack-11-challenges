import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
    title: string;
    value: number;
    type: 'income' | 'outcome';
    category: string;
}

class CreateTransactionService {
    public async execute({ title, value, type, category }: Request): Promise<Transaction> {
        const transactionsRepository = getCustomRepository(TransactionsRepository);
        const categoriesReporitory = getRepository(Category);

        if (type === 'outcome') {
            const balance = await transactionsRepository.getBalance();
            if (value > balance.total) {
                throw new AppError('Balance invalid', 400);
            }
        }

        let categoryModel = await categoriesReporitory.findOne({ title: category });
        if (!categoryModel) {
            categoryModel = await categoriesReporitory.save({ title: category });
        }

        const transactions = await transactionsRepository.save({
            title,
            value,
            type,
            category: categoryModel
        });

        return transactions;
    }
}

export default CreateTransactionService;
