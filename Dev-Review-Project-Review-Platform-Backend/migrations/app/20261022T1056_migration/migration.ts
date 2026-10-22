#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/4bef71a411a8509a5ea6423790e2fbc9e0718b6b7ea1f5d9c58f80020d19a8b0/contract';
import endContract from '../../snapshots/4bef71a411a8509a5ea6423790e2fbc9e0718b6b7ea1f5d9c58f80020d19a8b0/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/7384c77435cb00eaf10eee5750d6565cb0c18d6b1259cc1068b2bb8dbb91ca26/contract';
import startContract from '../../snapshots/7384c77435cb00eaf10eee5750d6565cb0c18d6b1259cc1068b2bb8dbb91ca26/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dataTransform(endContract, 'typechange-users-name', {
        check: () => placeholder('typechange-users-name:check'),
        run: () => placeholder('typechange-users-name:run'),
      }),
      this.alterColumnType({
        schema: 'public',
        table: 'users',
        column: 'name',
        options: {
          qualifiedTargetType: 'text',
          formatTypeExpected: 'text',
          rawTargetTypeForLabel: 'text',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
