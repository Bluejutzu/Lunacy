import { Players, ReplicatedStorage, UserInputService } from "@rbxts/services";
import { RBXScriptArray } from "shared/modules/NPCController";
import { Logger, LogLevel } from "shared/utils/logger";

const plr = Players.LocalPlayer;

const Remotes = ReplicatedStorage.WaitForChild("Remotes") as Folder;
const PlayerInit = Remotes.WaitForChild("PlayerInit") as RemoteEvent;

const logger = new Logger("PlayerController", LogLevel.Info);

let WindowFocused: RBXScriptArray = {};
let WindowUnfocused: RBXScriptArray = {};

PlayerInit.OnClientEvent.Connect((OverheadGUI: BillboardGui) => {
    if (!plr) {
        logger.warn(`${plr} is not a valid player.`);
        return;
    }
	if (WindowFocused[`${plr.UserId}_WindowFocused`]) {
		WindowFocused[`${plr.UserId}_WindowFocused`].Disconnect();
	}
	if (WindowUnfocused[`${plr.UserId}_WindowUnfocused`]) {
		WindowUnfocused[`${plr.UserId}_WindowUnfocused`].Disconnect();
	}
	WindowFocused[`${plr.UserId}_WindowFocused`] = UserInputService.WindowFocused.Connect(() => {
        OverheadGUI.Enabled = false;
    });
	WindowUnfocused[`${plr.UserId}_WindowUnfocused`] = UserInputService.WindowFocusReleased.Connect(() => {
        OverheadGUI.Enabled = true;
    });
    logger.info(`[CLIENT] Player ${plr.Name} initialized.`);
});
