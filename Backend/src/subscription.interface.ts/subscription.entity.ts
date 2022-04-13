import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class SubscriptionEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    subscription_id: number;

    @ManyToOne((type) => UserEntity, (user) => user.subscriptions)
    @JoinColumn()
    user: UserEntity;

    @Column()
    status: string;
}
