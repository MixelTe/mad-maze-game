export class Tests {
    constructor(tge, runEvent) {
        this.runEvent = runEvent;
        this.tge = tge;
        let window_testData = 0;
        window.testEvent = async (data) => {
            const parsed = JSON.parse(data);
            window_testData++;
            const window_testDataCur = window_testData;
            if (parsed.data != undefined) {
                while (window_testData == window_testDataCur) {
                    tge.clear();
                    await runEvent(parsed.data);
                    await tge.wait();
                }
            }
        };
        window.printEvent = async (data) => {
            const parsed = JSON.parse(data);
            if (parsed.data != undefined) {
                this.printEvent(parsed.data);
            }
        };
    }
    async testEvent(event) {
        while (true) {
            this.tge.clear();
            await this.runEvent(event);
            await this.tge.wait();
        }
    }
    printEvent(event) {
        this.tge.clear();
        this.tge.print(event.text);
        event.actions.forEach(act => {
            this.tge.print(act.text);
            act.results.forEach(res => this.tge.print("   " + res));
        });
    }
    async printEvents(events, startI, endI) {
        endI = endI || events.length;
        for (let i = startI; i < endI; i++) {
            const e = events[i];
            this.printEvent(e);
            this.tge.print();
            this.tge.print(`Событие №${i}`);
            await this.tge.choose(["Следующее событие"]);
        }
    }
    async printActions(actions, startI, endI) {
        endI = endI || actions.length;
        for (let i = startI; i < endI; i++) {
            const act = actions[i];
            this.tge.clear();
            this.tge.print(act.text);
            act.results.forEach(res => this.tge.print("   " + res));
            this.tge.print();
            this.tge.print(`Действие №${i}`);
            await this.tge.choose(["Следующее действие"]);
        }
    }
}
