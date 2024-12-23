import { ReplicatedStorage } from "@rbxts/services";
import { Logger, LogLevel } from "shared/utils/logger";

const Remotes = ReplicatedStorage.WaitForChild("Remotes") as Folder;
const PlayerInit = Remotes.WaitForChild("PlayerInit") as RemoteEvent;

const GUIs = ReplicatedStorage.WaitForChild("GUIs") as Folder;
const OverheadGUI = GUIs.WaitForChild("OverheadGUI") as BillboardGui;

const logger = new Logger("PlayerController", LogLevel.Info);

export const PlayerController = {
	initPlayer: (player: Player) => {
		const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
		const overheadGUI = OverheadGUI.Clone();
		overheadGUI.Parent = playerGui;
		PlayerInit.FireClient(player, overheadGUI);

		logger.info(`[SERVER] Player ${player.Name} initialized.`);
	},
};
