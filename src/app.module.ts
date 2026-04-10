import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SourceModule } from './app/source/source.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SourceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
