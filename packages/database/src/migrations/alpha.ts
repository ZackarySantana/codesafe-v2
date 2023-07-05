/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    console.log("Going to create table person");
    await db.schema
        .createTable("person")
        .addColumn("id", "serial", (col) => col.primaryKey())
        .addColumn("email", "varchar", (col) => col.notNull())
        .addColumn("password", "varchar", (col) => col.notNull())
        .addColumn("created_at", "timestamp", (col) =>
            col.defaultTo(sql`now()`).notNull(),
        )
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("person").execute();
}
