import { Players, RunService, UserInputService, Workspace } from "@rbxts/services";
import lerp from "shared/Gameplay/Utility/lerp";

const player = Players.LocalPlayer;
const mouse = player.GetMouse();
const camera = Workspace.CurrentCamera!;
const humanoid = player.Character?.WaitForChild("Humanoid") as Humanoid;
let bobbing: RBXScriptConnection | undefined;
let func1 = 0;
let func2 = 0;
let func3 = 0;
let func4 = 0;
let val = 0;
let val2 = 0;
let int = 5;
let int2 = 5;
let vect3 = new Vector3();

UserInputService.MouseIconEnabled = false;

bobbing = RunService.RenderStepped.Connect((deltaTime) => {
    deltaTime *= 30;
    if (humanoid.Health <= 0) {
        bobbing?.Disconnect();
        return;
    }

    const rootPart = humanoid.RootPart;
    const rootMagnitude = rootPart ? new Vector3(rootPart.AssemblyLinearVelocity.X, 0, rootPart.AssemblyLinearVelocity.Z).Magnitude : 0;
    const calcRootMagnitude = math.min(rootMagnitude, 25);

    if (deltaTime > 1.5) {
        func1 = 0;
        func2 = 0;
    } else {
        func1 = lerp(func1, math.cos(tick() * 0.5 * math.random(7.5, 10)) * (math.random(6, 10) / 100) * deltaTime, 0.05 * deltaTime);
        func2 = lerp(func2, math.cos(tick() * 0.5 * math.random(5, 9)) * (math.random(1, 5) / 100) * deltaTime, 0.05 * deltaTime);
    }

    camera.CFrame = camera.CFrame
        .mul(CFrame.fromEulerAnglesXYZ(0, 0, math.rad(func3)))
        .mul(CFrame.fromEulerAnglesXYZ(math.rad(func4 * deltaTime), math.rad(val * deltaTime), val2))
        .mul(CFrame.Angles(0, 0, math.rad(func4 * deltaTime * (calcRootMagnitude / 5))))
        .mul(CFrame.fromEulerAnglesXYZ(math.rad(func1), math.rad(func2), math.rad(func2 * 10)));

    val2 = math.clamp(
        lerp(
            val2,
            rootPart ? -camera.CFrame.VectorToObjectSpace(rootPart.AssemblyLinearVelocity.div(math.max(humanoid.WalkSpeed, 0.01))).X * 0.04 : 0,
            0.1 * deltaTime,
        ),
        -0.12,
        0.1,
    );

    func3 = lerp(func3, math.clamp(UserInputService.GetMouseDelta().X, -2.5, 2.5), 0.25 * deltaTime);
    func4 = lerp(func4, math.sin(tick() * int) / 5 * math.min(1, int2 / 10), 0.25 * deltaTime);

    if (rootMagnitude > 1) {
        val = lerp(val, math.cos(tick() * 0.5 * math.floor(int)) * (int / 200), 0.25 * deltaTime);
    } else {
        val = lerp(val, 0, 0.05 * deltaTime);
    }

    if (rootMagnitude > 6) {
        int = 10;
        int2 = 9;
    } else if (rootMagnitude > 0.1) {
        int = 6;
        int2 = 7;
    } else {
        int2 = 0;
    }

    player.CameraMaxZoomDistance = 128;
    player.CameraMinZoomDistance = 0.5;
    vect3 = vect3.Lerp(camera.CFrame.LookVector, 0.125 * deltaTime);
});