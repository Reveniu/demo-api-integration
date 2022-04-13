import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from 'src/subscription.interface.ts/subscription.entity';
import { UserEntity } from 'src/subscription.interface.ts/user.entity';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            port: 5432,
            username: 'henryfriday',
            password: 'admin',
            database: 'db_reveniu',
            entities: [SubscriptionEntity, UserEntity],
            synchronize: true,
            logging: false,
            type: 'postgres',
            /* url: process.env.DATABASE_URL,
            
            ssl: {
                rejectUnauthorized: false,
            },
            entities: ['dist.entity{.ts,.js}'],
            synchronize: true,
            autoLoadEntities: true, */
        }),
    ],
})
export class DatabaseModule {}
