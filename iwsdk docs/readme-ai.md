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
I've collected all the documentation links from the Meta Horizon WebXR development page. Here's the complete list of **74 documentation links** organized by category:

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