import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3, MeshBuilder, StandardMaterial } from '@babylonjs/core';

export function createSphere(obj: { position_x: number; position_y: number; position_z: number; mass: number; }, index: number, scene: any) {
    var diameter = scaleMassToRadius(obj.mass)
    var sphere = MeshBuilder.CreateSphere(`sphere${index}`, {diameter: diameter}, scene);
    sphere.position.x = obj.position_x;
    sphere.position.y = obj.position_y;
    sphere.position.z = obj.position_z;
    var my_material = new StandardMaterial(`sphere_material_${index}`, scene);
    my_material.alpha = 1;

    my_material.emissiveColor = new Color3(1,1,1);
    sphere.material = my_material;
    return sphere;
}

export function generateCelestialMass(celestialType: 'planet' | 'star' | 'galaxy'): number {
    switch (celestialType) {
        case 'planet':
            // Planets: from a fraction of Earth's mass to several times Jupiter's mass
            // (0.000003 to 0.01 solar masses)
            return parseFloat((Math.random() * (0.01 - 0.000003) + 0.000003).toFixed(6));

        case 'star':
            // Stars: from a fraction of the Sun's mass to several tens of solar masses
            // (0.1 to 50 solar masses)
            return parseFloat((Math.random() * (50 - 0.1) + 0.1).toFixed(2));

        case 'galaxy':
            // Galaxies: from millions to trillions of solar masses
            // (1 million to 1 trillion solar masses)
            return parseFloat((Math.random() * (1e12 - 1e6) + 1e6).toFixed(2));

        default:
            throw new Error("Unknown celestial object type.");
    }
}

export function generateInitialVelocity(position: Vector3, centralMass: number): Vector3 {
    // Assuming central mass (like a star) is at the origin
    let radialVector = position;
    let distance = Math.sqrt(radialVector.x ** 2 + radialVector.y ** 2 + radialVector.z ** 2);

    // Calculate orbital velocity (simplified)
    const G = 39.478; // Gravitational constant in AU^3 / solar mass / year^2
    let orbitalSpeed = Math.sqrt(G * centralMass / distance);

    // Generate a perpendicular velocity vector (simplified to 2D for demonstration)
    let velocity = new Vector3(-radialVector.y, radialVector.x, 0);
    let velocityMagnitude = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2);

    // Normalize and scale by orbital speed
    velocity.x = (velocity.x / velocityMagnitude) * orbitalSpeed;
    velocity.y = (velocity.y / velocityMagnitude) * orbitalSpeed;
    velocity.z = (velocity.z / velocityMagnitude) * orbitalSpeed;

    return velocity;
}

export function generateInitialPosition(maxDistance: number): Vector3 {
    // Random angles and distance within the specified maxDistance
    let azimuthalAngle = Math.random() * 2 * Math.PI; // Random angle between 0 and 2π
    let polarAngle = Math.acos(2 * Math.random() - 1); // Random angle between 0 and π
    let distance = Math.random() * maxDistance; // Random distance within maxDistance

    // Convert spherical coordinates (distance, polarAngle, azimuthalAngle) to Cartesian coordinates (x, y, z)
    let x = distance * Math.sin(polarAngle) * Math.cos(azimuthalAngle);
    let y = distance * Math.sin(polarAngle) * Math.sin(azimuthalAngle);
    let z = distance * Math.cos(polarAngle);

    return new Vector3(x, y, z);
}

export function scaleMassToRadius(mass: number, minRadius: number = 1, maxRadius: number = 5, scaleFactor: number = 1): number {
    if (mass <= 0) {
        throw new Error("Mass must be positive");
    }

    // Normalize mass to a 0-1 scale based on an assumed maximum mass (e.g., the mass of the largest known star)
    // You can adjust the maxMass value based on the context of your simulation
    const maxMass = 1; // Example value, representing the mass of the largest object in solar masses
    const normalizedMass = Math.min(mass / maxMass, 1); // Ensures the mass doesn't exceed the maximum

    // Power-law scaling
    const radius = minRadius + (maxRadius - minRadius) * Math.pow(normalizedMass, scaleFactor);

    return radius;
}