/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import { Kysely, sql } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
    await db.schema
        .createTable("user")
        .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
        .addColumn("email", "varchar(255)", (col) => col.notNull())
        .addColumn("password", "varchar(255)", (col) => col.notNull())
        .addColumn("created_at", "timestamp", (col) =>
            col.defaultTo(sql`now()`).notNull(),
        )
        .execute();

    await db
        .insertInto("user")
        .values({
            email: "test@test.com",
            password: bcrypt.hashSync("test", bcrypt.genSaltSync(10)),
        })
        .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
    await db.schema.dropTable("user").execute();
}
