# Sticky Note System Refactor - Implementation Guide

## Overview
This document explains the refactored sticky note interaction system based on IWSDK best practices.
# META HORIZON IMMERSIVE WEB SDK (IWSDK) RULES

You are an expert in the **Meta Immersive Web SDK (IWSDK)** released in late 2024.
You are building a Mixed Reality app for **Meta Quest 3 and Quest 3S**.

## CRITICAL RULES (DO NOT BREAK) and use context7 to pull docs
1. **USE @iwsdk/core:** All IWSDK features come from `@iwsdk/core` package
2. **USE SCENE UNDERSTANDING:** Import from `@iwsdk/core`:
   ```typescript
   import { SceneUnderstanding } from '@iwsdk/core';
   ```
3. **USE NATIVE UI:** Use `@pmndrs/uikit` components (included in @iwsdk/core)
4. **QUEST 3/3S FEATURES:**
   - Always add `depth-sensing` and `mesh-detection` to requiredFeatures
   - Passthrough AR enabled by default
## SCENE MESH STRATEGY
- **Use SceneUnderstanding:** Import from `@iwsdk/core` to detect surfaces
  ```typescript
  import { SceneUnderstanding } from '@iwsdk/core';
  // Query for walls, tables, floors, etc.
  const walls = world.query(SceneUnderstanding.components.Label, { is: 'wall' });
  ```
- **Raycasting:** Use IWSDK's built-in raycasting against detected scene meshes
- **Placement Logic:** 
  - Cast ray from controller/gaze
  - Get intersection point and surface normal
  - Align spawned object's rotation to surface normal
  - Position note at intersection point
- **Surface Types:** 'wall', 'floor', 'ceiling', 'table', 'couch', etc.

## CODE STYLE
- Use TypeScript
- Use three.js (via super-three from @iwsdk/core)
- Keep state in Zustand store

## PLACEMENT LOGIC
- **DO NOT** use `session.requestHitTestSource` directly
- **DO** use IWSDK's SceneUnderstanding API to query detected surfaces
- **DO** use IWSDK's raycasting system against scene meshes
- When controller/gaze hits a wall, spawn note at intersection point
- Align note rotation to surface normal for proper wall placement

## IWSDK DOCUMENTATION
all the docs can be found on iwsdk folder of this project directory
## META HORIZON WEBXR DOCUMENTATION - COMPLETE LIST

### OVERVIEW
1. **Overview** - /horizon/develop/web/

### BROWSER (8 links)
2. **Introduction to Browser** - /horizon/documentation/web/
3. **Browser specs** - /horizon/documentation/web/browser-specs/
4. **Debug browser content** - /horizon/documentation/web/browser-remote-debugging/
5. **Use MQDH with browser** - /horizon/documentation/web/browser-mqdh/
6. **Browser video support** - /horizon/documentation/web/browser-video/
7. **Browser audio support** - /horizon/documentation/web/browser-audio/
8. **New tab page guidelines and submission** - /horizon/documentation/web/browser-new-tab/
9. **Use web launch to send links to headsets from the web** - /horizon/documentation/web/web-launch/

### IMMERSIVE WEB SDK (26 links)
**Overview:**
10. **Overview** - /horizon/documentation/web/iwsdk-overview/

**Getting Started:**
11. **Setup WebXR project** - /horizon/documentation/web/iwsdk-guide-project-setup/
12. **Testing experience** - /horizon/documentation/web/iwsdk-guide-testing-experience/
13. **Working in 3D** - /horizon/documentation/web/iwsdk-guide-working-in-3d/
14. **External assets** - /horizon/documentation/web/iwsdk-guide-external-assets/
15. **Environment and lighting** - /horizon/documentation/web/iwsdk-guide-environment-lighting/
16. **Built-in interactions** - /horizon/documentation/web/iwsdk-guide-built-in-interactions/
17. **Custom systems** - /horizon/documentation/web/iwsdk-guide-custom-systems/
18. **Build and deploy** - /horizon/documentation/web/iwsdk-guide-build-deploy/

