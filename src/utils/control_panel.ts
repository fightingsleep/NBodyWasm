import { Button, Control, Slider, StackPanel, TextBlock } from "@babylonjs/gui/2D";

export default class ControlPanel {
    panel: StackPanel;
    fps_label: TextBlock;
    gravity_slider: Slider;
    start_button: Button;

    constructor() {
        this.panel = new StackPanel();
        this.panel.width = "100px";
        this.panel.height = "100px";
        this.panel.background = "white";
        this.panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.panel.left = "10px";
        this.panel.top = "10px";

        this.fps_label = new TextBlock();
        this.fps_label.text = "FPS: 0";
        this.fps_label.color = "black";
        this.fps_label.fontSize = 24;
        this.fps_label.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.fps_label.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.panel.addControl(this.fps_label);
    }

    updateFPS(fps: number) {
        this.fps_label.text = `FPS: ${fps}`;
    }

    togglePanelVisibility() {
        this.panel.isVisible = !this.panel.isVisible;
    }
}