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
  VisibilityState,
  SceneUnderstandingSystem,
  XRPlane,
  XRMesh,
  XRAnchor,
} from "@iwsdk/core";

import { Vector3 } from "three";

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
import { StickyNoteSystem } from "./stickyNoteSystem.js";
import { WallNoteSystem } from "./wallNoteSystem.js";

import { Robot } from "./robot.js";

import { RobotSystem } from "./robot.js";

// ============================================
// IN-XR CONSOLE LOG OVERLAY - DISABLED
// ============================================
// Console overlay completely removed to clean up welcome screen

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
    // CRITICAL: Scene Understanding requires these exact features for Quest 3S
    // IWSDK uses camelCase which converts to kebab-case WebXR feature strings
    features: {
      // Required features for mesh detection on Quest 3S (no depth sensor)
      meshDetection: { required: true },    // -> 'mesh-detection'
      planeDetection: { required: true },   // -> 'plane-detection'  
      anchors: { required: true },          // -> 'anchors'
      hitTest: { required: true },          // -> 'hit-test'

      // Optional features
      handTracking: { required: true },    // -> 'hand-tracking'
      layers: { required: false },          // -> 'layers'

      // CRITICAL: Do NOT include depthSensing (Quest 3S lacks depth hardware)
    },
  },
  features: {
    locomotion: false,
    grabbing: true,
    physics: false,
  },
})
  .then((world) => {
    const { camera } = world;

    camera.position.set(0, 1, 0.5);

    // CRITICAL: Enable ray pointers for distance grabbing
    // The grabbing system creates multiPointers, but ray sub-pointers are disabled by default
    const xrInput = (world as any).input;
    if (xrInput?.multiPointers) {
      // Enable ray sub-pointer on both hands
      xrInput.multiPointers.left?.toggleSubPointer('ray', true);
      xrInput.multiPointers.right?.toggleSubPointer('ray', true);

      // Enable grab sub-pointer on both hands (for near interactions)
      xrInput.multiPointers.left?.toggleSubPointer('grab', true);
      xrInput.multiPointers.right?.toggleSubPointer('grab', true);
    }

    // Welcome/Exit panel - position changes based on XR state
    const panel = world
      .createTransformEntity()
      .addComponent(PanelUI, {
        config: "/ui/welcome.json",
        maxHeight: 0.8,
        maxWidth: 1.6,
      })
      .addComponent(Interactable);
    // Don't set initial position - let PanelSystem handle all positioning

    // Register SceneUnderstanding system and components
    world
      .registerSystem(SceneUnderstandingSystem)
      .registerComponent(XRPlane)
      .registerComponent(XRMesh)
      .registerComponent(XRAnchor);

    world.registerSystem(PanelSystem);
    world.registerSystem(WallNoteSystem);
    world.registerSystem(StickyNoteSystem);
  })
  .catch((error) => {
    showError(`World.create failed:\n${error.message}\n\nStack:\n${error.stack}`);
  });
