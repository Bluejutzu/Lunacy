import { Players, ReplicatedStorage } from "@rbxts/services";
import { Logger, LogLevel } from "shared/Utility/logger";

const plr = Players.LocalPlayer;

const Remotes = ReplicatedStorage.WaitForChild("Remotes") as Folder;
const PlayerInit = Remotes.WaitForChild("PlayerInit") as RemoteEvent;

const logger = new Logger("PlayerController", LogLevel.Info);

PlayerInit.OnClientEvent.Connect(() => {
	if (!plr) {
		logger.warn(`${plr} is not a valid player.`);
		return;
	}
	plr.CameraMode = Enum.CameraMode.Classic;
	logger.info(`[CLIENT] Player ${plr.Name} initialized.`);
});
