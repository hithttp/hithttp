import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { User } from "src/users/user.entity";

export class addUserOTP1581755147451 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns("user", [new TableColumn({
            "name": "otp",
            "type": "varchar",
            "isNullable":true
        }), new TableColumn({
            "name": "otpcreatedon",
            "type": "timestamp",
            "isNullable":true
        })])
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumns("user", [new TableColumn({
            "name": "otp",
            "type": "varchar",
            "isNullable":true
        }), new TableColumn({
            "name": "otpcreatedon",
            "type": "timestamp",
            "isNullable":true
        })])
    }

}
