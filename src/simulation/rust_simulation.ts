import Simulation from "./simulation";

import { NBodySimulation } from 'n-body-wasm';

export default class RustSimulation implements Simulation {
    nbody: NBodySimulation;

    constructor(celestialObjects: { position_x: number; position_y: number; position_z: number; velocity_x: number; velocity_y: number; velocity_z: number; mass: number; }[]) {
        this.nbody = new NBodySimulation(celestialObjects);
    }
    get_positions(): { position_x: number; position_y: number; position_z: number; mass: number; }[] {
        return this.nbody.get_positions();
    }
    simulate(dt: number): void {
        this.nbody.simulate(dt)
    }
}
