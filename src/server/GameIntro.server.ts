import { RunService, StarterGui } from "@rbxts/services";

if (RunService.IsStudio()) {
    StarterGui.WaitForChild("StudioIntro").Destroy()
}