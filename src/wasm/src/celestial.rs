use serde::{Serialize, Deserialize};
use nalgebra::*;

#[derive(Clone, Copy, Serialize, Deserialize)]
pub struct CelestialObjectDto {
    pub position_x: f64,
    pub position_y: f64,
    pub position_z: f64,
    pub velocity_x: f64,
    pub velocity_y: f64,
    pub velocity_z: f64,
    pub mass: f64,
}

impl CelestialObjectDto {
    pub fn new() -> CelestialObjectDto {
        CelestialObjectDto {
            position_x: 0.0,
            position_y: 0.0,
            position_z: 0.0,
            velocity_x: 0.0,
            velocity_y: 0.0,
            velocity_z: 0.0,
            mass: 0.0,
        }
    }
}

impl From<CelestialObject> for CelestialObjectDto {
    fn from(obj: CelestialObject) -> CelestialObjectDto {
        let mut dto = CelestialObjectDto::new();
        dto.position_x = obj.position.x;
        dto.position_y = obj.position.y;
        dto.position_z = obj.position.z;
        dto.velocity_x = obj.velocity.x;
        dto.velocity_y = obj.velocity.y;
        dto.velocity_z = obj.velocity.z;
        dto.mass = obj.mass;
        return dto;
    }
}

impl From<CelestialObjectDto> for CelestialObject {
    fn from(dto: CelestialObjectDto) -> Self {
        Self {
            position: Point3::new(dto.position_x, dto.position_y, dto.position_z),
            velocity: Vector3::new(dto.velocity_x, dto.velocity_y, dto.velocity_z),
            mass: dto.mass,
        }
    }
}

#[derive(Clone, Copy)]
pub struct CelestialObject {
    pub position: Point3<f64>,
    pub velocity: Vector3<f64>,
    pub mass: f64,
}

impl CelestialObject {
    pub fn new(position: Point3<f64>, velocity: Vector3<f64>, mass: f64) -> Self {
        CelestialObject {
            position,
            velocity,
            mass,
        }
    }
}