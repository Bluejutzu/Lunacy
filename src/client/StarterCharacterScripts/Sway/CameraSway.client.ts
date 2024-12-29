import { RunService, UserInputService, Players, Workspace } from "@rbxts/services";

const localPlayer = Players.LocalPlayer;
const camera = Workspace.CurrentCamera!;
let turn = 0;

const lerp = (a: number, b: number, t: number): number => {
    return a + (b - a) * t;
};

RunService.BindToRenderStep("CameraSway", Enum.RenderPriority.Camera.Value + 1, (deltaTime) => {
    const mouseDelta = UserInputService.GetMouseDelta();

    turn = lerp(turn, math.clamp(mouseDelta.X, -7.5, 7.5), 7 * deltaTime);

    camera.CFrame = camera.CFrame.mul(CFrame.Angles(0, 0, math.rad(turn)));
});