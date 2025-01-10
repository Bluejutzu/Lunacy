import { Players, ReplicatedStorage } from "@rbxts/services"; 

const Remotes = ReplicatedStorage.WaitForChild("Remotes")
const FlashlightReplicateRemote = Remotes.WaitForChild("FlashlightReplicate") as RemoteEvent

Players.PlayerAdded.Connect((plr) => {
    
})
