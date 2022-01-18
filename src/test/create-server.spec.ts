import axios from "axios";
import { TestDriver } from "../";
import { RouteDefinition } from "../glossary";

const responseData = { greeting: "Hello!" };

const handleRequest = jest.fn().mockImplementationOnce(() => ({
    status: 200,
    data: responseData,
}));

const SERVER_ENDPOINT = "http://www.google.com";

describe("Server", () => {
    describe("When route is configured", () => {
        afterEach(jest.clearAllMocks);

        describe("When the Driver is running", () => {
            let driver: DriverImpl;

            beforeEach(async () => {
                driver = new DriverImpl();
                driver.greetingDefinition = { url: `${SERVER_ENDPOINT}/api/greeting`, handler: handleRequest };

                await driver.start();
            });

            afterEach(() => {
                driver.stop();
            });

            it("requests should return successfully", async () => {
                const data = await sendRequest();

                expect(handleRequest).toHaveBeenCalledTimes(1);

                expect(data).toEqual(responseData);
            });
        });

        describe("When the Driver is not running", () => {
            let driver: DriverImpl;

            beforeEach(async () => {
                driver = new DriverImpl();
                driver.greetingDefinition = { url: `${SERVER_ENDPOINT}/api/greeting`, handler: handleRequest };

                await driver.start();
                driver.stop();
            });

            it("requests should fail", async () => {
                try {
                    await sendRequest();
                    expect(true).toBe(false);
                } catch (error) {
                    expect(error).not.toBeNull();
                    expect(handleRequest).not.toHaveBeenCalled();
                }
            });
        });
    });
});

async function sendRequest() {
    const { data } = await axios.get(`${SERVER_ENDPOINT}/api/greeting`);
    return data;
}

class DriverImpl extends TestDriver {
    public greetingDefinition?: RouteDefinition<any>;

    configureRoutes() {
        if (!this.greetingDefinition) {
            throw new Error("Routes not definred");
        }

        return [this.greetingDefinition];
    }
}
