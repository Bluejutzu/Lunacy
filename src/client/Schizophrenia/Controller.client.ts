import { ReplicatedStorage, Workspace, RunService } from "@rbxts/services";
import { createNPC } from "shared/modules/SchizoNPC";
import { Logger, LogLevel } from "shared/utils/logger";
const Players = game.GetService("Players");
const Remotes = ReplicatedStorage.WaitForChild("Remotes");
const TriggerFlicker = Remotes.WaitForChild("TriggerFlicker") as RemoteEvent;
const player = Players.LocalPlayer;

const NPC = createNPC(player);
const Camera = Workspace.CurrentCamera;

const character = player.Character || player.CharacterAdded.Wait()[0];

const logger = new Logger("SchizoController", LogLevel.Debug);

const debounce = 0.5;
const npcLastSeenDebounce = 2;

let lastTime = tick();
let canMove = true;
let npcLastSeenTime = 0;
let npcLastPos: Vector3;

RunService.RenderStepped.Connect(() => {
	const currentTime = tick();
	const npcCurrPos: Vector3 = NPC?.PrimaryPart?.Position!;

	if (currentTime - lastTime >= debounce) {
		if (!NPC || !Camera || !character) return;
		const result = Camera?.WorldToScreenPoint(NPC.PrimaryPart?.Position!);
		const inScreenBounds = result[1];

		if (!inScreenBounds) {
			canMove = true;
			if (canMove) {
				canMove = false;
				const humanoidRootPart = character.FindFirstChild("HumanoidRootPart") as Part;
				if (humanoidRootPart) {
					npcLastPos = humanoidRootPart.Position;
					const distance = npcCurrPos.sub(npcLastPos).Magnitude;
					if (distance > 10) {
						const behindPosition = humanoidRootPart.Position.sub(humanoidRootPart.CFrame.LookVector.mul(5));
						// logger.debug(`Moving NPC to ${behindPosition}, distance: ${distance}`);
						NPC.PivotTo(new CFrame(behindPosition));
					} else {
						// logger.debug(`NPC is close enough to the player.`);
					}
				} else {
					logger.warn("HumanoidRootPart not found in the character.");
				}
				canMove = true;
			}
		} else {
			canMove = false;
			task.spawn(() => {
				if (currentTime - npcLastSeenTime >= npcLastSeenDebounce) {
					// logger.info("NPC not seen for a while.");
					npcLastSeenTime = currentTime;
				}
			});
			TriggerFlicker.FireServer();
			logger.info(`Triggered Flicker from ${player.Name}`);
		}

		// logger.debug(`${inScreenBounds} ${canMove}`);
		npcLastPos = npcCurrPos;
		lastTime = currentTime;
	}
});
