import { RunService, Players, Workspace, ReplicatedFirst, ReplicatedStorage } from "@rbxts/services";
import { Logger, LogLevel } from "../../Utility/logger";
import disconnectAndClear from "shared/Utility/disconnectAndClear";

const logger = new Logger("ToolController", LogLevel.Debug);

export class ToolController {
	private tool: Tool;
	private player = Players.LocalPlayer;
	private character = this.player.Character || this.player.CharacterAdded.Wait()[0];
	private handle?: Part;
	private connections: RBXScriptConnection[] = [];
	private weld?: WeldConstraint;
	private bindConnection?: void;

	constructor(tool: Tool) {
		this.tool = tool;
		this.initialize();
	}

	private initialize() {
		logger.debug("Initializing ToolController for tool:", this.tool.Name);
		this.handle = this.tool.WaitForChild("Handle") as Part;

		this.tool.Equipped.Connect(() => this.onEquipped());
		this.tool.Unequipped.Connect(() => this.onUnequipped());
	}

	private onEquipped() {
		this.attachToolToParent();
	}

	private onUnequipped() {
		this.cleanup();
	}

	private attachToolToParent() {
        // const model = ReplicatedStorage.WaitForChild("Models").WaitForChild("WhiteKey").Clone() as Model;
		// const parentName = this.tool.GetAttribute("ParentTo") as string;
		// const parent = this.character.FindFirstChild(parentName) as BasePart;
		// model.Parent = parent;

		// if (this.handle && parent) {
		// 	this.weld = new Instance("WeldConstraint");
		// 	this.weld.Part0 = this.handle;
		// 	this.weld.Part1 = parent;
		// 	this.weld.Parent = this.handle;
		// }

		// RunService.BindToRenderStep("AttachToolToParent", Enum.RenderPriority.Camera.Value + 1, () => {
		// 	if (this.handle) {
		// 		this.handle.CFrame = parent.CFrame;
		// 	}
		// });
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
