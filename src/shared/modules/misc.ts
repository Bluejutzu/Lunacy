export const helpers = {
	moveToPosition: (npc: Model, position: Vector3) => {
		const primaryPart = npc.PrimaryPart;
		if (primaryPart) {
			npc.PivotTo(new CFrame(position));
		}
	},

	getDistance: (pos1: Vector3, pos2: Vector3): number => {
		return pos1.sub(pos2).Magnitude;
	},

	isInScreenBounds: (camera: Camera, position: Vector3): boolean => {
		const result = camera.WorldToScreenPoint(position);
		return result[1];
	},
};
