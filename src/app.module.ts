import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  TypeOrmModule.forRoot({
    type : 'postgres',
    url : process.env.DB_URL,
    autoLoadEntities : true,
    synchronize : true
  }),
  AdminModule,],
  controllers: [AppController],
  providers : [ConfigService]
})
export class AppModule { }
