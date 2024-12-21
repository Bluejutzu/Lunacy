import { Players } from "@rbxts/services";

const ReplicatedStorage = game.GetService("ReplicatedStorage");
const TriggerFlicker = ReplicatedStorage.WaitForChild("Remotes").WaitForChild("TriggerFlicker") as RemoteEvent;

wait(10);

const players = game.GetService("Players").GetPlayers();
const random = players[math.random(1, players.size())];
print(random);
const s = pcall(() => {
	TriggerFlicker.FireClient(random);
});
print(s[0], s[1]);
print("Finished operation");
