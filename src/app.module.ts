import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SourceModule } from './app/source/source.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    SourceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
