import {
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
} from "kysely";

export type UserTable = {
    id: Generated<number>;

    email: string;
    password: string;

    created_at: ColumnType<Date, string | undefined, never>;
};

export type User = Omit<Selectable<UserTable>, "password">;
export type UserWithPassword = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