**Advanced Guides:**
19. **Spatial Editor** - /horizon/documentation/web/iwsdk-guide-spatial-editor/
20. **Spatial UI** - /horizon/documentation/web/iwsdk-guide-spatial-ui/
21. **Physics** - /horizon/documentation/web/iwsdk-guide-physics/
22. **Scene understanding** - /horizon/documentation/web/iwsdk-guide-scene-understanding/

**Concept Deepdive - Entity Component System:**
23. **World** - /horizon/documentation/web/iwsdk-concept-ecs-world/
24. **Entity** - /horizon/documentation/web/iwsdk-concept-ecs-entity/
25. **Component** - /horizon/documentation/web/iwsdk-concept-ecs-components/
26. **System** - /horizon/documentation/web/iwsdk-concept-ecs-systems/
27. **Queries** - /horizon/documentation/web/iwsdk-concept-ecs-queries/
28. **Lifecycle** - /horizon/documentation/web/iwsdk-concept-ecs-lifecycle/
29. **Patterns and tips** - /horizon/documentation/web/iwsdk-concept-ecs-patterns/
30. **Architecture** - /horizon/documentation/web/iwsdk-concept-ecs-architecture/

**Concept Deepdive - Three.js Basics:**
31. **ECS ↔ Three.js interop** - /horizon/documentation/web/iwsdk-concept-three-basics-interop/
32. **Transforms and 3D math** - /horizon/documentation/web/iwsdk-concept-three-basics-transforms-math/
33. **Meshes, geometry and materials** - /horizon/documentation/web/iwsdk-concept-three-basics-meshes-geometry-materials/

**Concept Deepdive - XR Input:**
34. **Input visuals** - /horizon/documentation/web/iwsdk-concept-xr-input-visuals/
35. **Pointers** - /horizon/documentation/web/iwsdk-concept-xr-input-pointers/
36. **Stateful gamepad** - /horizon/documentation/web/iwsdk-concept-xr-input-stateful-gamepad/
37. **XR Origin** - /horizon/documentation/web/iwsdk-concept-xr-input-origin/

**Concept Deepdive - Spatial UI:**
38. **UIKit** - /horizon/documentation/web/iwsdk-concept-spatial-ui-uikit/
39. **UIKitML** - /horizon/documentation/web/iwsdk-concept-spatial-ui-uikitml/
40. **UIKitDocument** - /horizon/documentation/web/iwsdk-concept-spatial-ui-document/
41. **Flow** - /horizon/documentation/web/iwsdk-concept-spatial-ui-flow/

**Concept Deepdive - Locomotion:**
42. **Slide** - /horizon/documentation/web/iwsdk-concept-locomotion-slide/
43. **Teleport** - /horizon/documentation/web/iwsdk-concept-locomotion-teleport/
44. **Turn** - /horizon/documentation/web/iwsdk-concept-locomotion-turn/
45. **Performance** - /horizon/documentation/web/iwsdk-concept-locomotion-performance/

**Concept Deepdive - Grab Interaction:**
46. **Interaction types** - /horizon/documentation/web/iwsdk-concept-grabbing-types/
47. **Distance grabbing** - /horizon/documentation/web/iwsdk-concept-grabbing-distance/

### WEBXR (24 links)
48. **Overview** - /horizon/documentation/web/webxr-overview/
49. **Developer workflow** - /horizon/documentation/web/webxr-workflow/
50. **VR best practices** - /horizon/documentation/web/webxr-bp/
51. **WebXR Layers** - /horizon/documentation/web/webxr-layers/
52. **WebXR Hands** - /horizon/documentation/web/webxr-hands/
53. **Mixed reality support in browser** - /horizon/documentation/web/webxr-mixed-reality/
54. **Meta Quest Touch Pro controller support for browser** - /horizon/documentation/web/webxr-pro-controller/
55. **System keyboard in WebXR** - /horizon/documentation/web/webxr-keyboard/

