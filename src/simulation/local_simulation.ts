import Simulation from "./simulation";
import Vector3 from "../utils/vector3"

export default class LocalSimulation implements Simulation {
    celestial_objects: { velocity: Vector3; position: Vector3; mass: number }[] = [];

    constructor(celestialObjects: { position_x: number; position_y: number; position_z: number; velocity_x: number; velocity_y: number; velocity_z: number; mass: number; }[]) {
        celestialObjects.forEach(element => {
            let position = new Vector3(element.position_x, element.position_y, element.position_z);
            let velocity = new Vector3(element.velocity_x, element.velocity_y, element.velocity_z);
            this.celestial_objects.push({ velocity: velocity, position: position, mass: element.mass });
        });
    }

    get_positions(): { position_x: number; position_y: number; position_z: number; mass: number; }[] {
        return this.celestial_objects.map(element => {
            return { position_x: element.position.x, position_y: element.position.y, position_z: element.position.z, mass: element.mass };
        });
    }
    simulate(dt: number): void {
        let accelerations: Vector3[] = Array(this.celestial_objects.length).fill(new Vector3(0, 0, 0));
        const G = 0.0098;
        const MAX_DISTANCE: number = 50.0;
        const MAX_VELOCITY: number = 100.0;
        for (let i = 0; i < this.celestial_objects.length; i++) {
            for (let j = 0; j < this.celestial_objects.length; j++) {
                if (i != j) {
                    let diff = this.celestial_objects[j].position.subtract(this.celestial_objects[i].position);
                    let distance = diff.norm();
                    let force_magnitude = G * Number(this.celestial_objects[i].mass * this.celestial_objects[j].mass) / Math.pow(distance, 2);
                    let force_direction = diff.normalize();
                    let force = force_direction.multiply(force_magnitude);
    
                    accelerations[i] = accelerations[i].add(force.divide(Number(this.celestial_objects[i].mass)));
                }
            }
        }
    
        for (let i = 0; i < this.celestial_objects.length; i++) {
            this.celestial_objects[i].velocity = this.celestial_objects[i].velocity.add(accelerations[i].multiply(dt));
            if (this.celestial_objects[i].velocity.x > MAX_VELOCITY) {
                this.celestial_objects[i].velocity.x = MAX_VELOCITY;
            }
            if (this.celestial_objects[i].velocity.y > MAX_VELOCITY) {
                this.celestial_objects[i].velocity.y = MAX_VELOCITY;
            }
            if (this.celestial_objects[i].velocity.z > MAX_VELOCITY) {
                this.celestial_objects[i].velocity.z = MAX_VELOCITY;
            }
            this.celestial_objects[i].position = this.celestial_objects[i].position.add(this.celestial_objects[i].velocity.multiply(dt));
    
            // Check if the object has moved too far from the origin
            if (this.celestial_objects[i].position.x > MAX_DISTANCE && this.celestial_objects[i].velocity.x > 0) {
                this.celestial_objects[i].velocity.x = -this.celestial_objects[i].velocity.x;
            }
            if (this.celestial_objects[i].position.x < -MAX_DISTANCE && this.celestial_objects[i].velocity.x < 0) {
                this.celestial_objects[i].velocity.x = -this.celestial_objects[i].velocity.x;
            }
            if (this.celestial_objects[i].position.y > MAX_DISTANCE && this.celestial_objects[i].velocity.y > 0) {
                this.celestial_objects[i].velocity.y = -this.celestial_objects[i].velocity.y;
            }
            if (this.celestial_objects[i].position.y < -MAX_DISTANCE && this.celestial_objects[i].velocity.y < 0) {
                this.celestial_objects[i].velocity.y = -this.celestial_objects[i].velocity.y;
            }
            if (this.celestial_objects[i].position.z > MAX_DISTANCE && this.celestial_objects[i].velocity.z > 0) {
                this.celestial_objects[i].velocity.z = -this.celestial_objects[i].velocity.z;
            }
            if (this.celestial_objects[i].position.z < -MAX_DISTANCE && this.celestial_objects[i].velocity.z < 0) {
                this.celestial_objects[i].velocity.z = -this.celestial_objects[i].velocity.z;
            }
        }
    }
}