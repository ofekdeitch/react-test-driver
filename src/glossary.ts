export interface Response<T> {
    data: T;
    status: number;
}

export type RouteHandler<T> = () => Response<T>;

export interface RouteDefinition<T> {
    url: string;
    handler: RouteHandler<T>;
}
