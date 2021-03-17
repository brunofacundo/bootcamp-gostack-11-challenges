import path from 'path';
import fs from 'fs';
import parse from 'csv-parse/lib/sync';
import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
    async execute(filename: string): Promise<Transaction[]> {
        const filePath = path.join(uploadConfig.directory, filename);
        const fileData = fs.readFileSync(filePath, { encoding: 'utf8' });
        const createTransactionService = new CreateTransactionService();

        const csvTransactions = parse(fileData, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            cast(value, context) {
                if (context.column === 'value') {
                    return parseInt(value, 10);
                }
                return value;
            }
        });
        fs.unlinkSync(filePath);

        const transactions = [];
        for (const { title, value, type, category } of csvTransactions) {
            const transaction = await createTransactionService.execute({ title, value, type, category });
            transactions.push(transaction);
        }

        return transactions;
    }
}

export default ImportTransactionsService;
