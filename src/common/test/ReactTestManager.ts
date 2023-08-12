import { injectable } from "inversify";

export interface IReactTest {
    name: string;
    render: () => JSX.Element;
}

@injectable()
export class ReactTestManager {
    private static _instance: ReactTestManager;
    static get Instance() {
        if (!ReactTestManager._instance) {
            ReactTestManager._instance = new ReactTestManager();
        }
        return ReactTestManager._instance;
    }

    private _testMap: Map<string, IReactTest> = new Map<string, IReactTest>();

    registerTest(name: string, render: () => JSX.Element) {
        this._testMap.set(name, { name, render });
    }

    getTest(name: string) {
        return this._testMap.get(name);
    }

    get tests() {
        return Array.from(this._testMap.values());
    }
}
