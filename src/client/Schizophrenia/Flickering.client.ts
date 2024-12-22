import { Workspace } from "@rbxts/services";

const ReplicatedStorage = game.GetService("ReplicatedStorage");
const UserInputService = game.GetService("UserInputService");
const TriggerFlicker = ReplicatedStorage.WaitForChild("Remotes").WaitForChild("TriggerFlicker") as RemoteEvent;

const humanoidModel = Workspace.FindFirstChild("ExampleMonster") as Model;
const flickerDuration = 5;
const baseFlickerInterval = 0.1;

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
	if (gameProcessed) return;
	if (input.KeyCode !== Enum.KeyCode.G) return;
	FlickerEvent();
});
