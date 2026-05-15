import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/user/users.module';
import { DatabaseModule } from '../database/database.module';
import { MortgagesModule } from './modules/mortgage/mortgages.module';
import { BullModule } from '@nestjs/bullmq';
import { MortgageWorkerModule } from './modules/mortgage/workers/mortgage/mortgage.worker.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
     BullModule.forRoot({
      connection: {
        host: 'redis',
        port: 6379,
      },
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0'),
      ttl: parseInt(process.env.REDIS_TTL || '3600'),
    }),
    MortgageWorkerModule,
    DatabaseModule,
    UsersModule,
    MortgagesModule,
  ],
})
export class AppModule { }
