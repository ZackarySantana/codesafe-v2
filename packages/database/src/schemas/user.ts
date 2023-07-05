import {
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
} from "kysely";

export interface PersonTable {
    id: Generated<number>;

    email: string;
    password: string;

    created_at: ColumnType<Date, string | undefined, never>;
}

export type Person = Selectable<PersonTable>;
export type NewPerson = Insertable<PersonTable>;
export type PersonUpdate = Updateable<PersonTable>;
