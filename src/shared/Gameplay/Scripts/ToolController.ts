import { Players, UserInputService as uis } from "@rbxts/services";
import { Logger, LogLevel } from "../../Utility/logger";

const logger = new Logger("ToolController", LogLevel.Info);
const player = Players.LocalPlayer;

export class ToolController {
	private tool: Tool;
	private character: Model | undefined = player.Character || player.CharacterAdded.Wait()[0];
	private animations: { [key: string]: AnimationTrack } = {};
	private currPlaying: AnimationTrack | undefined;

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
	}

	private onEquipped() {
		this.playAnim(`${this.tool.Name}_Pickup`);
	}

	public playAnim(name: string) {
		if (this.animations[name]) {
			this.animations[name].Play();

			this.currPlaying = this.animations[name];
			this.animations[name].Ended.Connect(() => (this.currPlaying = undefined));
		} else {
			logger.warn(`Animation not found: ${name}`);
		}
	}

	public stopAnim() {
		this.currPlaying?.Stop();
	}

	public destroy() {
		this.tool.Destroy();
	}
}
