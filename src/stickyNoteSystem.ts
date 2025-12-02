import {
    createSystem,
    PanelUI,
    PanelDocument,
    eq,
    UIKitDocument,
    UIKit,
    Interactable,
    OneHandGrabbable,
    DistanceGrabbable,
    Hovered,
    Pressed,
    VisibilityState,
    AssetManager,
    Vector3,
    Mesh,
    PlaneGeometry,
    MeshBasicMaterial,
} from "@iwsdk/core";
import { Color } from "three";
import { StickyNote, NoteColor } from "./components/StickyNote.js";
import { WallNoteSystem } from "./wallNoteSystem.js";
import { SoundManager } from "./utils/SoundManager.js";

export class StickyNoteSystem extends createSystem({
    notes: {
        required: [StickyNote, PanelUI, Interactable],
    },
    notePanels: {
        required: [PanelUI, PanelDocument],
        where: [eq(PanelUI, "config", "/ui/sticky-note.json")],
    },
}) {
    private colorOptions = [
        NoteColor.Yellow,
        NoteColor.Blue,
        NoteColor.Green,
        NoteColor.Purple,
    ];
    private currentColorIndex = 0;
    private lastSpawnTime: { left: number; right: number } = { left: 0, right: 0 };
    private spawnCooldown = 500;
    private sounds: SoundManager | null = null;
    private grabbedNotes: Map<number, boolean> = new Map();
    private wallNoteSystem: WallNoteSystem | null = null;
    private hiddenInput: HTMLTextAreaElement | null = null;
    private currentEditingEntity: any = null;
    private pollInterval: number | null = null;
    private lastKnownValue: string = "";
    private keyboardOpenTime: number = 0;
    private originalTextAtKeyboardOpen: string = "";

    init() {
        this.wallNoteSystem = this.world.getSystem(WallNoteSystem) || null;
        this.initAudio();
        this.createHiddenInput();

        this.queries.notes.subscribe("qualify", (entity) => {
            console.log("New note entity:", entity.index);
        });

        this.queries.notes.subscribe("disqualify", (entity) => {
            console.log("Note entity removed:", entity.index);
        });

        this.queries.notePanels.subscribe("qualify", (entity) => {
            const document = PanelDocument.data.document[entity.index] as UIKitDocument;
            if (!document) return;

            const contentInput = document.getElementById("note-content");
            const colorButton = document.getElementById("color-button");
            const deleteButton = document.getElementById("delete-button");

            // Add click handler to input field for keyboard
            if (contentInput) {
                contentInput.setProperties({ pointerEvents: 'auto' });
                contentInput.addEventListener("click", (event: any) => {
                    event?.stopPropagation?.();
                    console.log("🖱️ Input field clicked! Starting debug...");
                    console.log("  - Entity:", entity.index);
                    console.log("  - Current content:", entity.getValue(StickyNote, "content"));

                    // Use the existing method but with more debugging
                    this.openKeyboardForNote(entity);
                });
                console.log("✅ Input click listener attached");
            }

            // --- COLOR BUTTON LOGIC ---
            if (colorButton) {
                colorButton.setProperties({ pointerEvents: 'auto' });
                colorButton.addEventListener("click", (event: any) => {
                    event?.stopPropagation?.();
                    event?.stopImmediatePropagation?.();

                    console.log("🎨 Color clicked");

                    // 1. Cycle Data
                    this.currentColorIndex = (this.currentColorIndex + 1) % this.colorOptions.length;
                    const newColor = this.colorOptions[this.currentColorIndex];

                    // 2. Update Component
                    entity.setValue(StickyNote, "color", newColor);

                    // 3. Update Visuals
                    this.updateNoteColor(entity, newColor);

                    console.log("  - New color:", newColor);
                });
                console.log("✅ Color button listener attached");
            } else {
                console.warn("⚠️ Color button not found!");
            }

            if (deleteButton) {
                deleteButton.setProperties({ pointerEvents: 'auto' });
                deleteButton.addEventListener("click", (event: any) => {
                    event?.stopPropagation?.();
                    event?.stopImmediatePropagation?.();

                    this.playDeleteSound();
                    this.triggerHapticFeedback('delete');

                    const linkedRootEntity = entity.object3D?.userData?.rootEntity;

                    if (linkedRootEntity) {
                        try {
                            linkedRootEntity.destroy();
                        } catch (error) {
                            console.error("Failed to destroy root entity:", error);
                            entity.destroy();
                        }
                    } else {
                        entity.destroy();
                    }
                });
            }

            const stickyNote = entity.getValue(StickyNote, "content");
            const color = entity.getValue(StickyNote, "color");
            if (contentInput && stickyNote) {
                // For input elements, use 'value' property (System Keyboard docs)
                contentInput.setProperties({ value: stickyNote });
            }
            if (color) {
                this.updateNoteColor(entity, color);
            }
        });
    }

    update(delta: number) {
        const xrInput = (this.world as any).input;
        if (!xrInput?.gamepads || !this.wallNoteSystem) return;

        const intersection = this.wallNoteSystem.getIntersection();
        if (!intersection) {
            this.logNoIntersection();
            return;
        }

        ['left', 'right'].forEach((handedness) => {
            if (this.shouldSpawnNote(xrInput, handedness as 'left' | 'right')) {
                this.spawnNoteOnWall(xrInput, handedness as 'left' | 'right', intersection);
            }
        });

        this.queries.notes.entities.forEach((entity) => {
            const obj3D = entity.object3D;
            if (!obj3D) return;

            const oneHandGrab = entity.hasComponent(OneHandGrabbable);
            const distanceGrab = entity.hasComponent(DistanceGrabbable);

            if (oneHandGrab || distanceGrab) {
                const isGrabbed = this.isNoteGrabbed(entity);
                const wasGrabbed = this.grabbedNotes.get(entity.index) || false;

                if (isGrabbed && !wasGrabbed) {
                    this.playGrabSound(entity);
                    this.triggerHapticFeedback('grab');
                    this.grabbedNotes.set(entity.index, true);
                } else if (!isGrabbed && wasGrabbed) {
                    this.playReleaseSound(entity);
                    this.triggerHapticFeedback('release');
                    this.grabbedNotes.set(entity.index, false);
                }
            }
        });
    }

    private updateNoteColor(entity: any, color: string) {
        console.log("🎨 updateNoteColor called with color:", color);

        const colorMap: Record<string, string> = {
            [NoteColor.Yellow]: "#fffacd",
            [NoteColor.Blue]: "#add8e6",
            [NoteColor.Green]: "#c8e6c9",
            [NoteColor.Pink]: "#f8bbd0",
            [NoteColor.Purple]: "#e1bee7",
        };
        const hexColor = colorMap[color] || "#fffacd";
        console.log("  - Hex color:", hexColor);

        // 1. Update UI Panel Background
        const document = PanelDocument.data.document[entity.index] as UIKitDocument;
        console.log("  - Document found:", !!document);

        if (document) {
            const container = document.getElementById("note-container");
            console.log("  - Container found:", !!container);

            if (container) {
                container.setProperties({ backgroundColor: hexColor });
                console.log("  ✅ UI background updated");
            } else {
                console.warn("  ⚠️ Container 'note-container' not found!");
            }
        }

        // 2. Update Paper Mesh (The Sibling) - Optional Polish
        const uiObj = entity.object3D;
        const rootObj = uiObj?.parent;
        console.log("  - Root object found:", !!rootObj);

        if (rootObj) {
            const paperMesh = rootObj.children.find((c: any) => c.name === "PaperBackground");
            console.log("  - Paper mesh found:", !!paperMesh);

            if (paperMesh && (paperMesh as any).material) {
                (paperMesh as any).material.color.set(hexColor);
                console.log("  ✅ Paper mesh color updated");
            }
        }
    }

    public createNoteOnWall(position: Vector3, normal: Vector3): any {
        try {
            const rootEntity = this.world
                .createTransformEntity()
                .addComponent(Interactable)
                .addComponent(OneHandGrabbable, {
                    translate: true,
                    rotate: true,
                })
                .addComponent(DistanceGrabbable, {
                    translate: true,
                    rotate: true,
                    scale: false,
                    movementMode: "MoveAtSource",
                });

            if (rootEntity.object3D) {
                rootEntity.object3D.name = "Note_Root";
            }

            const paperGeometry = new PlaneGeometry(0.2, 0.2);
            const paperMaterial = new MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.01,
                side: 2,
            });
            const paperMesh = new Mesh(paperGeometry, paperMaterial);
            paperMesh.name = "PaperBackground";

            // Allow BOTH ray (for clicking) and grab (for moving) pointers
            // Don't deny any pointer type - let parent handle grabbing
            (paperMesh as any).pointerEventsType = undefined;

            console.log("📝 Paper mesh created - allows all pointer types for grabbing");

            const paperBackgroundEntity = this.world.createTransformEntity(paperMesh);

            const uiContainerEntity = this.world
                .createTransformEntity()
                .addComponent(PanelUI, {
                    config: "/ui/sticky-note.json",
                    maxHeight: 0.2,
                    maxWidth: 0.2,
                })
                .addComponent(StickyNote, {
                    content: "write here ...",
                    color: this.colorOptions[this.currentColorIndex],
                    createdAt: Date.now(),
                })
                .addComponent(Interactable);

            this.currentColorIndex = (this.currentColorIndex + 1) % this.colorOptions.length;

            setTimeout(() => {
                if (rootEntity.object3D) {
                    const offsetPosition = position.clone().add(normal.clone().multiplyScalar(0.005));
                    rootEntity.object3D.position.copy(offsetPosition);

                    if (this.wallNoteSystem) {
                        const rotation = this.wallNoteSystem.getWallAlignedRotation(normal);
                        rootEntity.object3D.quaternion.copy(rotation);
                    }

                    rootEntity.object3D.scale.set(1, 1, 1);
                    rootEntity.object3D.visible = true;
                    rootEntity.object3D.frustumCulled = false;
                    rootEntity.object3D.userData.entity = rootEntity;
                    rootEntity.object3D.userData.isNote = true;
                }

                if (paperBackgroundEntity.object3D && rootEntity.object3D) {
                    paperBackgroundEntity.object3D.position.set(0, 0, 0);
                    paperBackgroundEntity.object3D.scale.set(1, 1, 1);
                    paperBackgroundEntity.object3D.visible = true;
                    paperBackgroundEntity.object3D.frustumCulled = false;
                    paperBackgroundEntity.object3D.userData.entity = rootEntity;
                    paperBackgroundEntity.object3D.userData.isNote = true;
                    rootEntity.object3D.add(paperBackgroundEntity.object3D);
                }

                if (uiContainerEntity.object3D && rootEntity.object3D) {
                    uiContainerEntity.object3D.position.set(0, 0, 0.015);
                    uiContainerEntity.object3D.scale.set(1, 1, 1);
                    uiContainerEntity.object3D.visible = true;
                    uiContainerEntity.object3D.frustumCulled = false;
                    uiContainerEntity.object3D.userData.entity = uiContainerEntity;
                    uiContainerEntity.object3D.userData.isNote = true;
                    uiContainerEntity.object3D.userData.rootEntity = rootEntity;

                    // Allow grab pointers to pass through UI to parent
                    (uiContainerEntity.object3D as any).pointerEventsType = undefined;

                    rootEntity.object3D.add(uiContainerEntity.object3D);
                    this.playSpawnColorFlash(uiContainerEntity);
                    console.log("✅ Note created - grabbing enabled on root");
                }

                rootEntity.object3D?.updateMatrix();
                rootEntity.object3D?.updateMatrixWorld(true);
            }, 100);

            return rootEntity;
        } catch (error) {
            console.error("Exception in createNoteOnWall:", error);
            throw error;
        }
    }

    private initAudio() {
        if (!this.player?.head) return;
        this.sounds = new SoundManager(this.player.head);
        this.sounds.load('grab', '/audio/chime.mp3', 0.3);
        this.sounds.load('release', '/audio/chime.mp3', 0.2);
        this.sounds.load('delete', '/audio/chime.mp3', 0.5);
        this.sounds.load('spawn', '/audio/chime.mp3', 0.4);
    }

    private playGrabSound(entity: any) {
        this.sounds?.play('grab');
    }

    private playReleaseSound(entity: any) {
        this.sounds?.play('release');
    }

    private playDeleteSound() {
        this.sounds?.play('delete', true);
    }

    private playSpawnColorFlash(entity: any) {
        if (!entity || !entity.object3D) return;

        const targetColor = entity.getValue(StickyNote, "color") || NoteColor.Yellow;

        const container = entity.object3D.children.find((child: any) =>
            child.name === 'Container' || child.type === 'Container'
        );

        if (!container) return;

        const originalMaterial = (container as any).material;
        if (!originalMaterial || !originalMaterial.color) return;

        const whiteColor = new Color(1, 1, 1);
        const targetRGB = this.getColorRGB(targetColor);
        const targetColorObj = new Color(targetRGB.r, targetRGB.g, targetRGB.b);

        originalMaterial.color.copy(whiteColor);

        const startTime = Date.now();
        const flashDuration = 400;
        const easing = (t: number) => 1 - Math.pow(1 - t, 3);

        const animateFlash = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / flashDuration, 1);
            const easedProgress = easing(progress);

            if (progress < 1) {
                originalMaterial.color.lerpColors(whiteColor, targetColorObj, easedProgress);
                requestAnimationFrame(animateFlash);
            } else {
                this.updateNoteColor(entity, targetColor);
            }
        };

        animateFlash();
    }

    private getColorRGB(color: string): { r: number; g: number; b: number } {
        const colorMap: Record<string, { r: number; g: number; b: number }> = {
            [NoteColor.Yellow]: { r: 1, g: 0.98, b: 0.8 },
            [NoteColor.Blue]: { r: 0.68, g: 0.85, b: 0.9 },
            [NoteColor.Green]: { r: 0.56, g: 0.93, b: 0.56 },
            [NoteColor.Purple]: { r: 0.87, g: 0.63, b: 0.87 },
            [NoteColor.Pink]: { r: 1, g: 0.71, b: 0.76 },
        };
        return colorMap[color] || colorMap[NoteColor.Yellow];
    }

    private isNoteGrabbed(entity: any): boolean {
        if (!entity.object3D) return false;

        let parent = entity.object3D.parent;
        while (parent) {
            if (parent.name?.includes('hand') ||
                parent.name?.includes('grip') ||
                parent.name?.includes('controller')) {
                return true;
            }
            parent = parent.parent;
        }

        return false;
    }

    private triggerHapticFeedback(type: 'grab' | 'release' | 'delete') {
        const xrInput = (this.world as any).input;
        if (!xrInput?.gamepads) return;

        let intensity = 0.3;
        let duration = 50;

        switch (type) {
            case 'grab':
                intensity = 0.6;
                duration = 100;
                break;
            case 'release':
                intensity = 0.3;
                duration = 50;
                break;
            case 'delete':
                intensity = 0.8;
                duration = 150;
                break;
        }

        ['left', 'right'].forEach((handedness) => {
            const gamepad = xrInput.gamepads[handedness as 'left' | 'right'];
            if (!gamepad) return;

            try {
                const hapticActuator = gamepad.getHapticActuator?.(0);
                if (hapticActuator) {
                    hapticActuator.pulse(intensity, duration);
                }
            } catch (e) {
                // Silently fail if haptics not supported
            }
        });
    }

    private shouldSpawnNote(xrInput: any, handedness: 'left' | 'right'): boolean {
        const gamepad = this.getGamepad(xrInput, handedness);
        if (!gamepad) return false;

        const isInputPressed = this.isInputPressed(gamepad, handedness);
        if (!isInputPressed) return false;

        if (this.isHandInteracting(xrInput, handedness)) {
            return false;
        }

        return this.checkCooldown(handedness);
    }

    private getGamepad(xrInput: any, handedness: 'left' | 'right'): any {
        return xrInput.gamepads[handedness];
    }

    private isInputPressed(gamepad: any, handedness: string): boolean {
        if (gamepad.getSelectStart?.()) return true;
        if (gamepad.getSelect?.()) return true;
        if (gamepad.buttons?.[0]?.pressed) return true;
        return false;
    }

    private isHandInteracting(xrInput: any, handedness: 'left' | 'right'): boolean {
        const multiPointer = xrInput.multiPointers?.[handedness];
        return multiPointer?.getRayBusy?.() || false;
    }

    private checkCooldown(handedness: 'left' | 'right'): boolean {
        const currentTime = Date.now();
        const timeSinceLastSpawn = currentTime - this.lastSpawnTime[handedness];
        return timeSinceLastSpawn > this.spawnCooldown;
    }

    private spawnNoteOnWall(xrInput: any, handedness: 'left' | 'right', intersection: any): void {
        const gamepad = xrInput.gamepads[handedness];

        this.triggerHapticFeedback('grab');
        this.createNoteOnWall(intersection.point, intersection.normal);
        this.sounds?.play('spawn');
        this.triggerDoubleHapticPulse(gamepad);
        this.lastSpawnTime[handedness] = Date.now();
    }

    private triggerDoubleHapticPulse(gamepad: any): void {
        try {
            const hapticActuator = gamepad.getHapticActuator?.(0);
            if (hapticActuator) {
                hapticActuator.pulse(0.7, 80);
                setTimeout(() => {
                    hapticActuator.pulse(0.5, 60);
                }, 100);
            }
        } catch (e) {
            console.warn("Confirmation haptic failed:", e);
        }
    }

    private logNoIntersection(): void {
        const currentTime = Date.now();
        const frameLog = Math.floor(currentTime / 1000);
        if (frameLog !== (this as any)._lastNoIntersectionLog) {
            (this as any)._lastNoIntersectionLog = frameLog;
        }
    }

    // Approach 1: Create hidden DOM input for system keyboard
    private createHiddenInput(): void {
        // Try textarea instead of input - might show text better in keyboard
        this.hiddenInput = document.createElement('textarea');
        // textarea doesn't have 'type' property like input does

        // Make it hidden off-screen
        this.hiddenInput.style.position = 'absolute';
        this.hiddenInput.style.left = '-9999px';
        this.hiddenInput.style.top = '-9999px';
        this.hiddenInput.style.width = '100px';
        this.hiddenInput.style.height = '50px';
        this.hiddenInput.style.opacity = '0';

        // Make sure it's not disabled or readonly
        this.hiddenInput.disabled = false;
        this.hiddenInput.readOnly = false;
        this.hiddenInput.autocomplete = 'off';

        document.body.appendChild(this.hiddenInput);
        console.log("✅ Input created - VISIBLE in bottom-left corner for debugging");

        // System Keyboard docs: Use oninput property (line 56)
        this.hiddenInput.oninput = () => {
            console.log("📝 oninput fired!");
            this.updateTextFromInput();
        };

        // Also try addEventListener as backup
        this.hiddenInput.addEventListener('input', () => {
            console.log("📝 addEventListener input fired!");
            this.updateTextFromInput();
        });

        // Try change event
        this.hiddenInput.addEventListener('change', () => {
            console.log("📝 change event fired!");
            this.updateTextFromInput();
        });

        // Save when keyboard dismissed
        this.hiddenInput.addEventListener('blur', () => {
            const timeSinceOpen = Date.now() - this.keyboardOpenTime;
            console.log("💾 Blur event fired!");
            console.log("  - Time since open:", timeSinceOpen, "ms");

            // IGNORE blur events that happen too quickly (< 500ms)
            // These are likely caused by XR session state changes, not real keyboard dismissal
            if (timeSinceOpen < 500) {
                console.log("  ⚠️ IGNORING - Blur too quick! Refocusing...");

                // Refocus after a short delay
                setTimeout(() => {
                    if (this.hiddenInput && this.currentEditingEntity) {
                        console.log("  🔄 Refocusing input...");
                        this.hiddenInput.focus();
                    }
                }, 100);
                return;
            }

            console.log("  ✅ Real keyboard dismissal - saving");

            // Stop polling
            if (this.pollInterval !== null) {
                clearInterval(this.pollInterval);
                this.pollInterval = null;
            }

            if (this.currentEditingEntity && this.hiddenInput) {
                // Use the stored original text from when keyboard opened
                const newInput = this.hiddenInput.value || "";
                const originalText = this.originalTextAtKeyboardOpen;

                let finalText = originalText;
                if (newInput.trim()) {
                    // Append new input to the original text we stored at open time
                    const baseText = (originalText && originalText !== "write here ...") ? originalText : "";
                    finalText = baseText + newInput;
                }

                console.log("  - Original text (at open):", originalText);
                console.log("  - New input:", newInput);
                console.log("  - Final text:", finalText);
                console.log("  - Entity:", this.currentEditingEntity.index);

                this.currentEditingEntity.setValue(StickyNote, "content", finalText);
                console.log("  - Component saved");
                console.log("  - Text length:", finalText.length, "characters");

                // Update UI one last time
                const document = PanelDocument.data.document[this.currentEditingEntity.index] as UIKitDocument;
                const contentInput = document?.getElementById("note-content");
                if (contentInput) {
                    contentInput.setProperties({ value: finalText });
                }

                this.currentEditingEntity = null;
            }
        });

        console.log("✅ Hidden input created");
    }

    private openKeyboardForNote(entity: any): void {
        if (!this.hiddenInput) {
            console.error("❌ Hidden input not found!");
            return;
        }

        // Stop any existing polling and reset state
        if (this.pollInterval !== null) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }

        // Reset state from previous editing session
        this.lastKnownValue = "";
        this.currentEditingEntity = entity;
        const currentText = entity.getValue(StickyNote, "content") || "write here ...";

        // CRITICAL: Store original text NOW, before any keyboard interaction
        this.originalTextAtKeyboardOpen = currentText;

        console.log("⌨️ Opening keyboard in APPEND mode...");
        console.log("  - Entity:", entity.index);
        console.log("  - Current text:", currentText);
        console.log("  - Stored original for appending:", this.originalTextAtKeyboardOpen);
        console.log("  - Previous state cleared");

        // Show current text in VR first, then open keyboard for appending
        console.log("  - Showing current text in VR first...");
        this.showTextPreviewInVR(entity, currentText);

        // Track when keyboard opens (to ignore quick blurs)
        this.keyboardOpenTime = Date.now();

        // Open keyboard after delay so user can read current text
        setTimeout(() => {
            if (!this.hiddenInput) return;

            console.log("  - Now opening keyboard for APPEND mode...");

            // CRITICAL: Due to WebXR limitations, start with empty input
            // We'll append the new text to the original text when input changes
            this.hiddenInput.value = "";

            // Focus to open keyboard
            this.hiddenInput.focus();
            console.log("  - ✅ Keyboard opened - user can now type to append");

        }, 0); // Open keyboard immediately

        // MODIFIED POLLING: Detect new input and append it to original text
        console.log("🔄 Starting append-aware polling");
        let pollCount = 0;
        this.pollInterval = window.setInterval(() => {
            pollCount++;
            const currentValue = this.hiddenInput?.value || "";

            // Log every 10 polls to show it's running
            if (pollCount % 10 === 0) {
                console.log(`🔄 Poll #${pollCount}: new input = "${currentValue}"`);
            }

            if (this.hiddenInput && currentValue !== this.lastKnownValue) {
                console.log("🔄 ✅ NEW INPUT DETECTED!");
                console.log("  - New input:", currentValue);

                // Append new input to the stored original text
                const originalText = (this.originalTextAtKeyboardOpen && this.originalTextAtKeyboardOpen !== "write here ...")
                    ? this.originalTextAtKeyboardOpen : "";
                const appendedText = originalText + currentValue;

                console.log("  - Original text (stored at open):", originalText);
                console.log("  - Final appended:", appendedText);

                this.lastKnownValue = currentValue;
                this.updateTextFromInputAppend(appendedText);
            }
        }, 100); // Check every 100ms

        console.log("✅ Keyboard opened for appending, polling started");
    }

    private updateTextFromInput(): void {
        if (!this.currentEditingEntity || !this.hiddenInput) {
            console.warn("  - No editing entity or hidden input!");
            return;
        }

        const newText = this.hiddenInput.value;
        console.log("  - New text:", newText);
        console.log("  - Entity:", this.currentEditingEntity.index);

        // Update component
        this.currentEditingEntity.setValue(StickyNote, "content", newText);
        console.log("  - Component updated");

        // Update UI display
        const document = PanelDocument.data.document[this.currentEditingEntity.index] as UIKitDocument;
        const contentInput = document?.getElementById("note-content");
        if (contentInput) {
            contentInput.setProperties({ value: newText });
            console.log("  - UI display updated");
        } else {
            console.warn("  - Content input not found for UI update!");
        }
    }

    private updateTextFromInputAppend(finalText: string): void {
        if (!this.currentEditingEntity || !this.hiddenInput) {
            console.warn("  - No editing entity or hidden input!");
            return;
        }

        console.log("  - Final appended text:", finalText);
        console.log("  - Entity:", this.currentEditingEntity.index);

        // Update component
        this.currentEditingEntity.setValue(StickyNote, "content", finalText);
        console.log("  - Component updated with appended text");

        // Update UI display
        const document = PanelDocument.data.document[this.currentEditingEntity.index] as UIKitDocument;
        const contentInput = document?.getElementById("note-content");
        if (contentInput) {
            contentInput.setProperties({ value: finalText });
            console.log("  - UI display updated with appended text");
        } else {
            console.warn("  - Content input not found for UI update!");
        }
    }

    private showTextPreviewInVR(entity: any, text: string): void {
        console.log("📺 Showing text preview in VR:", text);

        // Update the note's UI to show current text with a highlight/border effect
        const document = PanelDocument.data.document[entity.index] as UIKitDocument;
        if (!document) return;

        const contentInput = document.getElementById("note-content");
        const container = document.getElementById("note-container");

        if (contentInput) {
            // Show the current text with append mode indicator
            contentInput.setProperties({
                value: text,
                placeholder: "Write your notes here..."
            });
        }

        if (container) {
            // Add a visual indicator that editing is about to start
            const currentColor = entity.getValue(StickyNote, "color") || NoteColor.Yellow;
            const colorMap: Record<string, string> = {
                [NoteColor.Yellow]: "#fff8dc", // Slightly brighter yellow
                [NoteColor.Blue]: "#b8e6ff",   // Slightly brighter blue  
                [NoteColor.Green]: "#d4f4d6",  // Slightly brighter green
                [NoteColor.Pink]: "#ffccd7",   // Slightly brighter pink
                [NoteColor.Purple]: "#e8ccf0", // Slightly brighter purple
            };

            const highlightColor = colorMap[currentColor] || "#fff8dc";
            container.setProperties({
                backgroundColor: highlightColor,
                border: "2px solid #00ff00"  // Green append mode border
            });

            // Remove the editing border after the delay
            setTimeout(() => {
                const normalColorMap: Record<string, string> = {
                    [NoteColor.Yellow]: "#fffacd",
                    [NoteColor.Blue]: "#add8e6",
                    [NoteColor.Green]: "#c8e6c9",
                    [NoteColor.Pink]: "#f8bbd0",
                    [NoteColor.Purple]: "#e1bee7",
                };
                const normalColor = normalColorMap[currentColor] || "#fffacd";
                container.setProperties({
                    backgroundColor: normalColor,
                    border: "none"
                });
            }, 400); // Just after keyboard opens
        }
    }
}
