import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";

import { PrismaModule } from "../prisma/prisma.module";
import { OutboxModule } from "./app/modules/outbox/outbox.module";
import { UserModule } from "./app/modules/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    UserModule,
    OutboxModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
