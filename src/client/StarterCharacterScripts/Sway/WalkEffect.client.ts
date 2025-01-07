import { Players, RunService, UserInputService, Workspace } from "@rbxts/services";
import lerp from "shared/Gameplay/Utility/lerp";

const player = Players.LocalPlayer;
const camera = Workspace.CurrentCamera!;
const humanoid = player.Character?.WaitForChild("Humanoid") as Humanoid;
let bobbingConnection: RBXScriptConnection | undefined;
let swayX = 0;
let swayY = 0;
let mouseSwayX = 0;
let mouseSwayY = 0;
let velocitySwayX = 0;
let velocitySwayY = 0;
let walkSpeedFactor = 5;
let walkSpeedFactor2 = 5;
let lookVector = new Vector3();

bobbingConnection = RunService.RenderStepped.Connect((deltaTime) => {
    deltaTime *= 30;

    if (humanoid.Health <= 0) {
        bobbingConnection?.Disconnect();
        return;
    }

    const rootPart = humanoid.RootPart;
    const rootVelocity = rootPart ? new Vector3(rootPart.AssemblyLinearVelocity.X, 0, rootPart.AssemblyLinearVelocity.Z).Magnitude : 0;
    const clampedRootVelocity = math.min(rootVelocity, 25);

    if (deltaTime > 1.5) {
        swayX = 0;
        swayY = 0;
    } else {
        swayX = lerp(swayX, math.cos(tick() * 0.5 * math.random(7.5, 10)) * (math.random(6, 10) / 100) * deltaTime, 0.05 * deltaTime);
        swayY = lerp(swayY, math.cos(tick() * 0.5 * math.random(5, 9)) * (math.random(1, 5) / 100) * deltaTime, 0.05 * deltaTime);
    }

    camera.CFrame = camera.CFrame
        .mul(CFrame.fromEulerAnglesXYZ(0, 0, math.rad(mouseSwayX)))
        .mul(CFrame.fromEulerAnglesXYZ(math.rad(mouseSwayY * deltaTime), math.rad(velocitySwayX * deltaTime), velocitySwayY))
        .mul(CFrame.Angles(0, 0, math.rad(mouseSwayY * deltaTime * (clampedRootVelocity / 5))))
        .mul(CFrame.fromEulerAnglesXYZ(math.rad(swayX), math.rad(swayY), math.rad(swayY * 10)));

    velocitySwayY = math.clamp(
        lerp(
            velocitySwayY,
            rootPart ? -camera.CFrame.VectorToObjectSpace(rootPart.AssemblyLinearVelocity.div(math.max(humanoid.WalkSpeed, 0.01))).X * 0.04 : 0,
            0.1 * deltaTime,
        ),
        -0.12,
        0.1,
    );

    mouseSwayX = lerp(mouseSwayX, math.clamp(UserInputService.GetMouseDelta().X, -2.5, 2.5), 0.25 * deltaTime);
    mouseSwayY = lerp(mouseSwayY, math.sin(tick() * walkSpeedFactor) / 5 * math.min(1, walkSpeedFactor2 / 10), 0.25 * deltaTime);

    if (rootVelocity > 1) {
        velocitySwayX = lerp(velocitySwayX, math.cos(tick() * 0.5 * math.floor(walkSpeedFactor)) * (walkSpeedFactor / 200), 0.25 * deltaTime);
    } else {
        velocitySwayX = lerp(velocitySwayX, 0, 0.05 * deltaTime);
    }

    if (rootVelocity > 6) {
        walkSpeedFactor = 10;
        walkSpeedFactor2 = 9;
    } else if (rootVelocity > 0.1) {
        walkSpeedFactor = 6;
        walkSpeedFactor2 = 7;
    } else {
        walkSpeedFactor2 = 0;
    }

    player.CameraMaxZoomDistance = 128;
    player.CameraMinZoomDistance = 0.5;
    lookVector = lookVector.Lerp(camera.CFrame.LookVector, 0.125 * deltaTime);
});