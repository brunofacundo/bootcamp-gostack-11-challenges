import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
    title: string;
    value: number;
    type: 'income' | 'outcome';
}

class CreateTransactionService {
    private transactionsRepository: TransactionsRepository;

    constructor(transactionsRepository: TransactionsRepository) {
        this.transactionsRepository = transactionsRepository;
    }

    public execute({ title, value, type }: Request): Transaction {
        if (type === 'outcome') {
            const balance = this.transactionsRepository.getBalance();
            if (balance.total - value < 0) {
                throw new Error('Balance invalid');
            }
        }

        return this.transactionsRepository.create({ title, value, type });
    }
}

export default CreateTransactionService;
