import { Players, ReplicatedStorage } from "@rbxts/services";
import { Logger, LogLevel } from "shared/utils/logger";

const Remotes = ReplicatedStorage.WaitForChild("Remotes");
const TriggerDistortion = Remotes.WaitForChild("TriggerDistortion") as RemoteEvent;
const TriggerFlicker = Remotes.WaitForChild("TriggerDistortion") as RemoteEvent;
const Jumpscare = Remotes.WaitForChild("Jumpscare") as RemoteEvent;
const NPCInit = Remotes.WaitForChild("NPCInit") as RemoteEvent;

const logger = new Logger("EventHandler", LogLevel.Debug);

TriggerDistortion.OnServerEvent.Connect((player) => {
	if (Players.FindFirstChild(player.Name)) {
		logger.info(`${player.Name} triggered a distortion event.`);
		TriggerDistortion.FireClient(player);
	} else {
		logger.error(`Invalid player: ${player.Name}`);
	}
});

TriggerFlicker.OnServerEvent.Connect((player) => {
	if (Players.FindFirstChild(player.Name)) {
		logger.info(`${player.Name} triggered a flickering event.`);
		TriggerFlicker.FireClient(player);
	} else {
		logger.error(`Invalid player: ${player.Name}`);
	}
});

Jumpscare.OnServerEvent.Connect((player) => {
	logger.info(`[SERVER] ${player.Name} triggered a jumpscare event.`);
	Jumpscare.FireClient(player);
});

Players.PlayerAdded.Connect((player) => {
	logger.info(`Player ${player.Name} has joined the game.`);
	logger.info(`Game loaded for player ${player.Name}.`);
	NPCInit.FireClient(player);
});
