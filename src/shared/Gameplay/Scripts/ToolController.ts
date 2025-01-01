import { Players, UserInputService as uis } from "@rbxts/services";
import { Logger, LogLevel } from "../../Utility/logger";
import disconnectAndClear from "shared/Utility/disconnectAndClear";

const logger = new Logger("ToolController", LogLevel.Debug);
const player = Players.LocalPlayer;

export class ToolController {
	private tool: Tool;
	private connections: RBXScriptConnection[] = [];
	private weld?: WeldConstraint;
	private character: Model | undefined = player.Character || player.CharacterAdded.Wait()[0];
	private animations: { [key: string]: AnimationTrack } = {};

	constructor(tool: Tool) {
		this.tool = tool;
		this.initialize();
	}

	private initialize() {
		logger.debug("Initializing ToolController for tool:", this.tool.Name);

		const animator = this.character?.WaitForChild("Humanoid")?.WaitForChild("Animator") as Animator;
		const animationFolder = this.tool.FindFirstChild("Animations") as Folder;

		for (const animation of animationFolder.GetChildren()) {
			const animationTrack = animator.LoadAnimation(animation as Animation);
			this.animations[animation.Name] = animationTrack;
		}
		this.tool.Equipped.Connect(() => this.onEquipped());
		this.tool.Unequipped.Connect(() => this.onUnequipped());
	}

	private onEquipped() {
		this.animations[`${this.tool.Name}_Pickup`].Play();
	}

	private onUnequipped() {
		this.cleanup();
	}

	private cleanup() {
		disconnectAndClear(this.connections);
		if (this.weld) {
			this.weld.Destroy();
			this.weld = undefined;
		}
	}

	public destroy() {
		this.cleanup();
		this.tool.Destroy();
	}
}
