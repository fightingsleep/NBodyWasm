use crate::celestial::CelestialObject;
use nalgebra::{Point3, Vector3};

pub struct OctreeNode {
    center_of_mass: Point3<f64>,
    total_mass: f64,
    bounds: AABB,
    children: [Option<Box<OctreeNode>>; 8],
}

impl OctreeNode {
    pub fn new(bounds: AABB) -> Self {
        OctreeNode {
            center_of_mass: Point3::new(0.0, 0.0, 0.0),
            total_mass: 0.0,
            bounds,
            children: [None, None, None, None, None, None, None, None],
        }
    }

    pub fn insert(&mut self, object: &CelestialObject) {
        if !self.bounds.contains(&object.position) {
            return; // Object not in this node's region
        }

        self.total_mass += object.mass;
        if self.total_mass == object.mass {
            // First object in this node
            self.center_of_mass = object.position;
        } else {
            // Update the center of mass
            let existing_weighted_position = self.center_of_mass * (self.total_mass - object.mass);
            let new_objects_weighted_position = object.position * object.mass;
            self.center_of_mass = (Point3::new(
                existing_weighted_position.x + new_objects_weighted_position.x,
                existing_weighted_position.y + new_objects_weighted_position.y,
                existing_weighted_position.z + new_objects_weighted_position.z,
            )) / self.total_mass;
        }

        if self.children[0].is_none() && !self.is_leaf() {
            self.subdivide();
        }

        if self.is_leaf() {
            return;
        }

        let child_idx = self.get_child_index(&object.position);
        if let Some(child) = &mut self.children[child_idx] {
            child.insert(object);
        }
    }

    fn is_leaf(&self) -> bool {
        self.children.iter().all(|child| child.is_none())
    }

    fn subdivide(&mut self) {
        for i in 0..8 {
            let child_aabb = self.bounds.get_child_aabb(i);
            self.children[i] = Some(Box::new(OctreeNode::new(child_aabb)));
        }
    }

    fn get_child_index(&self, position: &Point3<f64>) -> usize {
        let mid = (self.bounds.min + self.bounds.max) / 2.0;
        ((position.x > mid.x) as usize) * 4
            + ((position.y > mid.y) as usize) * 2
            + ((position.z > mid.z) as usize)
    }

    pub fn calculate_force(&self, object: &CelestialObject, theta: f64) -> Vector3<f64> {
        if self.is_leaf()
            || (self.bounds.max - self.bounds.min).norm()
                / (object.position - self.center_of_mass).norm()
                < theta
        {
            // Use center of mass if node is far enough away
            if (object.position - self.center_of_mass).norm() > 0.0 {
                const G: f64 = 39.478; // Gravitational constant in AU^3/M☉/year^2
                let distance = (object.position - self.center_of_mass).norm();
                let force_magnitude = G * (self.total_mass * object.mass) / distance.powi(2);
                let force_direction = (self.center_of_mass - object.position).normalize();
                force_direction * force_magnitude
            } else {
                Vector3::zeros()
            }
        } else {
            // Otherwise, sum up the forces from each child
            self.children
                .iter()
                .filter_map(|child| child.as_ref())
                .fold(Vector3::zeros(), |acc, child| {
                    acc + child.calculate_force(object, theta)
                })
        }
    }
}

pub struct AABB {
    pub min: Vector3<f64>,
    pub max: Vector3<f64>,
}

impl AABB {
    fn contains(&self, point: &Point3<f64>) -> bool {
        // Check if the point is inside the AABB
        point.x >= self.min.x
            && point.x <= self.max.x
            && point.y >= self.min.y
            && point.y <= self.max.y
            && point.z >= self.min.z
            && point.z <= self.max.z
    }

    fn get_child_aabb(&self, index: usize) -> AABB {
        let center = (self.min + self.max) / 2.0;
        let new_min = Vector3::new(
            if index & 4 == 0 { self.min.x } else { center.x },
            if index & 2 == 0 { self.min.y } else { center.y },
            if index & 1 == 0 { self.min.z } else { center.z },
        );
        let new_max = Vector3::new(
            if index & 4 == 0 { center.x } else { self.max.x },
            if index & 2 == 0 { center.y } else { self.max.y },
            if index & 1 == 0 { center.z } else { self.max.z },
        );
        AABB {
            min: new_min,
            max: new_max,
        }
    }
}
