import { ReplicatedStorage, RunService, UserInputService as uis, Players, Workspace } from "@rbxts/services";
import { Constants } from "../Constants";
import { Logger, LogLevel } from "../Utils/logger";

const logger = new Logger("ViewModelController", LogLevel.Debug);

/**
 * The `ViewModelController` class is responsible for managing the view model of a tool 
 * It handles the initialization, equipping, unequipping, and rendering of the view model.
 */
class ViewModelController {
    /**
     * The tool associated with this view model controller.
     */
    private tool: Tool;

    /**
     * The local player.
     */
    private player = Players.LocalPlayer;

    /**
     * The character of the local player.
     */
    private character = this.player.Character || this.player.CharacterAdded.Wait()[0];

    /**
     * The humanoid of the local player's character.
     */
    private humanoid = this.character.WaitForChild("Humanoid") as Humanoid;

    /**
     * The current camera in the workspace.
     */
    private camera = Workspace.CurrentCamera!;

    /**
     * The view model associated with the tool.
     */
    private viewModel?: Model;

    /**
     * Indicates whether the tool is equipped.
     */
    private equipped = false;

    /**
     * The CFrame used for sway effect.
     */
    private swayCF = new CFrame();

    /**
     * Constructs a new `ViewModelController` instance.
     * @param tool - The tool to be managed by this controller.
     */
    constructor(tool: Tool) {
        this.tool = tool;
        this.init();
    }

    /**
     * Initializes the view model controller by setting up event connections and loading the view model.
     */
    private init() {
        logger.debug("Initializing ViewModelController for tool: ", this.tool.Name);
        const viewModelName = this.tool.GetAttribute(Constants.VIEWMODEL_ATTRIBUTE) as string;
        const viewModelTemplate = ReplicatedStorage.WaitForChild("ViewModels").WaitForChild(viewModelName)
        this.viewModel = viewModelTemplate.Clone().Parent = Workspace as Model;

        const sounds = this.tool.WaitForChild("Sounds") as Folder;

        const animator = this.viewModel.FindFirstChild("AnimationController")?.FindFirstChild("Animator") as Animator;
        const animationFolder = this.viewModel.FindFirstChild("Animations") as Folder;

        const animations: { [key: string]: AnimationTrack } = {}
        for (const animation of animationFolder.GetChildren()) {
            const animationTrack = animator.LoadAnimation(animation as Animation);
            animations[animation.Name] = animationTrack;
        }

        

        this.tool.Equipped.Connect(() => this.onEquipped());
        this.tool.Unequipped.Connect(() => this.onUnequipped());
        RunService.RenderStepped.Connect(() => this.onRenderStepped());
    }

    /**
     * Handles the tool being equipped by the player.
     */
    private onEquipped() {
        this.equipped = true;
        if (this.viewModel) {
            this.viewModel.Parent = this.camera;
        } else {
            logger.error(`ViewModel attribute not found on tool: ${this.tool.Name}`);
        }
    }

    /**
     * Handles the tool being unequipped by the player.
     */
    private onUnequipped() {
        this.equipped = false;
        if (this.viewModel) {
            this.viewModel.Destroy();
            this.viewModel = undefined;
        }
    }

    /**
     * Handles the rendering step to update the view model's position and apply sway effects.
     */
    private onRenderStepped() {
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
            this.swayCF = this.swayCF.Lerp(new CFrame(swayX, swayY, 0), 0.3);
            this.viewModel.PivotTo(this.camera.CFrame.mul(this.swayCF));
        }
    }
}

export { ViewModelController };