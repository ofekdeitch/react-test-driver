import * as entry from ".";

describe("react-test-driver", () => {
    describe("TestDriver", () => {
        it("should be a class", () => {
            const typelessEntry = entry as any;
            const driver = new typelessEntry.TestDriver();
            expect(driver).not.toBeNull();
        });
    });
});
