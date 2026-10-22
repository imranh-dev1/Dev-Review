#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/4bef71a411a8509a5ea6423790e2fbc9e0718b6b7ea1f5d9c58f80020d19a8b0/contract';
import startContract from '../../snapshots/4bef71a411a8509a5ea6423790e2fbc9e0718b6b7ea1f5d9c58f80020d19a8b0/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/9b749fadd70ed393644ac2fc093f743cc71be65891dc516103b6e213a8bc16bf/contract';
import endContract from '../../snapshots/9b749fadd70ed393644ac2fc093f743cc71be65891dc516103b6e213a8bc16bf/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.setDefault({
        schema: 'public',
        table: 'users',
        column: col('email_verified_at', 'timestamptz', {
          default: fn('now()'),
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
