import {MigrationInterface, QueryRunner} from "typeorm";

export class SetDefaultNullForPostSlug1613829002181 implements MigrationInterface {
    name = 'SetDefaultNullForPostSlug1613829002181'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `post` CHANGE `deletedAt` `deletedAt` timestamp NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `post` CHANGE `deletedAt` `deletedAt` timestamp NOT NULL");
    }

}
