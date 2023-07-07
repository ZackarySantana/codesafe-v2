export type LoginCredentials = {
    email: string;
    password: string;
};

export type ErrorResponse = {
    statusCode: number;
    body: string;
};

export type ReturnOr<T, R> = [T, undefined] | [undefined, R];
