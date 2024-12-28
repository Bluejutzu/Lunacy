import { Workspace } from "@rbxts/services";

export function drawRayResults(muzzlePosition: Vector3, rayResults: RaycastResult[]) {
    rayResults.forEach(result => {
        if (result) {
            const hitPosition = result.Position;
            const hitNormal = result.Normal;

            const ray = new Instance("Part");
            ray.Size = new Vector3(0.1, 0.1, (hitPosition.sub(muzzlePosition)).Magnitude);
            ray.Position = muzzlePosition.add(hitNormal.mul(ray.Size.Z / 2));
            ray.Anchored = true;
            ray.CanCollide = false;
            ray.BrickColor = new BrickColor("Bright red");
            ray.Material = Enum.Material.Neon;

            ray.CFrame = new CFrame(muzzlePosition, hitPosition);

            ray.Parent = Workspace;

            ray.Destroy();
        }
    });
}