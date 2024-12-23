import { RunService, Workspace } from "@rbxts/services";
import { Logger, LogLevel } from "shared/utils/logger";

const ReplicatedStorage = game.GetService("ReplicatedStorage");
const UserInputService = game.GetService("UserInputService");
const TriggerFlicker = ReplicatedStorage.WaitForChild("Remotes").WaitForChild("TriggerFlicker") as RemoteEvent;
const Jumpscare = ReplicatedStorage.WaitForChild("Remotes").WaitForChild("Jumpscare") as RemoteEvent;

const humanoidModel = Workspace.FindFirstChild("ExampleMonster") as Model;
const flickerDuration = 5;
const baseFlickerInterval = 0.1;

const logger = new Logger("Flickering", LogLevel.Debug);

const setModelTransparency = (model: Model, transparency: number) => {
	model.GetDescendants().forEach((descendant) => {
		if (descendant.Name === "HumanoidRootPart") return;
		if (descendant.IsA("BasePart")) {
			descendant.Transparency = transparency;
		} else if (descendant.IsA("Decal") || descendant.IsA("Texture")) {
			descendant.Transparency = transparency;
		}
	});
};

const FlickerEvent = () => {
	if (!humanoidModel) {
		warn("Humanoid model not found in the workspace.");
		return;
	}

	task.spawn(() => {
		const endTime = tick() + flickerDuration;
		while (tick() < endTime) {
			const flickerInterval = baseFlickerInterval + math.random() * 0.8 + 0.1;
			setModelTransparency(humanoidModel, 1);
			task.wait(flickerInterval);
			setModelTransparency(humanoidModel, 0);
			task.wait(flickerInterval);
		}

		setModelTransparency(humanoidModel, 0);
	});
};

TriggerFlicker.OnClientEvent.Connect((position: Vector3, inScreenBounds: Boolean) => {
	FlickerEvent();
});

UserInputService.InputBegan.Connect((input, gameProcessed) => {
	if (!RunService.IsStudio()) return;
	if (gameProcessed) return;
	if (input.KeyCode !== Enum.KeyCode.G) return;
	FlickerEvent();
});

Jumpscare.OnClientEvent.Connect(() => {
	logger.info("[CLIENT] Jumpscare event triggered.");
});
