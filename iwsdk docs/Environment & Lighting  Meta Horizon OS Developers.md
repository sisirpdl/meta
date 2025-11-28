Now that you can create objects and load external assets, it’s time to make your WebXR experience look professional with environment and lighting. This topic introduces Components and Systems, the building blocks of IWSDK’s architecture, while showing you how to create beautiful, realistic lighting for your scenes.

## ECS refresher: Components and Systems

You’ve already worked with **entities** using `world.createTransformEntity()`. Now you’ll use components and systems for the first time.

**Components** are data you attach to entities (like “this entity has lighting” or “this entity is grabbable”). **Systems** automatically handle entities with specific components (like “apply lighting to all lit entities”).

The pattern is simple: add components to entities, let systems handle the behavior automatically.

For a comprehensive understanding of IWSDK’s Entity Component System architecture, see [ECS Concepts](https://developers.meta.com/horizon/documentation/web/iwsdk-concept-ecs/).

## Set up lighting

IWSDK uses Image-Based Lighting (IBL) as the default lighting approach. This provides realistic lighting by using environment images to illuminate your entire scene, creating natural-looking reflections and ambient lighting that makes materials appear convincing.

Environment lighting components get attached to the level root entity. Think of it as the main container for your scene.

```
const levelRoot = world.activeLevel.value;
```

### IBL lighting options

Built-in Room Environment (easiest option):

```
const levelRoot = world.activeLevel.value;

levelRoot.addComponent(IBLTexture, {
  src: 'room', // Built-in room environment
  intensity: 1.2, // Slightly brighter than default
});
```

Custom HDR Lighting (for specific moods):

```
// Add HDR to your asset manifest
const assets = {
  sunsetHDR: {
    url: '/hdr/sunset_4k.hdr',
    type: AssetType.HDRTexture,
    priority: 'critical',
  },
};

// Use it for lighting
levelRoot.addComponent(IBLTexture, {
  src: 'sunsetHDR', // Reference your asset
  intensity: 0.9, // Lighting strength
  rotation: [0, Math.PI / 4, 0], // Rotate lighting direction
});
```

Gradient-based Lighting (for stylized scenes):

```
levelRoot.addComponent(IBLGradient, {
  sky: [1.0, 0.9, 0.7, 1.0], // Warm sky light
  equator: [0.7, 0.7, 0.9, 1.0], // Cool horizon
  ground: [0.2, 0.2, 0.2, 1.0], // Dark ground reflection
  intensity: 1.0,
});
```

### How environment affects materials

Environment lighting dramatically improves how materials look by providing realistic reflections and ambient lighting. The materials you created in previous tutorials will automatically look much better with proper environment setup.

Key material properties that respond to environment:

-   Metalness: Higher values reflect environment more (chrome, gold).-   Roughness: Lower values create sharper reflections (mirrors, polished surfaces).-   Color: Tints the reflected environment to create different metal types.

The Three.js materials you’re already using (`MeshStandardMaterial`) automatically work with IBL.

### Traditional light sources

Traditional lighting is not explicitly supported by IWSDK, but you can use Three.js lights by disabling default lighting and adding your own light sources.

```
import { DirectionalLight, AmbientLight } from '@iwsdk/core';

World.create(document.getElementById('scene-container'), {
  // ... other options
  render: {
    defaultLighting: false, // Disable IWSDK's default IBL
  },
}).then((world) =&gt; {
  // Add traditional Three.js lights directly to the scene
  const directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  world.scene.add(directionalLight);

  const ambientLight = new AmbientLight(0x404040, 0.4);
  world.scene.add(ambientLight);
});
```

## Setup background

In real life, our background environment determines the lighting. However, in 3D graphics, these are two completely separate concepts.

-   Lighting determines how materials render in the scene, providing reflections and illumination, but has no actual visual representation itself. Examples include `IBLTexture` or `IBLGradient`.-   Background functions purely as a backdrop that you see behind objects, and does not affect how objects are rendered at all. Examples include what you see as the skybox (`DomeTexture` or `DomeGradient`).

While it’s good practice to match your background to your environment lighting for visual coherence, you have complete flexibility to use them independently. You might use a sunset HDR for lighting while having a plain gradient background, or vice versa.

Background components attach to the level root entity, just like lighting components.

### Gradient backgrounds

For clean, stylized scenes:

```
const levelRoot = world.activeLevel.value;

levelRoot.addComponent(DomeGradient, {
  sky: [0.53, 0.81, 0.92, 1.0], // Light blue sky
  equator: [0.91, 0.76, 0.65, 1.0], // Warm horizon
  ground: [0.32, 0.32, 0.32, 1.0], // Dark ground
  intensity: 1.0,
});
```

### HDR image backgrounds

For photorealistic environments:

```
// Add HDR to your asset manifest
const assets = {
  studioHDR: {
    url: '/hdr/studio.hdr',
    type: AssetType.HDRTexture,
    priority: 'critical',
  },
};

// Use the loaded HDR for background
const levelRoot = world.activeLevel.value;

levelRoot.addComponent(DomeTexture, {
  src: 'studioHDR', // Reference the asset key
  intensity: 0.8,
  blurriness: 0.1, // Slight blur for softer look
});
```

## Next steps

In the next tutorial, you’ll continue using components to make your scene interactive with object grabbing and manipulation.

You’ll learn how to:

-   Add Interactable and Grabbable components to objects-   Use the grab system for natural VR interactions-   Understand how systems automatically handle interaction behaviors-   Make your GLTF models and primitive objects grabbable and interactive