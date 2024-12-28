export function getRayDirections(origin: CFrame, raysPerShot: number, spread: number, timestamp: number): Vector3[] {
    const directions: Vector3[] = [];
    const angleIncrement = spread / (raysPerShot - 1);
    const halfSpread = spread / 2;

    for (let i = 0; i < raysPerShot; i++) {
        const angle = -halfSpread + i * angleIncrement;
        const direction = origin.LookVector
            .add(origin.RightVector.mul(math.sin(angle)))
            .add(origin.UpVector.mul(math.cos(angle)));
        directions.push(direction.Unit);
    }

    return directions;
}