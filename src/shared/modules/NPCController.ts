import { ReplicatedStorage, Workspace, RunService, Players } from "@rbxts/services";
import { Logger, LogLevel } from "shared/utils/logger";
import { helpers } from "./misc";

const NPC = ReplicatedStorage.WaitForChild("Models").WaitForChild("NPC", 1000) as Model;
const NPCFolder = Workspace.WaitForChild("NPCs") as Folder;
const NPCFolderReplicated = ReplicatedStorage.WaitForChild("NPCs") as Folder;

const debounce = 0.25;

let lastTime = tick();
let canMove = true;
let npcLastPos: Vector3;

const logger = new Logger("SchizoNPC", LogLevel.Debug);

export enum BehaviourType {
	Idle = "IDLE",
	Follow = "FOLLOW",
	Attack = "ATTACK",
}

interface RunServicesType {
	[key: string]: RBXScriptConnection;
}

let RunServices: RunServicesType = {};

export const NPCController = {
	createNPC: (targetPlayer: Player): Model | undefined => {
		const char = targetPlayer.Character || targetPlayer.CharacterAdded.Wait()[0];
		if (!char) {
			logger.error(`Character not found for player ${targetPlayer.Name}`);
			return;
		}

		for (const model of NPCFolder.GetChildren()) {
			logger.debug(`Checking model: ${model.Name}`);
			if (model.IsA("Model")) {
				const currTargetId = model.GetAttribute("TargetPlayer");
				if (currTargetId === targetPlayer.UserId) {
					logger.warn(`NPC already exists for player ${targetPlayer.Name} ${targetPlayer.UserId}`);
					logger.debug(`Found NPC: ${model.Name}`);
					return;
				}
			} else continue;
		}

		const newNPC = NPC.Clone();
		newNPC.Parent = NPCFolderReplicated;
		newNPC.Name = `${targetPlayer.UserId}_NPC`;
		newNPC.SetAttribute("Behaviour", BehaviourType.Follow);
		newNPC.SetAttribute("TargetPlayer", `${targetPlayer.UserId}`);
		return newNPC;
	},
	deleteNPC: (targetPlayer: Player) => {
		const npc = NPCFolder.FindFirstChild(`${targetPlayer.UserId}_NPC`);
		if (npc) {
			npc.Destroy();
			logger.info(`NPC deleted for player ${targetPlayer.Name}`);
		} else {
			logger.error(`NPC not found for player ${targetPlayer.Name}`);
		}
	},
	changeNPCBehaviour: (targetPlayer: Player, newBehaviour: BehaviourType) => {
		const npc = NPCFolder.FindFirstChild(`${targetPlayer.UserId}_NPC`);
		if (npc) {
			npc.SetAttribute("Behaviour", newBehaviour);
			logger.info(`NPC behaviour changed to ${newBehaviour} for player ${targetPlayer.Name}`);
		} else {
			logger.error(`NPC not found for player ${targetPlayer.Name}`);
		}
	},
	initNPC: (character: Model, Camera: Camera): Model | undefined => {
		if (!game.IsLoaded()) {
			game.Loaded.Wait();
		}

		const NPC = NPCController.createNPC(Players.LocalPlayer);
		if (!NPC) {
			logger.error(
				`Failed to initialize NPC for player ${Players.LocalPlayer.Name} ${Players.LocalPlayer.UserId}`,
			);
			return;
		}
		if (RunServices[NPC.Name]) {
			RunServices[NPC.Name].Disconnect();
		}
		RunServices[NPC.Name] = RunService.RenderStepped.Connect(() => {
			const currentTime = tick();
			const npcCurrPos: Vector3 = NPC?.PrimaryPart?.Position!;
			canMove = true;

			if (currentTime - lastTime >= debounce) {
				if (!NPC || !Camera || !character) {
					logger.error("NPC, Camera or Character not found.");
					return;
				}
				const isInScreenBounds = helpers.isInScreenBounds(Camera, npcCurrPos);

				if (!isInScreenBounds) {
					canMove = true
					const humanoidRootPart = character.WaitForChild("HumanoidRootPart") as Part;
					if (humanoidRootPart) {
						if (NPC.GetAttribute("Behaviour") === BehaviourType.Idle) {
							npcLastPos = humanoidRootPart.Position;
							const distance = helpers.getDistance(npcCurrPos, npcLastPos);
							if (distance > 10) {
								const behindPosition = humanoidRootPart.Position.sub(
									humanoidRootPart.CFrame.LookVector.mul(5),
								);
								logger.debug(`Moving NPC to ${behindPosition}, distance: ${distance}`);
								helpers.pivotToPos(NPC, behindPosition);
								canMove = false; // Set canMove to false after moving the NPC
							}
						} else if (NPC.GetAttribute("Behaviour") === BehaviourType.Follow) {
							const targetPlayerId = NPC.GetAttribute("TargetPlayer") as number;
							const targetPlayer = Players.GetPlayerByUserId(targetPlayerId);

							// TODO: This bum ahh code is not working, the NPC just walks off into the horizon searching its none extisting dad
							if (targetPlayer) {
								const distance = helpers.getDistance(npcCurrPos, humanoidRootPart.Position);
								if (distance > 10) {
									const targetPos = humanoidRootPart.Position.Floor()
									logger.debug(`Moving NPC to ${targetPos}, distance: ${distance}`);
									helpers.moveToPosition(NPC, targetPos);
									canMove = true;
								} else if (distance > 15) {
									logger.warn(`Something went horribly wrong ${distance}`,);
								}
							} else {
								logger.error("Target player not found.");
							}
						} else if (NPC.GetAttribute("Behaviour") === BehaviourType.Attack) {
						}
					} else {
						logger.warn("HumanoidRootPart not found in the character.");
					}
				} else if (isInScreenBounds) {
					canMove = false;
				}

				lastTime = currentTime;
			}
		});
		NPC.Parent = NPCFolder;
		NPC.SetAttribute("init", true);
		return NPC;
	},
};
