import { Players, ReplicatedStorage } from "@rbxts/services";
import { LogLevel } from "shared/types";
import { Logger } from "shared/utils/logger";

const Remotes = ReplicatedStorage.WaitForChild("Remotes");
const TriggerDistortion = Remotes.WaitForChild("TriggerDistortion") as RemoteEvent;
const TriggerFlicker = Remotes.WaitForChild("TriggerDistortion") as RemoteEvent;

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
