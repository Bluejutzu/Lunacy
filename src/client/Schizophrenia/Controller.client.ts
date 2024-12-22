import { ReplicatedStorage, Workspace, RunService } from "@rbxts/services";
import { Logger, LogLevel } from "shared/utils/logger";
const Remotes = ReplicatedStorage.WaitForChild("Remotes");
const TriggerFlicker = Remotes.WaitForChild("TriggerFlicker") as RemoteEvent;

const NPC = Workspace.WaitForChild("ExampleMonster") as Model;
const Camera = Workspace.CurrentCamera;

const debounce = 0.5;
let lastTime = tick();

const Players = game.GetService("Players");
const player = Players.LocalPlayer;
const character = player.Character || player.CharacterAdded.Wait()[0];
let canMove = true;

const DebugLogger = new Logger("SchizoController", LogLevel.Debug);

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
					DebugLogger.debug(`Moving NPC to ${behindPosition}`);
					NPC.PivotTo(new CFrame(behindPosition));
				} else {
					warn("HumanoidRootPart not found in the character.");
				}
				canMove = true;
			}
		} else {
			canMove = false;
			TriggerFlicker.FireServer();
		}

		canMove = true
		DebugLogger.debug(`${inScreenBounds} ${canMove}`);
		lastTime = currentTime;
	}
});
