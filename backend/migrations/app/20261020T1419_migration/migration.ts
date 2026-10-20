#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/f3238f60f4ab2e778ca5484f4e599ef6dcf350b1d061473c2505bc7126ef4661/contract';
import endContract from '../../snapshots/f3238f60f4ab2e778ca5484f4e599ef6dcf350b1d061473c2505bc7126ef4661/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'notifications',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('is_read', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('message', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('read_at', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('recipient_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('submission_id', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('title', 'character varying(150)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'notifications_type_check_c7ac7b0c',
            `"type" IN ('SUBMISSION_RECEIVED', 'REVIEW_STARTED', 'REVIEW_COMPLETED', 'CHANGES_REQUESTED', 'SUBMISSION_APPROVED', 'SUBMISSION_REJECTED', 'REVIEW_ASSIGNED', 'SYSTEM')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'project_submissions',
        columns: [
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('deleted_at', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('live_demo_url', 'character varying(2048)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 2048 } },
          }),
          col('owner_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('repository_url', 'character varying(2048)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 2048 } },
          }),
          col('screenshots', 'text[]', {
            notNull: true,
            default: lit([]),
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('DRAFT'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('submitted_at', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('summary', 'character varying(300)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 300 } },
          }),
          col('technologies', 'text[]', {
            notNull: true,
            default: lit([]),
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('title', 'character varying(150)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'project_submissions_screenshots_elem_not_null_5a300cad',
            'array_position("screenshots", NULL) IS NULL',
          ),
          checkExpression(
            'project_submissions_status_check_6e490a70',
            `"status" IN ('DRAFT', 'SUBMITTED', 'IN_REVIEW', 'CHANGES_REQUESTED', 'RESUBMITTED', 'APPROVED', 'REJECTED')`,
          ),
          checkExpression(
            'project_submissions_technologies_elem_not_null_89b37e18',
            'array_position("technologies", NULL) IS NULL',
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'review_assignments',
        columns: [
          col('assigned_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('completed_at', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('reviewer_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('ASSIGNED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('submission_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'review_assignments_status_check_bfa78172',
            `"status" IN ('ASSIGNED', 'ACCEPTED', 'COMPLETED', 'CANCELLED')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'reviews',
        columns: [
          col('accessibility', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('code_quality', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('decision', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('documentation', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('feedback', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('functionality', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('overall_score', 'numeric(3,2)', {
            notNull: true,
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 3, scale: 2 } },
          }),
          col('responsiveness', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('reviewer_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('revision_number', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('submission_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('ui_ux', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'reviews_decision_check_449fc192',
            `"decision" IN ('APPROVED', 'REJECTED', 'CHANGES_REQUESTED')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'submission_status_history',
        columns: [
          col('changed_by_id', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('from_status', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('note', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('submission_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('to_status', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'submission_status_history_from_status_check_3d464584',
            `"from_status" IN ('DRAFT', 'SUBMITTED', 'IN_REVIEW', 'CHANGES_REQUESTED', 'RESUBMITTED', 'APPROVED', 'REJECTED')`,
          ),
          checkExpression(
            'submission_status_history_to_status_check_3b6ee6b5',
            `"to_status" IN ('DRAFT', 'SUBMITTED', 'IN_REVIEW', 'CHANGES_REQUESTED', 'RESUBMITTED', 'APPROVED', 'REJECTED')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'users',
        columns: [
          col('avatar', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('created_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('email_verified_at', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('name', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('password_hash', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', {
            notNull: true,
            default: lit('STUDENT'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('ACTIVE'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'users_role_check_7da8de5a',
            `"role" IN ('STUDENT', 'REVIEWER', 'ADMIN')`,
          ),
          checkExpression(
            'users_status_check_5dec1c59',
            `"status" IN ('ACTIVE', 'SUSPENDED', 'DEACTIVATED')`,
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'project_submissions',
        constraint: 'project_submissions_owner_id_repository_url_key',
        columns: ['owner_id', 'repository_url'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'review_assignments',
        constraint: 'review_assignments_submission_id_reviewer_id_key',
        columns: ['submission_id', 'reviewer_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'reviews',
        constraint: 'reviews_submission_id_revision_number_key',
        columns: ['submission_id', 'revision_number'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'users',
        constraint: 'users_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'notifications',
        index: 'notifications_recipient_id_idx_1e4ca6fd',
        columns: ['recipient_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'notifications',
        index: 'notifications_recipient_id_is_read_created_at_idx_681b2a09',
        columns: ['recipient_id', 'is_read', 'created_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'notifications',
        index: 'notifications_submission_id_idx_82020796',
        columns: ['submission_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'project_submissions',
        index: 'project_submissions_created_at_idx_225d8c0f',
        columns: ['created_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'project_submissions',
        index: 'project_submissions_owner_id_idx_ade9f347',
        columns: ['owner_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'project_submissions',
        index: 'project_submissions_owner_id_status_idx_5132887a',
        columns: ['owner_id', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'project_submissions',
        index: 'project_submissions_status_created_at_idx_1bbe8adf',
        columns: ['status', 'created_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'review_assignments',
        index: 'review_assignments_reviewer_id_idx_ab069db0',
        columns: ['reviewer_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'review_assignments',
        index: 'review_assignments_reviewer_id_status_idx_19b88c74',
        columns: ['reviewer_id', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'review_assignments',
        index: 'review_assignments_submission_id_idx_82020796',
        columns: ['submission_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'review_assignments',
        index: 'review_assignments_submission_id_status_idx_9a757808',
        columns: ['submission_id', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'reviews',
        index: 'reviews_reviewer_id_created_at_idx_69eb3380',
        columns: ['reviewer_id', 'created_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'reviews',
        index: 'reviews_reviewer_id_idx_ab069db0',
        columns: ['reviewer_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'reviews',
        index: 'reviews_submission_id_created_at_idx_6739f7e6',
        columns: ['submission_id', 'created_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'reviews',
        index: 'reviews_submission_id_idx_82020796',
        columns: ['submission_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'submission_status_history',
        index: 'submission_status_history_changed_by_id_created_at_idx_b7c17473',
        columns: ['changed_by_id', 'created_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'submission_status_history',
        index: 'submission_status_history_changed_by_id_idx_dd031b3b',
        columns: ['changed_by_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'submission_status_history',
        index: 'submission_status_history_submission_id_created_at_idx_6739f7e6',
        columns: ['submission_id', 'created_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'submission_status_history',
        index: 'submission_status_history_submission_id_idx_82020796',
        columns: ['submission_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'users',
        index: 'users_created_at_idx_225d8c0f',
        columns: ['created_at'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'users',
        index: 'users_role_status_idx_e87879e1',
        columns: ['role', 'status'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'notifications',
        foreignKey: {
          name: 'notifications_recipient_id_fkey',
          columns: ['recipient_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'notifications',
        foreignKey: {
          name: 'notifications_submission_id_fkey',
          columns: ['submission_id'],
          references: { schema: 'public', table: 'project_submissions', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'project_submissions',
        foreignKey: {
          name: 'project_submissions_owner_id_fkey',
          columns: ['owner_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'review_assignments',
        foreignKey: {
          name: 'review_assignments_submission_id_fkey',
          columns: ['submission_id'],
          references: { schema: 'public', table: 'project_submissions', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'review_assignments',
        foreignKey: {
          name: 'review_assignments_reviewer_id_fkey',
          columns: ['reviewer_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'reviews',
        foreignKey: {
          name: 'reviews_submission_id_fkey',
          columns: ['submission_id'],
          references: { schema: 'public', table: 'project_submissions', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'reviews',
        foreignKey: {
          name: 'reviews_reviewer_id_fkey',
          columns: ['reviewer_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'submission_status_history',
        foreignKey: {
          name: 'submission_status_history_submission_id_fkey',
          columns: ['submission_id'],
          references: { schema: 'public', table: 'project_submissions', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'submission_status_history',
        foreignKey: {
          name: 'submission_status_history_changed_by_id_fkey',
          columns: ['changed_by_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
