import { MessagingService, Players } from "@rbxts/services";
import { Logger, LogLevel } from "shared/Gameplay/Utils/logger";

const logger = new Logger("MessagingService", LogLevel.Info);

interface ModerationData {
	action: "kick" | "ban" | "warn";
	reason: string;
	duration?: number | string;
}

const defaultBanDuration = "1d";
function handleModeration(data: ModerationData) {
	const { action, reason, duration } = data;

	switch (action) {
		case "kick":
			handleKick(reason);
			break;
		case "ban":
			handleBan(reason, duration);
			break;
		case "warn":
			handleWarn(reason);
			break;
		default:
			logger.warn(`Unknown moderation action: ${action}`);
	}
}

function handleKick(reason: string) {
	Players.PlayerAdded.Connect((player) => {
		player.Kick(reason);
		logger.info(`Player ${player.Name} was kicked for: ${reason}`);
	});
}

function handleBan(reason: string, duration?: number | string) {
	const banDuration = duration ?? defaultBanDuration;
	Players.PlayerAdded.Connect((player) => {
		player.Kick(`Banned for ${banDuration}: ${reason}`);
		logger.info(`Player ${player.Name} was banned for ${banDuration} for: ${reason}`);
	});
}

function handleWarn(reason: string) {
	Players.PlayerAdded.Connect((player) => {
		logger.info(`Player ${player.Name} was warned for: ${reason}`);
	});
}

MessagingService.SubscribeAsync("moderate", (message) => {
	const data = message.Data as ModerationData;
	handleModeration(data);
	logger.info(`Moderation event received: ${data.action} - ${data.reason}`);
});