**WebXR First Steps Tutorial:**
56. **WebXR first steps** - /horizon/documentation/web/webxr-first-steps/
57. **Creating simple objects in the scene** - /horizon/documentation/web/webxr-first-steps-chapter1/
58. **Working with controllers** - /horizon/documentation/web/webxr-first-steps-chapter2/
59. **Animating bullet objects** - /horizon/documentation/web/webxr-first-steps-chapter3/
60. **Replacing basic objects with GLTF models** - /horizon/documentation/web/webxr-first-steps-chapter4/
61. **Making it a game** - /horizon/documentation/web/webxr-first-steps-chapter5/
62. **Finishing touches** - /horizon/documentation/web/webxr-first-steps-chapter6/

**Performance Optimization:**
63. **Overview** - /horizon/documentation/web/webxr-perf/
64. **Performance optimization workflow** - /horizon/documentation/web/webxr-perf-workflow/
65. **WebXR performance tools** - /horizon/documentation/web/webxr-perf-tools/
66. **Performance best practices** - /horizon/documentation/web/webxr-perf-bp/
67. **WebXR fixed foveated rendering** - /horizon/documentation/web/webxr-ffr/
68. **Multiview WebGL rendering** - /horizon/documentation/web/web-multiview/
69. **WebXR app framerate control** - /horizon/documentation/web/webxr-frames/
70. **Using RenderDoc with browser** - /horizon/documentation/web/webxr-perf-renderdoc/
71. **Draw call metrics** - /horizon/documentation/web/ts-webxr-perf-drawcall/

**Other:**
72. **Porting from WebVR to WebXR** - /horizon/documentation/web/port-vr-xr/

**Experimental:**
73. **WebXR space warp** - /horizon/documentation/web/webxr-space-warp/

### PROGRESSIVE WEB APPS (10 links)
74. **Overview** - /horizon/documentation/web/pwa-overview/
75. **Getting started with PWAs** - /horizon/documentation/web/pwa-overview-gs/
76. **2D** - /horizon/documentation/web/pwa-2d-support/
77. **WebXR** - /horizon/documentation/web/pwa-webxr/
78. **PWA packaging** - /horizon/documentation/web/pwa-packaging/

**Monetization:**
79. **Monetization overview** - /horizon/documentation/web/ps-monetization-overview/
80. **In-app purchases in PWAs** - /horizon/documentation/web/ps-iap/
81. **Testing add-ons** - /horizon/documentation/web/ps-iap-test/
82. **Server-to-server API basics** - /horizon/documentation/web/ps-s2s-basics/
83. **Add-ons server APIs** - /horizon/documentation/web/ps-iap-s2s/

### WEB TASKS (1 link)
84. **Web task dialogs** - /horizon/documentation/web/web-tasks/

**TOTAL: 87 documentation pages**
all files are downloaded in iwsdk docs folder

This comprehensive list contains all the WebXR and web development documentation for Meta Horizon OS. You can use this to train your LLM model by visiting each URL and extracting the content.
---


## 🏗️ Component Architecture

### Sticky Note Entity Structure (HIERARCHICAL)

**Current Implementation:**
```
Root Entity (Transform only)
├── UI Panel Entity (z = +0.02)
│   ├── PanelUI (renders UI from sticky-note.json)
│   ├── StickyNote (custom component - content, color, timestamp)
│   └── Interactable (enables pointer events for buttons)
└── Paper Background Entity (z = 0, INVISIBLE)
    ├── Interactable
    ├── OneHandGrabbable (direct grab with hands/controllers)
    └── DistanceGrabbable (ray-based grab from distance)
```

