import { useEffect } from 'react';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Scene } from '@babylonjs/core/scene';
import { ArcRotateCamera, Color4, Mesh, GlowLayer } from '@babylonjs/core';
import { AdvancedDynamicTexture } from '@babylonjs/gui/2D';
import Simulation from '../simulation/simulation';
import RustSimulationBarnesHut from '../simulation/rust_simulation_bh';
import * as utils from '../utils/utils';
import { generate_celestial_objects } from '../utils/celestial_object_generator';
import ControlPanel from '../utils/control_panel';


function NBodyCanvas() {
  useEffect(() => {
    const canvas = document.getElementById('nBodyCanvas') as HTMLCanvasElement;
    const engine = new Engine(canvas);
    var scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 1);
    new GlowLayer("glow", scene);

    var camera = new ArcRotateCamera('Camera', -Math.PI / 2, Math.PI / 4, 500, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    var points: Mesh[] = [];

    var simulation: Simulation = new RustSimulationBarnesHut(generate_celestial_objects());

    var positions = simulation.get_positions();
    positions.forEach((obj: { position_x: number; position_y: number; position_z: number; mass: number; }, index: number) => {
      points.push(utils.createSphere(obj, index, scene));
    });

    // GUI
    var ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var control_panel = new ControlPanel();
    ui.addControl(control_panel.panel);

    window.addEventListener('keydown', (ev) => {
      // Toggle panel on pressing 'T', for example
      if (ev.key === 'T' || ev.key === 't') {
        control_panel.togglePanelVisibility();
      }
    });

    scene.render();

    let frameCount = 0;
    var last_fps_update = Date.now();
    var last_sim_time = Date.now();
    engine.runRenderLoop(() => {
      var curr_time = Date.now()

      frameCount++;
      if (curr_time - last_fps_update > 1000) { // when a second has passed
        control_panel.updateFPS(frameCount);
        frameCount = 0;
        last_fps_update = curr_time;
      }

      var dt = (curr_time - last_sim_time) / 1000.0
      last_sim_time = curr_time
      simulation.simulate(dt)
      var updated_objects = simulation.get_positions();

      updated_objects.forEach((obj: { position_x: number; position_y: number; position_z: number; }, index: number) => {
        var sphere = points[index];
        sphere.position.x = obj.position_x;
        sphere.position.y = obj.position_y;
        sphere.position.z = obj.position_z;
      })

      scene.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener('resize', function () {
      engine.resize();
    });
  }, []);

  return (
    <div className='fixed left-0 top-0 -z-50 h-screen w-screen'>
      <canvas id='nBodyCanvas' className='w-full h-full' />
    </div>
  );
}

export default NBodyCanvas;
