import { ReplicatedStorage, RunService, UserInputService as uis, Players, Workspace } from "@rbxts/services";
import { Constants } from "../Constants";
import { Logger, LogLevel } from "../Utility/logger";
import lerp from "../Utility/lerp";
import disconnectAndClear from "shared/Utility/disconnectAndClear";

const logger = new Logger("ViewModelController", LogLevel.Debug);

export class ViewModelController {
	private tool: Tool;
	private player = Players.LocalPlayer;
	private character = this.player.Character || this.player.CharacterAdded.Wait()[0];
	private humanoid = this.character.WaitForChild("Humanoid") as Humanoid | undefined;
	private camera = Workspace.CurrentCamera!;
	private viewModel?: Model;
	private handle?: Part;
	private enabled: boolean = false;
	private equipped = false;
	private animations: AnimationTrack[] = [];
	private toolInstances = new Map<string, Instance>();
	private connections: RBXScriptConnection[] = [];
	private swayConnection: RBXScriptConnection | undefined;
	private stride = 0;
	private bobbing = 0;

	constructor(tool: Tool) {
		this.tool = tool;
		this.camera = Workspace.CurrentCamera as Camera;
		this.initialize();
	}

	private initialize() {
		logger.debug("Initializing ViewModelController for tool:", this.tool.Name);

		const viewModelName = this.tool.GetAttribute(Constants.VIEW_MODEL_ATTRIBUTE) as string;
		const viewModelTemplate = ReplicatedStorage.WaitForChild("ViewModels").WaitForChild(viewModelName) as Model;
		this.viewModel = viewModelTemplate.Clone() as Model;
		this.handle = this.tool.WaitForChild("Handle") as Part;
		// const sounds = this.tool.WaitForChild("Sounds") as Folder;
		const animator = this.viewModel.FindFirstChild("AnimationController")?.FindFirstChild("Animator") as Animator;
		const animationFolder = this.viewModel.FindFirstChild("Animations") as Folder;

		for (const animation of animationFolder.GetChildren()) {
			const animationTrack = animator.LoadAnimation(animation as Animation);
			this.animations.push(animationTrack);
			// bindSoundsToAnimationEvents(animationTrack, sounds, SoundService);
		}

		this.tool.Equipped.Connect(() => this.onEquipped());
		this.tool.Unequipped.Connect(() => this.onUnequipped());
	}

	private update(deltaTime: number) {
		for (const instance of this.toolInstances) {
			(instance[1] as BasePart).Transparency = 1;
		}

		if (this.handle && this.handle.AssemblyLinearVelocity) {
			const moveSpeed = this.handle.AssemblyLinearVelocity.Dot(new Vector3(1, 0, 1));
			const bobbingSpeed = moveSpeed * Constants.VIEW_MODEL_BOBBING_SPEED;
			const bobbing = math.min(bobbingSpeed, 1);

			this.stride = (this.stride + bobbingSpeed * deltaTime) % (math.pi * 2);
			this.bobbing = lerp(
				this.bobbing,
				bobbing,
				math.min(deltaTime * Constants.VIEW_MODEL_BOBBING_TRANSITION_SPEED, 1),
			);

			const x = math.sin(this.stride);
			const y = math.sin(this.stride * 2);
			const bobbingOffset = new Vector3(x, y, 0).mul(Constants.VIEW_MODEL_BOBBING_AMOUNT * this.bobbing);
			const bobbingCFrame = new CFrame(bobbingOffset);

			this.viewModel?.PivotTo(this.camera.CFrame.mul(Constants.VIEW_MODEL_OFFSET).mul(bobbingCFrame));
		}
	}

	private checkForToolInstance(instance: Instance) {
		if (!instance.IsA("BasePart") || instance.IsA("Decal")) return;

		const tool = instance.FindFirstAncestorOfClass("Tool");
		if (!tool) return;

		this.toolInstances.set(tool.Name, instance);
	}

