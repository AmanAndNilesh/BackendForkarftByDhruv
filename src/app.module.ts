import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), AdminModule,],
  controllers: [AppController],
})
export class AppModule { }
