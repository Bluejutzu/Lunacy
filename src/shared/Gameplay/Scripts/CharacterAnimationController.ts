class CharacterAnimationController {
    private enabled: boolean;
    private loadedAnimations: boolean;
    private item: Tool;
    private animationTracks: AnimationTrack[];

    constructor(item: Tool) {
        this.enabled = false;
        this.loadedAnimations = false;
        this.item = item;
        this.animationTracks = [];
    }

    public playShootAnimation() {
        const shootAnimation = this.animationTracks.find(animation => animation.Name === "Shoot");
        shootAnimation?.Play(0);
    }

    public playReloadAnimation(reloadTime: number) {
        const reloadAnimation = this.animationTracks.find(animation => animation.Name === "Reload");
        if (reloadAnimation) {
            const speed = reloadAnimation.Length / reloadTime;
            reloadAnimation.Play(0.1, 1, speed);
        }
    }

    public loadAnimations() {
        if (this.loadedAnimations) {
            return;
        }

        this.loadedAnimations = true;

        const animationsFolder = this.item.WaitForChild("Animations") as Folder;
        const humanoid = this.item.Parent?.FindFirstChildOfClass("Humanoid") as Humanoid;
        assert(humanoid, "Item is not equipped");
        const animator = humanoid.FindFirstChildOfClass("Animator") as Animator;

        const animationTracks: AnimationTrack[] = [];
        for (const animation of animationsFolder.GetChildren()) {
            const animationTrack = animator.LoadAnimation(animation as Animation);
            animationTracks.push(animationTrack);
        }

        this.animationTracks = animationTracks;
    }

    public enable() {
        if (this.enabled) {
            return;
        }
        this.enabled = true;

        if (!this.loadedAnimations) {
            this.loadAnimations();
        }

        const idleAnimation = this.animationTracks.find(animation => animation.Name === "Idle");
        idleAnimation?.Play();
    }

    public disable() {
        if (!this.enabled) {
            return;
        }
        this.enabled = false;

        for (const animation of this.animationTracks) {
            animation.Stop();
        }
    }

    public destroy() {
        this.disable();
        this.animationTracks = [];
    }
}

export { CharacterAnimationController };