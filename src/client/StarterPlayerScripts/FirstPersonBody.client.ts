import { Players, RunService } from "@rbxts/services";
import { CharacterChildren } from "shared/Utility/CharacterChildren";

const localPlayer = Players.LocalPlayer;
const character = localPlayer.Character || localPlayer.CharacterAdded.Wait()[0];

RunService.RenderStepped.Connect(() => {
    if (character) {
        for (const partName of CharacterChildren) {
            const part = character.FindFirstChild(partName) as BasePart | undefined;
            if (part) {
                part.LocalTransparencyModifier = 0;
            }
        }

        const humanoid = character.FindFirstChild("Humanoid") as Humanoid | undefined;
        if (humanoid) {
            humanoid.CameraOffset = new Vector3(0, 0, -1);
        }
    }
});