import { Players, ReplicatedStorage } from "@rbxts/services";

const Remotes = ReplicatedStorage.WaitForChild("Remotes");
const TriggerDistortion = Remotes.WaitForChild("TriggerDistortion") as RemoteEvent;
const TriggerFlicker = Remotes.WaitForChild("TriggerDistortion") as RemoteEvent;

TriggerDistortion.OnServerEvent.Connect((player) => {
	if (Players.FindFirstChild(player.Name)) {
		print(`${player.Name} triggered a distortion event.`);
		TriggerDistortion.FireClient(player);
	} else {
		print(`Invalid player: ${player.Name}`);
	}
});

TriggerFlicker.OnServerEvent.Connect((player) => {
	if (Players.FindFirstChild(player.Name)) {
		print(`${player.Name} triggered a flickering event.`);
		TriggerFlicker.FireClient(player);
	} else {
		print(`Invalid player: ${player.Name}`);
	}
});
