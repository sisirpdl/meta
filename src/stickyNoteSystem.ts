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

    init() {
        this.wallNoteSystem = this.world.getSystem(WallNoteSystem) || null;
        this.initAudio();

        this.queries.notes.subscribe("qualify", (entity) => {
            console.log("New note entity:", entity.index);
        });

        this.queries.notes.subscribe("disqualify", (entity) => {
            console.log("Note entity removed:", entity.index);
        });

        this.queries.notePanels.subscribe("qualify", (entity) => {
            const document = PanelDocument.data.document[entity.index] as UIKitDocument;
            if (!document) return;

            const contentInput = document.getElementById("note-content") as UIKit.Text;
            const colorButton = document.getElementById("color-button");
            const deleteButton = document.getElementById("delete-button");

            const obj3D = entity.object3D;
            if (obj3D) {
                obj3D.userData.confirmingDelete = false;
                obj3D.userData.originalText = entity.getValue(StickyNote, "content") || "New Note";
            }

            if (colorButton) {
                colorButton.setProperties({ pointerEvents: 'auto' });
                colorButton.addEventListener("click", (event: any) => {
                    event?.stopPropagation?.();
                    event?.stopImmediatePropagation?.();

                    this.currentColorIndex = (this.currentColorIndex + 1) % this.colorOptions.length;
                    const newColor = this.colorOptions[this.currentColorIndex];
                    entity.setValue(StickyNote, "color", newColor);
                    this.updateNoteColor(entity, newColor);
                });
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
                contentInput.setProperties({ text: stickyNote });
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
        const colorMap: Record<string, string> = {
            [NoteColor.Yellow]: "#fffacd",
            [NoteColor.Blue]: "#add8e6",
            [NoteColor.Green]: "#c8e6c9",
            [NoteColor.Pink]: "#f8bbd0",
            [NoteColor.Purple]: "#e1bee7",
        };
        const hexColor = colorMap[color] || "#fffacd";

        const document = PanelDocument.data.document[entity.index] as UIKitDocument;
        if (document) {
            const container = document.getElementById("note-container");
            if (container) {
                container.setProperties({ backgroundColor: hexColor });
            } else if (document.root) {
                document.root.setProperties({ backgroundColor: hexColor });
            }
        }

        const uiObj = entity.object3D;
        const rootObj = uiObj?.parent;
        if (rootObj) {
            const paperMesh = rootObj.children.find((c: any) => c.name === "PaperBackground");
            if (paperMesh && (paperMesh as any).material) {
                (paperMesh as any).material.color.set(hexColor);
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

            const paperBackgroundEntity = this.world.createTransformEntity(paperMesh);

            const uiContainerEntity = this.world
                .createTransformEntity()
                .addComponent(PanelUI, {
                    config: "/ui/sticky-note.json",
                    maxHeight: 0.2,
                    maxWidth: 0.2,
                })
                .addComponent(StickyNote, {
                    content: "New Note",
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
                    rootEntity.object3D.add(uiContainerEntity.object3D);
                    this.playSpawnColorFlash(uiContainerEntity);
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
}
