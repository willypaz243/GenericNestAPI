import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1741620582956 implements MigrationInterface {
  name = 'Migration1741620582956';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "resource" DROP CONSTRAINT "PK_e2894a5867e06ae2e8889f1173f"`,
    );
    await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "status" character varying NOT NULL DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE "resource" ADD CONSTRAINT "PK_922309d341360865c92d049ac58" PRIMARY KEY ("role_id", "name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "UQ_ae4578dcaed5adff96595e61660"`,
    );
    await queryRunner.query(
      `ALTER TABLE "resource" DROP CONSTRAINT "PK_922309d341360865c92d049ac58"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "resource" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "resource" ADD CONSTRAINT "PK_e2894a5867e06ae2e8889f1173f" PRIMARY KEY ("id")`,
    );
  }
}
