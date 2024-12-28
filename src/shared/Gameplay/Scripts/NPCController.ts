import { ReplicatedStorage, Workspace, RunService, Players } from "@rbxts/services";
import { Logger, LogLevel } from "shared/Gameplay/Utility/logger";
import { helpers } from "../Utility/helpers";

const NPC = ReplicatedStorage.WaitForChild("Models").WaitForChild("NPC", 1000) as Model;
const NPCFolder = Workspace.WaitForChild("NPCs") as Folder;
const NPCFolderReplicated = ReplicatedStorage.WaitForChild("NPCs") as Folder;

const debounce = 0.25;

let lastTime = tick();
let canMove = true;
let npcLastPos: Vector3;
let canPlay: boolean = true;

const logger = new Logger("SchizoNPC", LogLevel.Debug);

const anim = new Instance("Animation");
anim.AnimationId = "rbxassetid://77288203553699";
anim.Name = "NPC_Punch_Simple";

export enum BehaviourType {
	Idle = "IDLE",
	Follow = "FOLLOW",
	Attack = "ATTACK",
}

export interface RBXScriptArray {
	[key: string]: RBXScriptConnection;
}

export class NPCController {
	private RunServices: RBXScriptArray = {};

	private moveNPC(NPC: Model, character: Model, Camera: Camera): void {
		const npcCurrPos = NPC.PrimaryPart?.Position!;
		const isInScreenBounds = helpers.isInScreenBounds(Camera, npcCurrPos);

		if (!isInScreenBounds) {
			canMove = true;
			const humanoidRootPart = character.WaitForChild("HumanoidRootPart") as Part;
			const humanoid = character.WaitForChild("Humanoid") as Humanoid;

			if (humanoidRootPart) {
				this.handleNPCBehaviour(NPC, humanoidRootPart, humanoid);
			} else {
				logger.warn("HumanoidRootPart not found in the character.");
			}
		} else {
			canMove = false;
		}
	}

	private handleNPCBehaviour(NPC: Model, humanoidRootPart: Part, humanoid: Humanoid): void {
		const npcCurrPos = NPC.PrimaryPart?.Position!;
		const behaviour = NPC.GetAttribute("Behaviour") as BehaviourType;

		switch (behaviour) {
			case BehaviourType.Idle:
				this.handleIdleBehaviour(NPC, humanoidRootPart, npcCurrPos);
				break;
			case BehaviourType.Follow:
				this.handleFollowBehaviour(NPC, humanoidRootPart, npcCurrPos);
				break;
			case BehaviourType.Attack:
				this.handleAttackBehaviour(NPC, humanoidRootPart, humanoid, npcCurrPos);
				break;
		}
	}

	private handleIdleBehaviour(NPC: Model, humanoidRootPart: Part, npcCurrPos: Vector3): void {
		npcLastPos = humanoidRootPart.Position;
		const distance = helpers.getDistance(npcCurrPos, npcLastPos);
		if (distance > 25) {
			const behindPosition = humanoidRootPart.Position.sub(humanoidRootPart.CFrame.LookVector.mul(5));
			logger.debug(`Moving NPC to ${behindPosition}, distance: ${distance}`);
			helpers.pivotToPos(NPC, behindPosition);
			canMove = false;
		}
	}

	private handleFollowBehaviour(NPC: Model, humanoidRootPart: Part, npcCurrPos: Vector3): void {
		const targetPlayerId = NPC.GetAttribute("TargetPlayer") as number;
		const targetPlayer = Players.GetPlayerByUserId(targetPlayerId);

		if (targetPlayer) {
			const distance = helpers.getDistance(npcCurrPos, humanoidRootPart.Position);
			if (distance > 10) {
				const lookVector = humanoidRootPart.CFrame.LookVector;
				const offset = lookVector.mul(5);
				const targetPos = humanoidRootPart.Position.sub(offset);

				helpers.moveToPosition(NPC, new Vector3(targetPos.X, humanoidRootPart.Position.Y, targetPos.Z));
				canMove = true;
			} else if (distance > 15) {
				logger.warn(`Something went horribly wrong ${distance}`);
			}
		} else {
			logger.error("Target player not found.");
		}
	}

	private handleAttackBehaviour(NPC: Model, humanoidRootPart: Part, humanoid: Humanoid, npcCurrPos: Vector3): void {
		const distance = helpers.getDistance(npcCurrPos, humanoidRootPart.Position);
		const Animator = NPC.WaitForChild("Humanoid").WaitForChild("Animator") as Animator;
		if (!humanoid || !Animator) {
			logger.error(`Humanoid or Animator not found, ${humanoid}, ${Animator}`);
			return;
		}
		const animTrack = Animator.LoadAnimation(anim);
		if (distance < 5 && canPlay) {
			canPlay = false;
			animTrack.Play();
			humanoid.TakeDamage(10);
			animTrack.Stopped.Connect(() => {
				wait(0.5);
				canPlay = true;
			});
		}
	}

	public createNPC(targetPlayer: Player): Model | undefined {
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
		newNPC.SetAttribute("Behaviour", BehaviourType.Attack);
		newNPC.SetAttribute("TargetPlayer", `${targetPlayer.UserId}`);
		return newNPC;
	}

	public deleteNPC(targetPlayer: Player): void {
		const npc = NPCFolder.FindFirstChild(`${targetPlayer.UserId}_NPC`);
		if (npc) {
			npc.Destroy();
			logger.info(`NPC deleted for player ${targetPlayer.Name}`);
		} else {
			logger.error(`NPC not found for player ${targetPlayer.Name}`);
		}
	}

	public changeNPCBehaviour(targetPlayer: Player, newBehaviour: BehaviourType): void {
		const npc = NPCFolder.FindFirstChild(`${targetPlayer.UserId}_NPC`);
		if (npc) {
			npc.SetAttribute("Behaviour", newBehaviour);
			logger.info(`NPC behaviour changed to ${newBehaviour} for player ${targetPlayer.Name}`);
		} else {
			logger.error(`NPC not found for player ${targetPlayer.Name}`);
		}
	}

	public initNPC(character: Model, Camera: Camera): Model | undefined {
		if (!game.IsLoaded()) {
			game.Loaded.Wait();
		}
		const NPC = this.createNPC(Players.LocalPlayer);
		if (!NPC) {
			logger.error(
				`Failed to initialize NPC for player ${Players.LocalPlayer.Name} ${Players.LocalPlayer.UserId}`,
			);
			return;
		}

		if (this.RunServices[NPC.Name]) {
			logger.debug(this.RunServices);
			this.RunServices[NPC.Name].Disconnect();
		}
		this.RunServices[NPC.Name] = RunService.RenderStepped.Connect(() => {
			const currentTime = tick();
			if (currentTime - lastTime >= debounce) {
				if (!NPC || !Camera || !character) {
					logger.error("NPC, Camera or Character not found.");
					return;
				}
				this.moveNPC(NPC, character, Camera);
				lastTime = currentTime;
			}
		});
		NPC.Parent = NPCFolder;
		NPC.SetAttribute("init", true);
		return NPC;
	}
}

