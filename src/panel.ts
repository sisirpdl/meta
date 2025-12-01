import {
  createSystem,
  PanelUI,
  PanelDocument,
  eq,
  VisibilityState,
  UIKitDocument,
  UIKit,
  Vector3,
  Quaternion,
} from "@iwsdk/core";

/**
 * PanelSystem - manages the welcome/exit panel positioning
 * 
 * In XR mode, the panel follows an anchor point that is positioned relative to the head.
 * The panel only updates its position when the user moves beyond a threshold distance,
 * preventing it from constantly moving in front of the user's face when they look around.
 * 
 * Based on the pattern from webxr-showcases/sneaker-builder example.
 */
export class PanelSystem extends createSystem({
  welcomePanel: {
    required: [PanelUI, PanelDocument],
    where: [eq(PanelUI, "config", "/ui/welcome.json")],
  },
}) {
  private panelInXRMode = false;
  private anchorSetup = false;
  private uiAnchor: any = null; // Object3D anchor attached to head
  // Store the last anchor position
  private lastAnchorPos = new Vector3();
  // Distance threshold before panel follows (in meters) - smaller = more dynamic
  private followDistanceThreshold = 0.05;
  // Temp vectors for calculations
  private targetPos = new Vector3();
  private lookAtPos = new Vector3();
  private anchorPos = new Vector3();

  init() {
    this.queries.welcomePanel.subscribe("qualify", (entity) => {
      const document = PanelDocument.data.document[
        entity.index
      ] as UIKitDocument;
      if (!document) return;

      const xrButton = document.getElementById("xr-button") as UIKit.Text;
      xrButton.addEventListener("click", () => {
        if (this.world.visibilityState.value === VisibilityState.NonImmersive) {
          this.world.launchXR();
        } else {
          this.world.exitXR();
        }
      });

      // Update button text based on visibility state
      this.world.visibilityState.subscribe((visibilityState) => {
        if (visibilityState === VisibilityState.NonImmersive) {
          if (entity.object3D) entity.object3D.visible = true;
          xrButton.setProperties({ text: "Enter XR", display: "flex" });
          this.panelInXRMode = false;
          entity.setValue(PanelUI, "maxHeight", 0.8);
          entity.setValue(PanelUI, "maxWidth", 1.6);
        } else {
          if (entity.object3D) entity.object3D.visible = true;
          xrButton.setProperties({ display: "none" });
          this.panelInXRMode = true;
          entity.setValue(PanelUI, "maxHeight", 0.08);
          entity.setValue(PanelUI, "maxWidth", 0.16);
        }
      });
    });
  }

  update(delta: number) {
    this.queries.welcomePanel.entities.forEach((entity) => {
      const obj3D = entity.object3D;
      if (!obj3D) return;

      if (this.panelInXRMode && this.player.head) {
        // Setup anchor on first XR frame - attach to head like sneaker-builder example
        if (!this.anchorSetup && !this.uiAnchor) {
          // Create anchor and attach it to the head
          this.uiAnchor = {
            position: new Vector3(), getWorldPosition: function (target: Vector3) {
              return target.copy(this.position);
            }
          };

          // Position anchor top left of body (not rotated with head): left (-0.4m), up (0.3m), forward (-1.2m)
          this.uiAnchor.position.set(-0.4, 0.3, -1.2);

          // Make the anchor position relative to body (XR origin), not head rotation
          const updateAnchorWorldPos = () => {
            const bodyWorldPos = new Vector3();
            const headWorldPos = new Vector3();

            // Get body position (XR origin)
            const xrOrigin = this.player.head.parent;
            if (xrOrigin) {
              xrOrigin.getWorldPosition(bodyWorldPos);
            } else {
              this.player.head.getWorldPosition(bodyWorldPos);
            }

            // Get head height for Y position
            this.player.head.getWorldPosition(headWorldPos);

            // Position relative to body (no rotation applied)
            this.uiAnchor.position.set(
              bodyWorldPos.x - 0.4,  // 0.4m to the left
              headWorldPos.y + 0.3,   // 0.3m above head
              bodyWorldPos.z - 1.2    // 1.2m in front
            );
          };          // Initial position
          updateAnchorWorldPos();
          this.uiAnchor.updateWorldPos = updateAnchorWorldPos;

          // Position panel at anchor
          obj3D.position.copy(this.uiAnchor.position);
          this.lastAnchorPos.copy(this.uiAnchor.position);

          this.anchorSetup = true;
          console.log("Panel positioned top right of head");
        }

        // Update anchor position every frame
        if (this.uiAnchor && this.uiAnchor.updateWorldPos) {
          this.uiAnchor.updateWorldPos();
        }

        // Get current anchor position
        if (this.uiAnchor) {
          this.uiAnchor.getWorldPosition(this.anchorPos);

          // Only move panel if anchor has moved beyond threshold
          if (obj3D.position.distanceTo(this.anchorPos) > this.followDistanceThreshold) {
            // Smoothly lerp to anchor position
            obj3D.position.lerp(this.anchorPos, delta * 5);

            // Look at head but keep Y level
            const headPos = new Vector3();
            this.player.head.getWorldPosition(headPos);
            this.lookAtPos.set(headPos.x, obj3D.position.y, headPos.z);
            obj3D.lookAt(this.lookAtPos);
          }
        }
      } else if (!this.panelInXRMode) {
        // Reset when leaving XR
        if (this.anchorSetup) {
          this.anchorSetup = false;
          this.uiAnchor = null;
        }

        if (this.world.camera) {
          // In browser mode - follow camera
          obj3D.position.copy(this.world.camera.position);
          obj3D.position.z -= 1.9;
          obj3D.position.y = 1.29;
          obj3D.quaternion.copy(this.world.camera.quaternion);
        }
      }
    });
  }
}
