import { Logger, LogLevel } from "../../Utility/logger";

const logger = new Logger("Lerp", LogLevel.Info);

export default function lerp<T extends CFrame | Vector3 | number>(start: T, target: T, alpha: number): T {
	if (typeIs(start, "number") && typeIs(target, "number")) {
		// Lerp for numbers
		return (start + (target - start) * alpha) as T;
	} else if (start instanceof Vector3 && target instanceof Vector3) {
		// Lerp for Vector3s
		return (start as Vector3).Lerp(target as Vector3, alpha) as T;
	} else if (start instanceof CFrame && target instanceof CFrame) {
		// Lerp for CFrames
		const startPos = (start as CFrame).Position;
		const targetPos = (target as CFrame).Position;
		const interpolatedPos = startPos.Lerp(targetPos, alpha);

		const startOrientation = (start as CFrame).Rotation;
		const targetOrientation = (target as CFrame).Rotation;
		const interpolatedOrientation = startOrientation.Lerp(targetOrientation, alpha);

		return new CFrame(interpolatedPos).mul(interpolatedOrientation) as T;
	} else {
		logger.error("lerp: Unsupported type or mismatched input types.");
		return 0 as T;
	}
}
