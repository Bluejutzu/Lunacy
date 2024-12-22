import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { BehaviourType } from "shared/types";
import { Logger, LogLevel } from "shared/utils/logger";

const NPC = ReplicatedStorage.WaitForChild("Models").WaitForChild("NPC") as Model;
const NPCFolder = Workspace.WaitForChild("NPCs") as Folder;

const logger = new Logger("SchizoNPC", LogLevel.Debug);

export function createNPC(targetPlayer: Player): Model | undefined {
	const char = targetPlayer.Character || targetPlayer.CharacterAdded.Wait()[0];
	if (!char) {
		logger.error(`Character not found for player ${targetPlayer.Name}`);
		return;
	}

	for (const model of NPC.GetChildren()) {
		if (model.IsA("Model")) {
			const currTargetId = model.GetAttribute("TargetPlayer");
			if (currTargetId === targetPlayer.UserId) {
				logger.error(`NPC already exists for player ${targetPlayer.Name}`);
				logger.debug(`Found NPC: ${model.Name}`);
				return;
			}
		} else continue;
	}

	const newNPC = NPC.Clone();
	newNPC.Parent = NPCFolder;
	newNPC.Name = `${targetPlayer.UserId}_NPC`;
	newNPC.SetAttribute("Behaviour", BehaviourType.Idle);
	newNPC.SetAttribute("TargetPlayer", targetPlayer.UserId);
	return newNPC;
}

export function deleteNPC(targetPlayer: Player) {
	const npc = NPCFolder.FindFirstChild(`${targetPlayer.UserId}_NPC`);
	if (npc) {
		npc.Destroy();
		logger.info(`NPC deleted for player ${targetPlayer.Name}`);
	} else {
		logger.error(`NPC not found for player ${targetPlayer.Name}`);
	}
}

export function changeNPCBehaviour(targetPlayer: Player, newBehaviour: BehaviourType) {
	const npc = NPCFolder.FindFirstChild(`${targetPlayer.UserId}_NPC`);
	if (npc) {
		npc.SetAttribute("Behaviour", newBehaviour);
		logger.info(`NPC behaviour changed to ${newBehaviour} for player ${targetPlayer.Name}`);
	} else {
		logger.error(`NPC not found for player ${targetPlayer.Name}`);
	}
}
