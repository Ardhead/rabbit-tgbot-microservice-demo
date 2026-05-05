import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class MessagesRepository {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  findUnsentMessages(limit: number = 10) {
    return this.pool.query(
      'SELECT * FROM messages WHERE sended = false ORDER BY created_at LIMIT $1',
      [limit],
    ) as Promise<any>;
  }

  markAsSent(externalId: string) {
    return this.pool.query(
      'UPDATE messages SET sended = true WHERE external_id = $1',
      [externalId],
    ) as Promise<any>;
  }
}
