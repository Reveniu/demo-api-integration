import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SubscriptionEntity } from './subscription.entity';

@Entity()
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    password: string;

    @Column({ default: 'FREE' })
    plan: 'FREE' | 'PREMIUM' | 'SUSPENDED';

    @Column({ default: 'ACTIVATE' })
    status: 'ACTIVATE' | 'INACTIVATE';

    @OneToMany(
        (type) => SubscriptionEntity,
        (subscription) => subscription.user,
        { onDelete: 'CASCADE' }
    )
    subscriptions: SubscriptionEntity[];
}
