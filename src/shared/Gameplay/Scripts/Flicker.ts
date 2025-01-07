import { Logger, LogLevel } from "shared/Utility/logger";

const logger = new Logger("FlickerController", LogLevel.Debug);

enum FlickerState {
	Pending = "Pending",
	Processing = "Processing",
	Completed = "Completed",
}

interface FlickerEvent {
	model: Model;
	baseFlickerInterval: number;
	duration: number;
	state: FlickerState;
}

export class FlickerController {
	private queue: FlickerEvent[] = [];
	private currentFlicker: FlickerEvent | undefined;

	constructor() {}

	public addFlickerEvent(model: Model, baseFlickerInterval: number, duration: number) {
		const flickerEvent: FlickerEvent = {
			model,
			baseFlickerInterval,
			duration,
			state: FlickerState.Pending,
		};
		this.queue.push(flickerEvent);
		this.processQueue();
	}

	private async processQueue() {
		if (this.currentFlicker && this.currentFlicker.state === "Processing") {
			return;
		}

		while (this.queue.size() > 0) {
			const flickerEvent = this.queue.shift()!;
			this.currentFlicker = flickerEvent;
			flickerEvent.state = FlickerState.Processing;
			this.startFlickering(flickerEvent);
			flickerEvent.state = FlickerState.Completed;
			this.currentFlicker = undefined;
		}
	}

	private startFlickering(flickerEvent: FlickerEvent) {
		const { model, baseFlickerInterval, duration } = flickerEvent;
		const endTime = tick() + duration;

		logger.debug("Starting flickering", model.Name, baseFlickerInterval, duration);

		while (tick() < endTime) {
			const flickerInterval =
				baseFlickerInterval + (math.round(math.random(0, 1)) >= 1 ? math.random(0.1, 0.5) : 0) * 0.8;
			this.setModelTransparency(model, math.random());
			task.wait(flickerInterval);
			this.setModelTransparency(model, math.random());
			task.wait(flickerInterval);
		}

		this.setModelTransparency(model, 0);
	}

	private setModelTransparency(model: Model, transparency: number) {
		model.GetDescendants().forEach((descendant) => {
			if (descendant.Name === "HumanoidRootPart") return;
			if (descendant.IsA("BasePart")) {
				descendant.Transparency = transparency;
			} else if (descendant.IsA("Decal") || descendant.IsA("Texture")) {
				descendant.Transparency = transparency;
			}
		});
	}
}
