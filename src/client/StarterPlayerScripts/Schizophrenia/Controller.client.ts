import { Workspace } from "@rbxts/services";
import { NPCController } from "shared/Gameplay/Scripts/NPCController";
import { Logger, LogLevel } from "shared/Utility/logger";

const Remotes = game.GetService("ReplicatedStorage").WaitForChild("Remotes");
const NPCInit = Remotes.WaitForChild("NPCInit") as RemoteEvent;

const Players = game.GetService("Players");
const player = Players.LocalPlayer;

const npcController = new NPCController();

const logger = new Logger("Controller", LogLevel.Debug);

const initizalize = () => {
	const character = player.Character || player.CharacterAdded.Wait()[0];
	const camera = Workspace.CurrentCamera;

	if (!camera) {
		logger.warn("Camera not found in the workspace.");
		return;
	}
	if (!character) {
		logger.warn("Character not found in the workspace.");
		return;
	}
	npcController.initNPC(character, camera);
};

NPCInit.OnClientEvent.Connect(() => {
	initizalize();
});
