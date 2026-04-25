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
const POLL_INTERVAL_MS = 30_000;

@Injectable()
export class OutboxWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxWorker.name);
  private listenClient!: Client;
  private running = false;

  constructor(
    @Inject(OUTBOX_MESSAGE_REPOSITORY)
    private readonly outboxRepo: IOutboxMessageRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const connectionString = this.configService.getOrThrow<string>('DATABASE_URL');
    this.listenClient = new Client({ connectionString });
    await this.listenClient.connect();
    await this.listenClient.query(`LISTEN ${OUTBOX_CHANNEL}`);
    this.running = true;
    void this.runLoop();
  }

  async onModuleDestroy(): Promise<void> {
    this.running = false;
    await this.listenClient.end();
  }


  private async runLoop(): Promise<void> {
    while (this.running) {
      await this.waitForNotifyOrTimeout();
      if (!this.running) break;
      await this.drainPending();
    }
  }

  private waitForNotifyOrTimeout(): Promise<void> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.listenClient.removeListener('notification', onNotify);
        this.logger.debug('Poll interval reached — draining pending messages');
        resolve();
      }, POLL_INTERVAL_MS);

      const onNotify = (): void => {
        clearTimeout(timer);
        this.logger.debug('NOTIFY received — draining pending messages');
        resolve();
      };

      this.listenClient.once('notification', onNotify);
    });
  }

  private async drainPending(): Promise<void> {
    const messages = await this.outboxRepo.findBy({
      status: OutboxMessageStatus.PENDING,
    });

    for (const message of messages) {
      await this.processMessage(message);
    }
  }

  private async processMessage(message: OutboxMessage): Promise<void> {
    if (message.status !== OutboxMessageStatus.PENDING) {
      return;
    }

    try {
      await this.publisher.publish(message);
      message.markProcessed();
      await this.outboxRepo.save(message);
    } catch (error) {
      this.logger.error(`Failed to process outbox message ${message.identification.id}`, error);
      message.incrementRetryCount();
      if (message.retryCount >= MAX_RETRIES) {
        message.markFailed();
      }
      await this.outboxRepo.save(message);
    }
  }
}
