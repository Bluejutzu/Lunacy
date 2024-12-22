import { ReplicatedStorage, Workspace, RunService } from "@rbxts/services";
import { createNPC } from "shared/modules/SchizoNPC";
import { Logger, LogLevel } from "shared/utils/logger";
const Players = game.GetService("Players");
const Remotes = ReplicatedStorage.WaitForChild("Remotes");
const TriggerFlicker = Remotes.WaitForChild("TriggerFlicker") as RemoteEvent;

const NPC = createNPC(Players.LocalPlayer);
const Camera = Workspace.CurrentCamera;

let lastTime = tick();
let canMove = true;

const debounce = 0.5;
const player = Players.LocalPlayer;
const character = player.Character || player.CharacterAdded.Wait()[0];

const logger = new Logger("SchizoController", LogLevel.Debug);

RunService.RenderStepped.Connect(() => {
	const currentTime = tick();

	if (currentTime - lastTime >= debounce) {
		if (!NPC || !Camera || !character) return;
		const result = Camera?.WorldToScreenPoint(NPC.PrimaryPart?.Position!);
		// const ScreenBounds = result[0];  X & Y top left of screen in pixels. Z depth of NPC.Position from the screen in studs
		const inScreenBounds = result[1]; // bool

		if (!inScreenBounds) {
			if (canMove) {
				canMove = false;
				const humanoidRootPart = character.FindFirstChild("HumanoidRootPart") as Part;
				if (humanoidRootPart) {
					const behindPosition = humanoidRootPart.Position.sub(humanoidRootPart.CFrame.LookVector.mul(5));
					logger.debug(`Moving NPC to ${behindPosition}`);
					NPC.PivotTo(new CFrame(behindPosition));
				} else {
					logger.warn("HumanoidRootPart not found in the character.");
				}
				canMove = true;
			}
		} else {
			canMove = false;
			TriggerFlicker.FireServer();
		}

		canMove = true;
		logger.debug(`${inScreenBounds} ${canMove}`);
		lastTime = currentTime;
	}
});
