#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/732d5b1425a44200578e7bfc9fcd3e17a2d825e1f0496fbd2fd04ef52ed03d5e/contract';
import endContract from '../../snapshots/732d5b1425a44200578e7bfc9fcd3e17a2d825e1f0496fbd2fd04ef52ed03d5e/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/9b749fadd70ed393644ac2fc093f743cc71be65891dc516103b6e213a8bc16bf/contract';
import startContract from '../../snapshots/9b749fadd70ed393644ac2fc093f743cc71be65891dc516103b6e213a8bc16bf/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dataTransform(endContract, 'typechange-notifications-title', {
        check: () => placeholder('typechange-notifications-title:check'),
        run: () => placeholder('typechange-notifications-title:run'),
      }),
      this.alterColumnType({
        schema: 'public',
        table: 'notifications',
        column: 'title',
        options: {
          qualifiedTargetType: 'text',
          formatTypeExpected: 'text',
          rawTargetTypeForLabel: 'text',
        },
      }),
      this.dataTransform(endContract, 'typechange-project_submissions-live_demo_url', {
        check: () => placeholder('typechange-project_submissions-live_demo_url:check'),
        run: () => placeholder('typechange-project_submissions-live_demo_url:run'),
      }),
      this.alterColumnType({
        schema: 'public',
        table: 'project_submissions',
        column: 'live_demo_url',
        options: {
          qualifiedTargetType: 'text',
          formatTypeExpected: 'text',
          rawTargetTypeForLabel: 'text',
        },
      }),
      this.dataTransform(endContract, 'typechange-project_submissions-repository_url', {
        check: () => placeholder('typechange-project_submissions-repository_url:check'),
        run: () => placeholder('typechange-project_submissions-repository_url:run'),
      }),
      this.alterColumnType({
        schema: 'public',
        table: 'project_submissions',
        column: 'repository_url',
        options: {
          qualifiedTargetType: 'text',
          formatTypeExpected: 'text',
          rawTargetTypeForLabel: 'text',
        },
      }),
      this.dataTransform(endContract, 'typechange-project_submissions-summary', {
        check: () => placeholder('typechange-project_submissions-summary:check'),
        run: () => placeholder('typechange-project_submissions-summary:run'),
      }),
      this.alterColumnType({
        schema: 'public',
        table: 'project_submissions',
        column: 'summary',
        options: {
          qualifiedTargetType: 'text',
          formatTypeExpected: 'text',
          rawTargetTypeForLabel: 'text',
        },
      }),
      this.dataTransform(endContract, 'typechange-project_submissions-title', {
        check: () => placeholder('typechange-project_submissions-title:check'),
        run: () => placeholder('typechange-project_submissions-title:run'),
      }),
      this.alterColumnType({
        schema: 'public',
        table: 'project_submissions',
        column: 'title',
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
