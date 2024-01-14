mod octree;
mod celestial;

use wasm_bindgen::prelude::*;
use serde_wasm_bindgen::from_value;
use nalgebra::*;
use web_sys::console;
use octree::*;
use celestial::*;

fn apply_boundary_conditions(object: &mut CelestialObject) {
    const MAX_DISTANCE: f64 = 50.0;
    const MAX_VELOCITY: f64 = 100.0;
    if object.velocity.x > MAX_VELOCITY {
        object.velocity.x = MAX_VELOCITY;
    }
    if object.velocity.y > MAX_VELOCITY {
        object.velocity.y = MAX_VELOCITY;
    }
    if object.velocity.z > MAX_VELOCITY {
        object.velocity.z = MAX_VELOCITY;
    }

    // Check if the object has moved too far from the origin
    if object.position.x > MAX_DISTANCE && object.velocity.x > 0.0 {
        object.velocity.x = -object.velocity.x;
    }
    if object.position.x < -1.0 * MAX_DISTANCE && object.velocity.x < 0.0 {
        object.velocity.x = -object.velocity.x;
    }
    if object.position.y > MAX_DISTANCE && object.velocity.y > 0.0 {
        object.velocity.y = -object.velocity.y;
    }
    if object.position.y < -1.0 * MAX_DISTANCE && object.velocity.y < 0.0 {
        object.velocity.y = -object.velocity.y;
    }
    if object.position.z > MAX_DISTANCE && object.velocity.z > 0.0 {
        object.velocity.z = -object.velocity.z;
    }
    if object.position.z < -1.0 * MAX_DISTANCE && object.velocity.z < 0.0 {
        object.velocity.z = -object.velocity.z;
    }
}

#[wasm_bindgen]
pub struct NBodySimulation {
    celestial_objects: Vec<CelestialObject>
}

#[wasm_bindgen]
impl NBodySimulation {
    #[wasm_bindgen(constructor)]
    pub fn new(data: JsValue) -> NBodySimulation {
        let celestial_objects_data: Vec<CelestialObjectDto> = from_value(data).unwrap();
        let celestial_objects: Vec<CelestialObject> = celestial_objects_data.into_iter().map(CelestialObject::from).collect();
        console::log_1(&"N Body Simulation Constructed".into());
        NBodySimulation {
            celestial_objects: celestial_objects
        }
    }

    pub fn simulate_bh(&mut self, dt: f64) {
        // Build the Octree
        let mut root: OctreeNode = OctreeNode::new(AABB {
            min: Vector3::new(-100.0, -100.0, -100.0),
            max: Vector3::new(100.0, 100.0, 100.0),
        });
        for object in &self.celestial_objects {
            root.insert(object);
        }

        // Calculate accelerations using the Octree
        let theta = 0.5; // Barnes-Hut threshold
        let mut accelerations = vec![Vector3::<f64>::zeros(); self.celestial_objects.len()];
        for (i, object) in self.celestial_objects.iter().enumerate() {
            accelerations[i] = root.calculate_force(object, theta) / object.mass;
        }

        // Update positions and velocities
        for (i, object) in self.celestial_objects.iter_mut().enumerate() {
            object.velocity += accelerations[i] * dt;
            object.position += object.velocity * dt;
            // apply_boundary_conditions(object);
        }
    }

    pub fn simulate(&mut self, dt: f64) {
        let mut accelerations = vec![Vector3::<f64>::zeros(); self.celestial_objects.len()];
        // const G: f64 = 0.0098;
        const G: f64 = 6.674e-11;
        for i in 0..self.celestial_objects.len() {
            for j in 0..self.celestial_objects.len() {
                if i != j {
                    let diff = self.celestial_objects[j].position - self.celestial_objects[i].position;
                    let distance = diff.norm();
                    let force_magnitude = G * (self.celestial_objects[i].mass * self.celestial_objects[j].mass) / distance.powi(2);
                    let force_direction = diff.normalize();
                    let force = force_direction * force_magnitude;
    
                    accelerations[i] += force / self.celestial_objects[i].mass;
                }
            }
        }
    
        for (object, &acceleration) in self.celestial_objects.iter_mut().zip(&accelerations) {
            object.velocity += acceleration * dt;
            object.position += object.velocity * dt;
            apply_boundary_conditions(object);
        }
    }

    pub fn get_positions(&self) -> Result<JsValue, JsValue> {
        let dtos: Vec<CelestialObjectDto> = self.celestial_objects.iter().map(|x: &CelestialObject| CelestialObjectDto::from(*x)).collect();
        Ok(serde_wasm_bindgen::to_value(&dtos)?)
    }
}
