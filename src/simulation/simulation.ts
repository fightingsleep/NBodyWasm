export default abstract class Simulation {
    abstract get_positions(): { position_x: number; position_y: number; position_z: number; mass: number; }[];
    abstract simulate(dt: number): void;
}
