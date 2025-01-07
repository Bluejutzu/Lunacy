import { RunService, UserInputService, ReplicatedStorage, Workspace } from "@rbxts/services";
import { FlickerController } from "shared/Gameplay/Scripts/Flicker";
import { Logger, LogLevel } from "shared/Utility/logger";

const logger = new Logger("FlickerController", LogLevel.Debug);
const TriggerFlicker = ReplicatedStorage.Remotes.WaitForChild("TriggerFlicker") as RemoteEvent;

const model = Workspace.WaitForChild("HumanoidModel") as Model;
const flickerController = new FlickerController();
const baseFlickerInterval = 0.01

TriggerFlicker.OnClientEvent.Connect((position: Vector3, inScreenBounds: boolean) => {
	if (model) {
		flickerController.addFlickerEvent(model, baseFlickerInterval, 5);
	} else {
		logger.error("HumanoidModel not found in Workspace.");
	}
});

UserInputService.InputBegan.Connect((input, gameProcessed) => {
	if (!RunService.IsStudio()) return;
	if (gameProcessed) return;
	if (input.KeyCode !== Enum.KeyCode.G) return;

	if (model) {
		flickerController.addFlickerEvent(model, baseFlickerInterval, 5);
	} else {
		logger.error("HumanoidModel not found in Workspace");
	}
});
