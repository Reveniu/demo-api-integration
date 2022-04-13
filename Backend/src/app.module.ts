import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SubscriptionEntity } from './subscription.interface.ts/subscription.entity';
import { UserEntity } from './subscription.interface.ts/user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([UserEntity, SubscriptionEntity]),
        HttpModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: 'development.env',
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