	private hideToolInstances() {
		const char = this.character;

		this.connections.push(
			char.DescendantAdded.Connect((descendant: Instance) => {
				this.checkForToolInstance(descendant);
			}),
		);

		this.connections.push(
			char.DescendantRemoving.Connect((descendant: Instance) => {
				const toolName = descendant.FindFirstAncestorOfClass("Tool")?.Name;
				toolName && this.toolInstances.delete(toolName);
			}),
		);

		for (const descendant of char.GetDescendants()) {
			this.checkForToolInstance(descendant);
		}
	}

	private stopHidingToolInstances() {
		this.toolInstances.clear();
		disconnectAndClear(this.connections);
	}

	private enable() {
		if (this.enabled) return;
		this.enabled = true;
		if (this.viewModel) {
			this.viewModel.Parent = Workspace;
		}
		let mouseSwayCF = new CFrame();
		let walkSwayCF = new CFrame();

		RunService.BindToRenderStep(
			Constants.VIEW_MODEL_BIND_NAME,
			Enum.RenderPriority.Camera.Value + 1,
			(deltaTime: number) => {
				this.update(deltaTime);

				if (this.humanoid && this.humanoid.Health <= 0 && this.camera.FindFirstChild(this.viewModel?.Name!)) {
					this.camera.FindFirstChild(this.viewModel?.Name!)?.Destroy();
				}

				if (this.equipped && this.viewModel) {
					this.viewModel.PivotTo(this.camera.CFrame);

					this.viewModel.GetChildren().forEach((child) => {
						if (child.IsA("BasePart")) {
							child.CanCollide = false;
						}
					});

					const mouseDelta = uis.GetMouseDelta().div(25);
					const swayX = math.clamp(mouseDelta.X, -0.2, 0.2);
					const swayY = math.clamp(mouseDelta.Y, -0.2, 0.2);

					const targetMouseSway = new CFrame(swayX, swayY, 0);
					mouseSwayCF = mouseSwayCF.Lerp(targetMouseSway, math.min(deltaTime * Constants.SWAY_LERP_SPEED, 1));

					if (this.humanoid && this.humanoid.MoveDirection.Magnitude > 0) {
						const moveSpeed = this.humanoid.WalkSpeed;
						const time = tick();
						const walkOffset = new Vector3(
							math.sin(time * moveSpeed * Constants.WALK_SWAY_SPEED) * Constants.WALK_SWAY_AMOUNT,
							math.sin(time * moveSpeed * Constants.WALK_SWAY_SPEED * 2) * Constants.WALK_SWAY_AMOUNT_Y,
							0,
						);
						const targetWalkSway = new CFrame(walkOffset);
						walkSwayCF = walkSwayCF.Lerp(
							targetWalkSway,
							math.min(deltaTime * Constants.WALK_LERP_SPEED, 1),
						);
					} else {
						walkSwayCF = walkSwayCF.Lerp(new CFrame(), math.min(deltaTime * Constants.WALK_LERP_SPEED, 1)); // Reset when not walking
					}
					// mouseSwayCF.mul(walkSwayCF)
					const combinedSway = mouseSwayCF.mul(walkSwayCF);
					this.viewModel.PivotTo(this.camera.CFrame.mul(combinedSway));
				}
			},
		);

		this.hideToolInstances();
	}

	private disable() {
		if (!this.enabled) return;
		this.enabled = false;

		RunService.UnbindFromRenderStep(Constants.VIEW_MODEL_BIND_NAME);
		if (this.viewModel) {
			this.viewModel.Parent = undefined;
		}
		this.stopHidingToolInstances();
		for (const animation of this.animations) {
			animation.Stop(0);
		}
	}

	private destroy() {
		this.cleanup();
		this.viewModel?.Destroy();
	}

	private cleanup() {
		this.swayConnection?.Disconnect();
		this.swayConnection = undefined;
		disconnectAndClear(this.connections);
		this.destroy()
	}

	private onEquipped() {
		this.enable();
		this.equipped = true;
	}

	private onUnequipped() {
		this.equipped = false;
		this.disable();
		this.cleanup();
	}
}