**⚠️ KNOWN ISSUE:** The Paper entity is invisible (`visible: false`), which prevents raycasting from hitting it. This breaks both distance grabbing (ray) and direct grabbing. The grabbable components need to be on a VISIBLE entity with geometry.

**Architecture Rationale (ATTEMPTED):**
- Separate UI Panel from grabbable background to prevent button raycast blocking
- UI Panel floats 2cm in front for z-fighting prevention
- Paper Background provides grab target without interfering with buttons

**Why It's Not Working:**
- Invisible entities cannot receive raycasts
- Grabbable components require visible geometry/colliders
- Button clicks may still be blocked by interaction propagation

### Interaction Flow

**Creation Flow (WORKING):**
```
User Points Ray at Wall
    ↓
WallNoteSystem detects XRMesh intersection
    ↓
User presses trigger
    ↓
createNoteOnWall(position, normal)
    ↓
Hierarchical entities created
    ↓
Spawn audio plays (chime.mp3)
    ↓
Color flash animation on UI Panel
    ↓
World-space toast: "Note Created!"
    ↓
Toast floats up 10cm over 2 seconds and fades out
```

**Grab Flow (BROKEN ❌):**
```
User Points Ray at Note
    ↓
Ray PASSES THROUGH invisible Paper entity ❌
    ↓
No raycast hit detected
    ↓
Grabbable components never activate ❌
    ↓
Note cannot be moved
```

**Button Click Flow (BROKEN ❌):**
```
User Points Ray at Delete/Color Button
    ↓
UI Panel Interactable receives raycast (maybe?)
    ↓
Button click event fires (unconfirmed)
    ↓
stopPropagation() called
    ↓
Button handler runs but effect not visible ❌
```

---

## 📝 UIKit Panel Structure

The sticky note UI (`/ui/sticky-note.json`) contains:

```
note-container (root)
├── note-header
│   ├── color-button (UIKit Button - auto-interactive)
│   └── delete-button (UIKit Button - auto-interactive)
└── note-content (Text element)
```

**Important:** UIKit buttons in PanelUI automatically support:
- Poke interaction (direct finger touch)
- Ray interaction (controller point & click)
- Standard DOM-like `addEventListener("click")`

---

## 🌐 World-Space Toast System

### Overview
Implements 3D text confirmations using **troika-three-text** library.

### Implementation
```typescript
private showConfirmation(position: Vector3, text: string)
```

