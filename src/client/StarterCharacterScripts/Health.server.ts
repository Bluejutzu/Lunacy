import { RunService } from "@rbxts/services";

/**
 * Folder structure:
 * Script > TS > Character
 */

const character = script.Parent?.Parent as Model;
const humanoid = character.WaitForChild("Humanoid") as Humanoid;

const REGEN_DELAY = 5;
const REGEN_RATE = 10;

let lastHealth = humanoid.Health;
let lastDamageTime = 0;

function onHeartbeat(deltaTime: number) {
    const elapsed = os.clock() - lastDamageTime;
    if (elapsed < REGEN_DELAY) {
        return;
    }
    if (humanoid.Health >= humanoid.MaxHealth) {
        return;
    }

    humanoid.Health = math.min(humanoid.Health + REGEN_RATE * deltaTime, humanoid.MaxHealth);
}

function onHealthChanged(health: number) {
    if (health < lastHealth) {
        lastDamageTime = os.clock();
    }
    lastHealth = health;
}

RunService.Heartbeat.Connect(onHeartbeat);
humanoid.HealthChanged.Connect(onHealthChanged);