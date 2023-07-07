import {
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
} from "kysely";

export interface UserTable {
    id: Generated<number>;

    email: string;
    password: string;

    created_at: ColumnType<Date, string | undefined, never>;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
