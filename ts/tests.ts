import { Room_event } from "./events";
import { TextGameEngine } from "./TextGameEngine";

declare global
{
	export interface Window
	{
		testEvent: (data: string) => Promise<void>;
		printEvent: (data: string) => Promise<void>;
	}
}
type RunEvent = (event: Room_event) => Promise<void>;
export class Tests
{
	private runEvent: RunEvent;
	private tge: TextGameEngine;
	constructor(tge: TextGameEngine, runEvent: RunEvent)
	{
		this.runEvent = runEvent;
		this.tge = tge;
		let window_testData = 0
		window.testEvent = async (data: string) =>
		{
			const parsed = JSON.parse(data);
			window_testData++;
			const window_testDataCur = window_testData;
			if (parsed.data != undefined)
			{
				while (window_testData == window_testDataCur)
				{
					tge.clear();
					await runEvent(parsed.data);
					await tge.wait();
				}
			}
		}
		window.printEvent = async (data: string) =>
		{
			const parsed = JSON.parse(data);
			if (parsed.data != undefined)
			{
				this.printEvent(<Room_event>parsed.data);
			}
		}
	}
	public async testEvent(event: Room_event)
	{
		while (true)
		{
			this.tge.clear();
			await this.runEvent(event);
			await this.tge.wait();
		}
	}
	public printEvent(event: Room_event)
	{
		this.tge.clear();
		this.tge.print(event.text);
		event.actions.forEach(act =>
		{
			this.tge.print(act.text);
			act.results.forEach(res => this.tge.print("   " + res));
		});
	}
	public async printEvents(events: Room_event[], startI: number, endI?: number)
	{
		endI = endI || events.length;
		for (let i = startI; i < endI; i++) {
			const e = events[i];
			this.printEvent(e);
			this.tge.print();
			this.tge.print(`Событие №${i}`);
			await this.tge.choose(["Следующее событие"]);
		}
	}
}