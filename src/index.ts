import { rest } from "msw";
import { setupServer, SetupServerApi } from "msw/node";
import { RouteDefinition } from "./glossary";

export abstract class TestDriver {
    server?: SetupServerApi;

    async start() {
        const definitions = this.configureRoutes();
        const routes = prepareRoutes(definitions);

        this.server = setupServer(...routes);
        await this.server.listen();
    }

    stop() {
        this.server?.close();
    }

    protected abstract configureRoutes(): RouteDefinition<any>[];
}

function prepareRoutes(definitions: RouteDefinition<any>[]): any[] {
    return definitions.map((definition) =>
        rest.get(definition.url, (_req, res, ctx) => {
            const { data, status } = definition.handler();

            return res(ctx.status(status), ctx.json(data));
        }),
    );
}
