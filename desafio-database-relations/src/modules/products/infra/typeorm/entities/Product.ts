import { Column, CreateDateColumn, OneToMany, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

@Entity('products')
export default class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column()
    quantity: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => OrdersProducts, ordersProducts => ordersProducts.product)
    order_products: OrdersProducts[];
}
