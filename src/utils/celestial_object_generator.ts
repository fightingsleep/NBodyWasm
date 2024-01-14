import * as utils from '../utils/utils';

export function generate_celestial_objects(): { position_x: number; position_y: number; position_z: number; velocity_x: number; velocity_y: number; velocity_z: number; mass: number; }[] {
    let celestialObjects = [];

    for (let i = 0; i < 1000; i++) {
        let object_mass = utils.generateCelestialMass('planet');
        let position = utils.generateInitialPosition(100);
        let velocity = utils.generateInitialVelocity(position, 0);
        let celestialObject = {
            position_x: position.x,
            position_y: position.y,
            position_z: position.z,
            velocity_x: velocity.x,
            velocity_y: velocity.y,
            velocity_z: velocity.z,
            mass: object_mass
        };
        celestialObjects.push(celestialObject);
    }
    return celestialObjects;
}