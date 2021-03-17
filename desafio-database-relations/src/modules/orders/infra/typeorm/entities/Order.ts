import {
    OneToMany,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';

import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

@Entity('orders')
export default class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Customer, customer => customer.orders, { eager: true })
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @OneToMany(() => OrdersProducts, ordersProducts => ordersProducts.order, { eager: true, cascade: ['insert'] })
    order_products: OrdersProducts[];
}