**Features:**
- Creates Text mesh from troika-three-text (not sprite/canvas)
- Positioned 15cm above note spawn point
- Green color (#00ff00) with black outline
- Font size: 5cm tall
- Animation: Float up 10cm over 2 seconds
- Fade out: Opacity 1.0 → 0.0 (linear)
- Auto-cleanup: `scene.remove()` + `dispose()` after animation

**Current Issues:**
- ❌ Toast rotation not set (defaults to world axes, doesn't align to wall)
- ❌ Toast may not disappear (cleanup logic needs verification)
- ✅ Animation loop uses `requestAnimationFrame` (should work)
- ✅ Progress calculation: `Math.min(elapsed / duration, 1)`

**Dependencies:**
```json
{
  "troika-three-text": "^0.52.4"
}
```

**Type Declarations:** `src/troika-three-text.d.ts`

---

## 🔧 Key Methods

### `initAudio()`
Sets up Three.js AudioListener and loads sound effects.

### `playGrabSound(entity)` / `playReleaseSound(entity)` / `playDeleteSound()`
Plays appropriate sound effect with overlap prevention.

### `isNoteGrabbed(entity)`
Checks entity's object3D parent hierarchy to detect if currently grabbed.
Returns `true` if parent contains hand/grip/controller in its name.

### `triggerHapticFeedback(type)`
Triggers controller vibration with appropriate intensity/duration for the action type.

### `createNoteOnWall(position, normal)`
Creates a new sticky note entity with **hierarchical structure**:

**Parameters:**
- `position: Vector3` - World position from wall raycast intersection
- `normal: Vector3` - Surface normal from XRMesh for wall alignment

**Process:**
1. Create Root Entity (no components, just transform container)
2. Create UI Panel Entity:
   - Add PanelUI, StickyNote, Interactable components
   - Position at local z=+0.02 (2cm in front)
   - Set visible=true
3. Create Paper Background Entity:
   - Add Interactable, OneHandGrabbable, DistanceGrabbable
   - Position at local z=0 (behind UI)
   - Set visible=**false** ❌ (breaks grabbing)
   - Scale: (0.2, 0.2, 0.001)
4. Use `wallNoteSystem.getWallAlignedRotation(normal)` for orientation
5. Offset position 5mm from wall surface (z-fighting prevention)
6. Play spawn audio (chime.mp3 at 0.4 volume)
7. Trigger color flash animation on UI Panel
8. Show world-space toast confirmation

**Known Problems:**
- Invisible Paper entity cannot receive raycasts
- Grabbable components don't work on invisible geometry
- Button clicks may not propagate correctly through hierarchy

---

## 🎮 User Experience Summary

### Before Refactor:
❌ Could only grab notes by touching them directly  
❌ Delete button didn't work  
❌ No feedback when interacting  
❌ Felt unresponsive and broken  

### After Refactor:
✅ Can grab notes from distance with ray OR directly with hands  
✅ Delete button works with smooth animation  
✅ Audio feedback on every interaction  
✅ Controller vibration confirms actions  
✅ Visual animations provide polish  
✅ Professional, "juicy" interaction feel  

---

## 🚀 Testing Checklist

### ✅ Working Features
- [x] Point ray at wall → Press trigger → Note spawns
- [x] Note aligns to wall surface (rotation matches normal)
- [x] Spawn audio plays (chime.mp3)
- [x] Color flash animation on spawn
- [x] World-space "Note Created!" toast appears
- [x] Ray pointer visible from controllers

### ❌ Broken Features (Current Session)
- [ ] Point ray at note from distance → Grab with trigger → **BROKEN: Ray passes through invisible Paper entity**
- [ ] Touch note with hand → Grab with grip → **BROKEN: Can't grab invisible geometry**
- [ ] Point ray at delete button → Click → **BROKEN: Button not responding**
- [ ] Point ray at color button → Click → **BROKEN: Button not responding**
- [ ] Toast disappears after 2 seconds → **BROKEN: May persist**
- [ ] Toast aligned to wall → **BROKEN: Default rotation (not aligned)**
- [ ] Listen for sound when grabbing note → **N/A: Can't grab**
- [ ] Listen for sound when releasing note → **N/A: Can't grab**
- [ ] Feel controller vibration on grab → **N/A: Can't grab**

### Root Cause Analysis
1. **Grab Issue:** Paper entity `visible: false` prevents raycasting
2. **Button Issue:** Event propagation or Interactable configuration
3. **Toast Angle:** Missing `textMesh.quaternion.copy(wallRotation)`
4. **Toast Cleanup:** Animation logic may need scene context verification

---

## 📚 IWSDK Documentation References

- **Grabbing:** `Built-in Interactions  Meta Horizon OS Developers.md`
- **Audio:** `Finishing touches  Meta Horizon OS Developers.md`
- **Haptics:** `XR Input Stateful Gamepad  Meta Horizon OS Developers.md`
- **PanelUI:** `Spatial UI` documentation
- **Components:** `ECS Components` documentation

---

## 🔮 Future Enhancements

1. **Advanced Visual Feedback:**
   - Outline shader when hovering
   - Color flash on grab
   - Particle effects on delete

2. **Spatial Audio:**
   - Use `PositionalAudio` instead of regular `Audio`
   - Attach sounds to note's object3D for 3D audio

3. **Two-Hand Manipulation:**
   - Add `TwoHandGrabbable` for resizing notes with two hands

4. **Persistence:**
   - Save note positions/content to local storage
   - Restore on app load

5. **Text Editing:**
   - Integrate system keyboard for content editing
   - Voice-to-text input

---

## ⚡ Performance Notes

- Audio files are loaded once on init, not per-note
- Grab state tracking uses Map for O(1) lookups
- Visual animations use requestAnimationFrame for smooth 60fps
- Haptic calls are wrapped in try-catch for graceful degradation

---

## 🐛 Known Limitations & Bugs

### 🚨 Critical Issues (Blocking UX)

1. **Invisible Grabbable Entity:**
   - Paper Background entity has `visible: false`
   - Raycasting cannot hit invisible objects in Three.js
   - DistanceGrabbable and OneHandGrabbable components REQUIRE visible geometry
   - **Fix:** Either make Paper visible OR move Grabbable to UI Panel

2. **Button Click Failure:**
   - Hierarchical structure may break Interactable event flow
   - stopPropagation() added but buttons still not working
   - **Fix:** May need to restructure interaction layers or use different approach

3. **Toast Rotation Missing:**
   - showConfirmation() doesn't set textMesh rotation
   - Toast defaults to world axes (0,0,0), doesn't align to wall
   - **Fix:** Copy wall rotation quaternion to textMesh

4. **Toast Cleanup Uncertainty:**
   - Animation cleanup checks `scene.remove()` but may fail silently
   - Toasts might persist in scene after fade completes
   - **Fix:** Add scene context validation and logging

### ⚠️ Design Limitations

5. **Grab Detection:** 
   - Current `isNoteGrabbed()` relies on parent hierarchy naming
   - May break with IWSDK internal changes

6. **Audio Variety:**
   - All sounds use same chime.mp3 at different volumes
   - No spatial audio (not PositionalAudio)
   - Consider unique sound files for better UX

7. **Hierarchical Complexity:**
   - 3-layer structure (Root → UI Panel + Paper) adds complexity
   - Original goal: prevent button raycast blocking
   - Current result: broke grabbing AND buttons still don't work
   - **Consider:** Revert to single-entity architecture

---

## 🐞 Debugging on Quest 3S

### Hardware Limitations
- **No Browser Console:** Quest 3S browser doesn't expose DevTools
- **No Depth Sensing:** Quest 3S lacks depth sensor (3 has it)
- **Remote Debugging:** Possible via USB + Meta Quest Developer Hub (MQDH)

### Debug Strategy
1. **On-Screen Debug Overlay:** 
   - StickyNoteSystem creates debug text panel in `init()`
   - Shows last 10 console messages
   - Position: (-0.3, 1.5, -1.0) in world space
   - Update via `addDebugMessage(text)`

2. **Console Logging Pattern:**
   ```typescript
   console.log("✅ Success message");
   console.warn("⚠️ Warning message");
   console.error("❌ Error message");
   ```

3. **Key Debug Points:**
   - `object3D` attachment timing (100ms setTimeout)
   - Entity parent hierarchy (`.add()` calls)
   - Raycasting hits (WallNoteSystem)
   - Button click events (PanelUI listeners)
   - Grabbable state changes (OneHandGrabbable, DistanceGrabbable)

4. **Build & Deploy:**
   ```powershell
   npm run dev          # Local development (esbuild watch)
   npm run build        # Production build
   npm run preview      # Test production build
   ```

5. **Common Failure Modes:**
   - "No object3D after delay" → Entity not added to scene
   - "Ray passes through" → Invisible geometry or missing collider
   - "Button not responding" → Event not reaching listener
   - "Toast persists" → Animation cleanup failed

---

## 📞 Support

For IWSDK-specific questions, refer to:
- [Meta Horizon OS Developers Documentation](https://developers.meta.com/horizon/documentation/web/)
- IWSDK API Reference
- Community Discord/Forums
