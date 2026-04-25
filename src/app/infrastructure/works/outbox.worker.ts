import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

import type { EventPublisher } from '../../application/events/event-publisher.interface';
import { EVENT_PUBLISHER } from '../../application/events/event-publisher.interface';
import {
  type IOutboxMessageRepository,
  OUTBOX_MESSAGE_REPOSITORY,
} from '../outbox/outbox.repository';
import {
  OutboxMessage,
  OutboxMessageStatus,
} from '../outbox/outbox-message/outbox-message.entity';

const OUTBOX_CHANNEL = 'outbox_channel';
const MAX_RETRIES = 3;
const FALLBACK_POLL_MS = 30_000;

@Injectable()
export class OutboxWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxWorker.name);
  private listenClient!: Client;
  private fallbackTimer?: NodeJS.Timeout;

  constructor(
    @Inject(OUTBOX_MESSAGE_REPOSITORY)
    private readonly outboxRepo: IOutboxMessageRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.startListening();
    this.startFallbackPolling();
  }

  async onModuleDestroy(): Promise<void> {
    clearInterval(this.fallbackTimer);
    await this.listenClient.end();
  }

  private async startListening(): Promise<void> {
    const connectionString = this.configService.getOrThrow<string>('DATABASE_URL');
    this.listenClient = new Client({ connectionString });
    await this.listenClient.connect();
    this.listenClient.on('notification', (msg) => {
      if (msg.channel === OUTBOX_CHANNEL) {
        void this.processOutboxMessage(msg.payload);
      }
    });
    await this.listenClient.query(`LISTEN ${OUTBOX_CHANNEL}`);
  }

  private startFallbackPolling(): void {
    this.fallbackTimer = setInterval(() => {
      void (async () => {
        const pendingMessages = await this.outboxRepo.findBy({
          status: OutboxMessageStatus.PENDING,
        });
        for (const message of pendingMessages) {
          await this.processOutboxMessage(message);
        }
      })();
    }, FALLBACK_POLL_MS);
  }

  private async processOutboxMessage(
    input: string | OutboxMessage | undefined,
  ): Promise<void> {
    let message: OutboxMessage;

    if (typeof input === 'string') {
      try {
        message = JSON.parse(input) as OutboxMessage;
      } catch (error) {
        this.logger.error('Failed to parse outbox message payload', error);
        return;
      }
    } else if (input instanceof OutboxMessage) {
      message = input;
    } else {
      this.logger.warn('Received invalid input');
      return;
    }

    if (message.status !== OutboxMessageStatus.PENDING) {
      return;
    }

    try {
      await this.publisher.publish(message);
      message.markProcessed();
      await this.outboxRepo.save(message);
    } catch (error) {
      this.logger.error('Failed to process outbox message', error);
      message.incrementRetryCount();
      if (message.retryCount >= MAX_RETRIES) {
        message.markFailed();
      }
      await this.outboxRepo.save(message);
    }
  }
}
