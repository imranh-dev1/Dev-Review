#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/342d826e16d8d6e662b8080845f88b6c70551abcc7df706e533bc1696cf57282/contract';
import endContract from '../../snapshots/342d826e16d8d6e662b8080845f88b6c70551abcc7df706e533bc1696cf57282/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/732d5b1425a44200578e7bfc9fcd3e17a2d825e1f0496fbd2fd04ef52ed03d5e/contract';
import startContract from '../../snapshots/732d5b1425a44200578e7bfc9fcd3e17a2d825e1f0496fbd2fd04ef52ed03d5e/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'audit_logs',
        columns: [
          col('action', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('actor_id', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('entity_id', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('entity_type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('ip_address', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('metadata', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'audit_logs_action_check_fd2d4833',
            `"action" IN ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'ASSIGN_REVIEWER', 'START_REVIEW', 'SUBMIT_REVIEW', 'STATUS_CHANGE', 'USER_STATUS_CHANGE', 'ROLE_CHANGE')`,
          ),
          checkExpression(
            'audit_logs_entity_type_check_41a4936d',
            `"entity_type" IN ('USER', 'SUBMISSION', 'REVIEW', 'ASSIGNMENT', 'NOTIFICATION', 'SYSTEM')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'review_criteria',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('is_active', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('key', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('label', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sort_order', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('weight', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'review_criteria',
        constraint: 'review_criteria_key_key',
        columns: ['key'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'audit_logs',
        index: 'audit_logs_actor_id_created_at_idx_73c9864c',
        columns: ['actor_id', 'created_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'audit_logs',
        index: 'audit_logs_actor_id_idx_69a2164d',
        columns: ['actor_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'audit_logs',
        index: 'audit_logs_created_at_idx_225d8c0f',
        columns: ['created_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'audit_logs',
        index: 'audit_logs_entity_type_entity_id_idx_4cde03a1',
        columns: ['entity_type', 'entity_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'review_criteria',
        index: 'review_criteria_is_active_sort_order_idx_588043b5',
        columns: ['is_active', 'sort_order'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'audit_logs',
        foreignKey: {
          name: 'audit_logs_actor_id_fkey',
          columns: ['actor_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
