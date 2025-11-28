import {
  AssetManifest,
  AssetType,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SessionMode,
  SRGBColorSpace,
  AssetManager,
  World,
} from "@iwsdk/core";

import {
  AudioSource,
  DistanceGrabbable,
  MovementMode,
  Interactable,
  PanelUI,
  PlaybackMode,
  ScreenSpace,
} from "@iwsdk/core";

import { EnvironmentType, LocomotionEnvironment } from "@iwsdk/core";

import { PanelSystem } from "./panel.js";

import { Robot } from "./robot.js";

import { RobotSystem } from "./robot.js";

// Error display on screen
function showError(message: string) {
  const errorDiv = document.createElement("div");
  errorDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(220, 38, 38, 0.95);
    color: white;
    padding: 20px 30px;
    border-radius: 10px;
    font-family: monospace;
    font-size: 14px;
    max-width: 80%;
    z-index: 10000;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    white-space: pre-wrap;
    word-break: break-word;
  `;
  errorDiv.textContent = `ERROR:\n${message}`;
  document.body.appendChild(errorDiv);
  console.error("ERROR:", message);
}

// Capture global errors
window.addEventListener("error", (event) => {
  showError(`${event.message}\nat ${event.filename}:${event.lineno}:${event.colno}`);
});

window.addEventListener("unhandledrejection", (event) => {
  showError(`Unhandled Promise Rejection:\n${event.reason}`);
});

const assets: AssetManifest = {
  chimeSound: {
    url: "/audio/chime.mp3",
    type: AssetType.Audio,
    priority: "background",
  },
  webxr: {
    url: "/textures/webxr.png",
    type: AssetType.Texture,
    priority: "critical",
  },

  plantSansevieria: {
    url: "/gltf/plantSansevieria/plantSansevieria.gltf",
    type: AssetType.GLTF,
    priority: "critical",
  },
  robot: {
    url: "/gltf/robot/robot.gltf",
    type: AssetType.GLTF,
    priority: "critical",
  },
};

World.create(document.getElementById("scene-container") as HTMLDivElement, {
  assets,
  xr: {
    sessionMode: SessionMode.ImmersiveAR,
    offer: "always",
    // Optional structured features; layers/local-floor are offered by default
    features: {
      handTracking: { required: true },
      anchors: { required: true },         // For persisting note positions
      hitTest: { required: true },
      planeDetection: { required: true },  // Need this for wall detection
      meshDetection: { required: true },   // Need this for scene meshes
      layers: { required: true },
    },
  },
  features: {
    locomotion: false,
    grabbing: true,
    physics: false,
    sceneUnderstanding: true,
  },
})
  .then((world) => {
    console.log("✅ World created successfully!");
    const { camera } = world;

    camera.position.set(0, 1, 0.5);

    // Welcome/Exit panel - position changes based on XR state
    const panel = world
      .createTransformEntity()
      .addComponent(PanelUI, {
        config: "/ui/welcome.json",
        maxHeight: 0.16,
        maxWidth: 0.32,
      })
      .addComponent(Interactable);
    // Don't set initial position - let PanelSystem handle all positioning

    world.registerSystem(PanelSystem);
    console.log("✅ All systems registered successfully!");
  })
  .catch((error) => {
    showError(`World.create failed:\n${error.message}\n\nStack:\n${error.stack}`);
  });
