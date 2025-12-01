import {
    createSystem,
    XRMesh,
    Vector3,
    Quaternion,
    Raycaster,
    Matrix4,
} from "@iwsdk/core";

/**
 * WallNoteSystem - Detects meshes and handles raycasting for wall placement
 * 
 * Features:
 * - Query ALL XRMesh entities using SceneUnderstanding (label-agnostic)
 * - Raycast from controller/gaze to detect mesh intersections
 * - Provide intersection point and surface normal for note placement
 * 
 * DEBUG MODE (debugMode = true):
 * 1. Component Count Logging: Every 60 frames (~1 second), logs:
 *    - Total XRMesh entities detected
 *    - All unique semantic labels found (floor, ceiling, wall, global_mesh, etc.)
 *    - Each mesh's label, bounded status, and object3D presence
 * 2. Raycast Miss Detection: When trigger is pressed but raycast fails:
 *    - Logs ray origin and direction
 *    - Shows number of mesh objects available
 *    - Prints "Raycast MISSED" warning
 * 3. Visual Debugging: Enables wireframe rendering on ALL detected meshes
 * 4. Hit Confirmation: Logs successful raycast hits with position and distance
 * 
 * To disable debug mode, set debugMode = false in the class properties
 */

export class WallNoteSystem extends createSystem({
    meshes: {
        required: [XRMesh],
    },
}) {
    private raycaster: Raycaster = new Raycaster();
    public currentIntersection: {
        point: Vector3;
        normal: Vector3;
        wall: any;
    } | null = null;

    // Debug mode properties
    private debugMode: boolean = false; // Set to false to disable debug logging
    private frameCount: number = 0;
    private lastTriggerPressed: boolean = false;
    private debugTextElement: HTMLDivElement | null = null;

    init() {

        // Create on-screen debug display for Quest 3S
        if (this.debugMode) {
            this.debugTextElement = document.createElement("div");
            this.debugTextElement.id = "wall-debug-overlay";
            this.debugTextElement.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                background: rgba(0, 0, 0, 0.85);
                color: #00ff00;
                font-family: monospace;
                font-size: 16px;
                padding: 15px;
                border-radius: 8px;
                z-index: 9999;
                max-width: 500px;
                white-space: pre-wrap;
                pointer-events: none;
                border: 2px solid #00ff00;
            `;
            this.debugTextElement.textContent =
                "🐛 WallNoteSystem Debug Mode\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                "⏳ Waiting for Scene Understanding...\n" +
                "\n" +
                "💡 TIP: If meshes stay at 0:\n" +
                "1. Complete Room Setup in Quest settings\n" +
                "2. Grant Space Data permission if prompted\n" +
                "3. Wait 2-3 seconds after entering XR\n" +
                "4. Scan your room (look around)";
            document.body.appendChild(this.debugTextElement);
        }

        // Subscribe to ALL mesh detection (label-agnostic for debugging)
        this.queries.meshes.subscribe("qualify", (entity) => {
            const semanticLabel = entity.getValue(XRMesh, "semanticLabel");
            const isBounded = entity.getValue(XRMesh, "isBounded3D");

            console.log("🔍 MESH DETECTED:", {
                semanticLabel: semanticLabel || "UNLABELED",
                isBounded,
                hasObject3D: !!entity.object3D
            });

            // DEBUG: Enable wireframe visualization for ALL meshes to see what's being detected
            if (this.debugMode && entity.object3D) {
                entity.object3D.traverse((child: any) => {
                    if (child.isMesh && child.material) {
                        child.material.wireframe = true;
                        child.material.visible = true;
                        child.visible = true;
                        console.log("🔍 DEBUG: Enabled wireframe for mesh with label:", semanticLabel || "UNLABELED");
                    }
                });
            }
        });
    }

    update(delta: number) {
        // DEBUG: Log component counts every 60 frames (approximately 1 second at 60fps)
        this.frameCount++;
        if (this.debugMode && this.frameCount % 60 === 0) {
            const totalXRMeshEntities = this.queries.meshes.entities.size;

            // Log all semantic labels found with counts
            const labelCounts = new Map<string, number>();
            this.queries.meshes.entities.forEach(entity => {
                const label = entity.getValue(XRMesh, "semanticLabel") || "UNLABELED";
                labelCounts.set(label, (labelCounts.get(label) || 0) + 1);
            });

            const labelSummary = Array.from(labelCounts.entries())
                .map(([label, count]) => `${label}(${count})`)
                .join(', ');

            // Calculate time elapsed since XR session started
            const secondsElapsed = Math.floor(this.frameCount / 60);

            // Update on-screen debug display
            if (this.debugTextElement) {
                let statusMessage = '';
                let helpMessage = '';

                if (totalXRMeshEntities === 0) {
                    statusMessage = '⚠️ NO MESHES DETECTED';

                    if (secondsElapsed < 5) {
                        helpMessage = '\n\n⏳ Initializing... Please wait.';
                    } else {
                        helpMessage =
                            '\n\n❌ TROUBLESHOOTING:\n' +
                            '1. Go to Settings > Boundary > Space Setup\n' +
                            '2. Complete room scan if needed\n' +
                            '3. Look around your room to scan walls\n' +
                            '4. Grant "Space Data" permission\n' +
                            `\n⏱️ Elapsed: ${secondsElapsed}s`;
                    }
                } else {
                    statusMessage = '✅ MESHES DETECTED';
                    helpMessage = '\n\n👉 Point at a surface and pinch/trigger\nto create a sticky note!';
                }

                this.debugTextElement.textContent =
                    `🐛 WallNoteSystem Debug (Frame ${this.frameCount})\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `Total XRMesh Entities: ${totalXRMeshEntities}\n` +
                    `Labels Found: ${labelSummary || 'NONE'}\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `Status: ${statusMessage}${helpMessage}`;
            }

            console.log("📊 DEBUG: Component Count Report (Frame", this.frameCount, ")");
            console.log("  - Total XRMesh entities:", totalXRMeshEntities);
            console.log("  - Semantic labels with counts:");
            labelCounts.forEach((count, label) => {
                console.log(`    * ${label}: ${count}`);
            });
        }

        // DON'T clear intersection at start - let it persist until we have new data
        // this.currentIntersection = null; // REMOVED - was causing notes not to spawn

        // Get controller/hand input for raycasting
        const xrInput = (this.world as any).input;
        if (!xrInput?.gamepads) return;

        // Try both hands, prioritize right hand
        const handedness = xrInput.gamepads.right ? 'right' :
            xrInput.gamepads.left ? 'left' : null;

        if (!handedness) return;

        const gamepad = xrInput.gamepads[handedness];
        if (!gamepad) return;

        // Get ray space for the hand (pointing direction)
        const raySpace = (this.player as any).raySpaces?.[handedness];
        if (!raySpace) return;

        // Get ray origin and direction
        const rayOrigin = new Vector3();
        const rayDirection = new Vector3(0, 0, -1); // Forward in local space
        const rayQuat = new Quaternion();

        raySpace.getWorldPosition(rayOrigin);
        raySpace.getWorldQuaternion(rayQuat);
        rayDirection.applyQuaternion(rayQuat);

        // Set up raycaster
        this.raycaster.set(rayOrigin, rayDirection);

        // Collect ALL mesh objects for raycasting (label-agnostic)
        const wallObjects: any[] = [];
        this.queries.meshes.entities.forEach((entity) => {
            // Accept ALL meshes regardless of semantic label
            if (entity.object3D) {
                // The object3D should have mesh geometry we can raycast against
                entity.object3D.traverse((child: any) => {
                    if (child.isMesh) {
                        wallObjects.push(child);
                    }
                });
            }
        });

        // DEBUG: Track trigger state for raycast miss detection
        const isTriggerPressed = gamepad.getSelect?.() || false;
        const triggerJustPressed = isTriggerPressed && !this.lastTriggerPressed;
        this.lastTriggerPressed = isTriggerPressed;

        if (wallObjects.length === 0) {
            if (this.debugMode && triggerJustPressed) {
                console.warn("⚠️ DEBUG: No mesh objects available for raycasting");
                console.warn("  - XRMesh entities in query:", this.queries.meshes.entities.size);

                // Update on-screen display
                if (this.debugTextElement) {
                    this.debugTextElement.style.borderColor = "#ff9900";
                    this.debugTextElement.style.color = "#ff9900";
                    const currentText = this.debugTextElement.textContent || "";
                    this.debugTextElement.textContent = currentText +
                        `\n\n⚠️ TRIGGER PRESSED\n` +
                        `No mesh objects to raycast!`;

                    // Reset color after 2 seconds
                    setTimeout(() => {
                        if (this.debugTextElement) {
                            this.debugTextElement.style.borderColor = "#00ff00";
                            this.debugTextElement.style.color = "#00ff00";
                        }
                    }, 2000);
                }
            }
            return;
        }

        // Perform raycast against ALL objects (walls + notes)
        // We need to check if we hit a note BEFORE hitting a wall
        const allObjects = [...wallObjects];

        // Add all note entities to raycast check
        // Notes will have userData.entity reference set by StickyNoteSystem
        (this.world as any).scene?.traverse((obj: any) => {
            if (obj.userData?.entity && obj.userData?.isNote) {
                allObjects.push(obj);
            }
        });

        const intersects = this.raycaster.intersectObjects(allObjects, true);

        if (intersects.length > 0) {
            const firstHit = intersects[0];

            // ============================================
            // FIX: Prevent spawning when clicking existing notes
            // ============================================
            // Check if we hit a note entity or a grabbable object
            // If so, ABORT - don't spawn a new note
            if (firstHit.object.userData?.entity && firstHit.object.userData?.isNote) {
                console.log("🚫 Raycast hit existing note - aborting spawn");
                this.currentIntersection = null; // Clear intersection to prevent spawn
                return;
            }

            // Additional check: if the hit object's parent has Interactable or OneHandGrabbable
            // This catches cases where we hit a child of a note
            const hitEntity = firstHit.object.userData?.entity;
            if (hitEntity) {
                // Check if entity or its parent has grabbable components
                // Note: We can't directly check for components here without importing them
                // So we rely on the userData.isNote flag set by StickyNoteSystem
                console.log("🚫 Raycast hit interactive entity - aborting spawn");
                this.currentIntersection = null;
                return;
            }

            // Store intersection data (only if we hit a wall, not a note)
            this.currentIntersection = {
                point: firstHit.point.clone(),
                normal: firstHit.face?.normal.clone().transformDirection(
                    firstHit.object.matrixWorld
                ) || new Vector3(0, 0, 1),
                wall: firstHit.object,
            };

            // DEBUG: Log successful hit
            if (this.debugMode && triggerJustPressed) {
                console.log("✅ DEBUG: Raycast HIT!");
                console.log("  - Hit point:", firstHit.point);
                console.log("  - Hit distance:", firstHit.distance);

                // Update on-screen display
                if (this.debugTextElement) {
                    this.debugTextElement.style.borderColor = "#00ff00";
                    this.debugTextElement.style.color = "#00ff00";
                    const currentText = this.debugTextElement.textContent || "";
                    this.debugTextElement.textContent = currentText +
                        `\n\n✅ RAYCAST HIT!\n` +
                        `Distance: ${firstHit.distance.toFixed(2)}m`;

                    // Clear hit message after 2 seconds
                    setTimeout(() => {
                        if (this.debugTextElement && this.debugTextElement.textContent?.includes('RAYCAST HIT')) {
                            // Remove the hit message section
                            const text = this.debugTextElement.textContent;
                            const lines = text.split('\n');
                            this.debugTextElement.textContent = lines.slice(0, -3).join('\n');
                        }
                    }, 2000);
                }
            }
        } else {
            // Clear intersection when raycast misses
            this.currentIntersection = null;

            if (this.debugMode && triggerJustPressed) {
                // DEBUG: Log raycast miss with ray details
                console.warn("❌ DEBUG: Raycast MISSED");
                console.warn("  - Ray origin:", rayOrigin);
                console.warn("  - Ray direction:", rayDirection);
                console.warn("  - Mesh objects available:", wallObjects.length);

                // Update on-screen display
                if (this.debugTextElement) {
                    this.debugTextElement.style.borderColor = "#ff0000";
                    this.debugTextElement.style.color = "#ff0000";
                    const currentText = this.debugTextElement.textContent || "";
                    this.debugTextElement.textContent = currentText +
                        `\n\n❌ RAYCAST MISSED!\n` +
                        `Origin: ${rayOrigin.x.toFixed(1)}, ${rayOrigin.y.toFixed(1)}, ${rayOrigin.z.toFixed(1)}\n` +
                        `Direction: ${rayDirection.x.toFixed(2)}, ${rayDirection.y.toFixed(2)}, ${rayDirection.z.toFixed(2)}\n` +
                        `Mesh objects: ${wallObjects.length}`;

                    // Reset color after 2 seconds
                    setTimeout(() => {
                        if (this.debugTextElement) {
                            this.debugTextElement.style.borderColor = "#00ff00";
                            this.debugTextElement.style.color = "#00ff00";
                            // Remove the miss message section
                            const text = this.debugTextElement.textContent || "";
                            const lines = text.split('\n');
                            this.debugTextElement.textContent = lines.slice(0, -5).join('\n');
                        }
                    }, 2000);
                }
            }
        }
    }

    /**
     * Get the current wall intersection data
     * @returns Intersection data or null if no wall is being targeted
     */
    public getIntersection() {
        return this.currentIntersection;
    }

    /**
     * Calculate the rotation quaternion to align an object to a wall's surface normal
     * The object's local Z-axis will point out from the wall
     */
    public getWallAlignedRotation(normal: Vector3): Quaternion {
        // Create a quaternion that rotates from default forward (0,0,1) to the wall normal
        const defaultForward = new Vector3(0, 0, 1);
        const quaternion = new Quaternion();

        // If normal is nearly parallel to forward, handle edge case
        if (Math.abs(normal.dot(defaultForward)) > 0.9999) {
            if (normal.z < 0) {
                // Facing opposite direction - rotate 180 degrees around Y
                quaternion.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI);
            }
            // else: already aligned, quaternion is identity
        } else {
            quaternion.setFromUnitVectors(defaultForward, normal);
        }

        return quaternion;
    }
}
