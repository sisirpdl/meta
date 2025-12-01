The IWSDK provides a comprehensive scene understanding system that enables AR/VR applications to detect and interact with real-world geometry. This chapter covers everything you need to know about implementing plane detection, mesh detection, and anchoring in your WebXR applications.

## What You’ll Build

By the end of this chapter, you’ll be able to:

-   Set up scene understanding systems for plane and mesh detection-   Automatically detect flat surfaces like floors, walls, and ceilings-   Detect complex 3D geometry including furniture and room structure-   Create stable anchor points that persist across tracking loss-   Build semantic-aware interactions based on detected object types-   Place virtual content accurately on real-world surfaces

## Overview

The scene understanding system leverages WebXR’s scene understanding capabilities to provide:

-   **Plane Detection** - Automatically detect flat surfaces like floors, walls, and ceilings-   **Mesh Detection** - Detect complex 3D geometry including furniture and room structure-   **Anchoring** - Create stable reference points that persist across tracking loss-   **Automatic Entity Management** - Real-world geometry is automatically converted to ECS entities-   **Semantic Understanding** - Meshes include semantic labels (table, chair, wall, etc.)

### Key Components

-   **`SceneUnderstandingSystem`** - Core system that manages WebXR scene understanding-   **`XRPlane`** - Component for detected flat surfaces-   **`XRMesh`** - Component for detected 3D geometry-   **`XRAnchor`** - Component for anchoring objects to stable positions

## Quick Start

Here’s a minimal example to enable scene understanding:

```
<span><span>import</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>World</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>SceneUnderstandingSystem</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>XRPlane</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>XRMesh</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>XRAnchor</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>SessionMode</span><span>,</span></span><br><span><span>}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'@iwsdk/core'</span><span>;</span></span><br><span><span></span></span><br><span><span>//&nbsp;React&nbsp;to&nbsp;detected&nbsp;planes</span></span><br><span><span>class</span><span>&nbsp;</span><span>PlaneProcessSystem</span><span>&nbsp;</span><span>extends</span><span>&nbsp;createSystem({</span></span><br><span><span>&nbsp;&nbsp;planeEntities:&nbsp;{&nbsp;required:&nbsp;[</span><span>XRPlane</span><span>]&nbsp;},</span></span><br><span><span>})&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;init()&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.queries.planeEntities.subscribe(</span><span>'qualify'</span><span>,&nbsp;(entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(</span><span>'New&nbsp;plane&nbsp;detected!'</span><span>,&nbsp;entity.object3D?.position);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;update()&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.queries.planeEntities.entities.forEach((entity)&nbsp;=</span><span>&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(</span><span>'Existing&nbsp;plane:&nbsp;'</span><span>,&nbsp;entity.object3D?.position);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>}</span></span><br><span><span></span></span><br><span><span>//&nbsp;Create&nbsp;world&nbsp;with&nbsp;AR&nbsp;session&nbsp;and&nbsp;required&nbsp;featu</span><span>res</span></span><br><span><span>World</span><span>.create(document.getElementById(</span><span>'scene-container'</span><span>),&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;assets,</span></span><br><span><span>&nbsp;&nbsp;xr:&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;sessionMode:&nbsp;</span><span>SessionMode</span><span>.</span><span>ImmersiveAR</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;features:&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;planeDetection:&nbsp;</span><span>true</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;meshDetection:&nbsp;</span><span>true</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;anchors:&nbsp;</span><span>true</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;},</span></span><br><span><span>&nbsp;&nbsp;},</span></span><br><span><span>}).then((world)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Register&nbsp;the&nbsp;scene&nbsp;understanding&nbsp;system</span></span><br><span><span>&nbsp;&nbsp;world</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;.registerSystem(</span><span>SceneUnderstandingSystem</span><span>)</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;.registerComponent(</span><span>XRPlane</span><span>)</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;.registerComponent(</span><span>XRMesh</span><span>)</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;.registerComponent(</span><span>XRAnchor</span><span>)</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;.registerSystem(</span><span>PlaneProcessSystem</span><span>);</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

## System Setup

### Step 1: WebXR Session Configuration

Scene understanding requires specific WebXR features to be enabled:

```
<span><span>World</span><span>.create(container,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;xr:&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;sessionMode:&nbsp;</span><span>SessionMode</span><span>.</span><span>ImmersiveAR</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;features:&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;planeDetection:&nbsp;</span><span>true</span><span>,&nbsp;</span><span>//&nbsp;Enable&nbsp;plane&nbsp;detection</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;meshDetection:&nbsp;</span><span>true</span><span>,&nbsp;</span><span>//&nbsp;Enable&nbsp;mesh&nbsp;detection</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;anchors:&nbsp;</span><span>true</span><span>,&nbsp;</span><span>//&nbsp;Enable&nbsp;anchor&nbsp;creation</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;},</span></span><br><span><span>&nbsp;&nbsp;},</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

**Important**: Not all WebXR implementations support all features. The system will log warnings for unsupported features.

### Step 2: Register System and Components

```
<span><span>world</span></span><br><span><span>&nbsp;&nbsp;.registerSystem(</span><span>SceneUnderstandingSystem</span><span>)</span></span><br><span><span>&nbsp;&nbsp;.registerComponent(</span><span>XRPlane</span><span>)</span></span><br><span><span>&nbsp;&nbsp;.registerComponent(</span><span>XRMesh</span><span>)</span></span><br><span><span>&nbsp;&nbsp;.registerComponent(</span><span>XRAnchor</span><span>);</span></span><br><span><span></span></span><br>
```

### Step 3: System Configuration

The system accepts configuration options:

```
<span><span>world.registerSystem(</span><span>SceneUnderstandingSystem</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;configData:&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;showWireFrame:&nbsp;</span><span>true</span><span>,&nbsp;</span><span>//&nbsp;Show/hide&nbsp;wireframe&nbsp;visualization&nbsp;for&nbsp;detected&nbsp;</span><span>planes&nbsp;and&nbsp;meshes</span></span><br><span><span>&nbsp;&nbsp;},</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

## Understanding the Components

### XRPlane

Represents detected flat surfaces in the real world. **Do not manually create** - these are automatically managed by the system.

#### Plane Properties

-   **Entity Object3D** - Visual representation of the plane (wireframe box by default)-   **`_plane`** - Internal WebXR plane object (read-only)

### XRMesh

Represents detected 3D geometry in the real world. **Do not manually create** - these are automatically managed by the system.

```
<span><span>class</span><span>&nbsp;</span><span>MeshProcessSystem</span><span>&nbsp;</span><span>extends</span><span>&nbsp;createSystem({</span></span><br><span><span>&nbsp;&nbsp;meshEntities:&nbsp;{&nbsp;required:&nbsp;[</span><span>XRMesh</span><span>]&nbsp;},</span></span><br><span><span>})&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;init()&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Query&nbsp;for&nbsp;detected&nbsp;meshes</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.queries.meshEntities.subscribe(</span><span>'qualify'</span><span>,&nbsp;(entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;isBounded&nbsp;=&nbsp;entity.getValue(</span><span>XRMesh</span><span>,&nbsp;</span><span>'isBounded3D'</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;semanticLabel&nbsp;=&nbsp;entity.getValue(</span><span>XRMesh</span><span>,&nbsp;</span><span>'semanticLabel'</span><span>);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>if</span><span>&nbsp;(isBounded)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(</span><span>'Object&nbsp;detected:'</span><span>,&nbsp;semanticLabel);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;dimensions&nbsp;=&nbsp;entity.getValue(</span><span>XRMesh</span><span>,&nbsp;</span><span>'dimensions'</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;min&nbsp;=&nbsp;entity.getValue(</span><span>XRMesh</span><span>,&nbsp;</span><span>'min'</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;max&nbsp;=&nbsp;entity.getValue(</span><span>XRMesh</span><span>,&nbsp;</span><span>'max'</span><span>);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(</span><span>'Object&nbsp;size:'</span><span>,&nbsp;dimensions);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(</span><span>'Bounding&nbsp;box:'</span><span>,&nbsp;min,&nbsp;max);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;</span><span>else</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(</span><span>'Global&nbsp;mesh&nbsp;detected&nbsp;(room&nbsp;structure)'</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

#### Mesh Properties

-   **`isBounded3D`** - Whether this is a bounded object vs global scene mesh, [read more](https://developers.meta.com/horizon/documentation/unity/unity-scene-build-mixed-reality/?locale=en_GB#common-scene-anchors) about bounded 3D meshes and scene meshes-   **`semanticLabel`** - Semantic classification (‘table’, ‘chair’, ‘wall’, etc.)-   **`min`** - Minimum bounding box coordinates-   **`max`** - Maximum bounding box coordinates-   **`dimensions`** - Calculated dimensions \[width, height, depth\]-   **`_mesh`** - Internal WebXR mesh object (read-only)

### XRAnchor

Anchors objects to stable real-world positions. **User creates** this component to anchor entities.

```
<span><span>//&nbsp;Create&nbsp;an&nbsp;anchored&nbsp;object</span></span><br><span><span>const</span><span>&nbsp;hologram&nbsp;=&nbsp;world.createTransformEntity(hologramMe</span><span>sh);</span></span><br><span><span>hologram.addComponent(</span><span>XRAnchor</span><span>);</span></span><br><span><span></span></span><br><span><span>//&nbsp;The&nbsp;system&nbsp;will&nbsp;automatically:</span></span><br><span><span>//&nbsp;1.&nbsp;Create&nbsp;a&nbsp;stable&nbsp;anchor&nbsp;at&nbsp;the&nbsp;current&nbsp;world&nbsp;</span><span>position</span></span><br><span><span>//&nbsp;2.&nbsp;Attach&nbsp;the&nbsp;object&nbsp;to&nbsp;the&nbsp;anchored&nbsp;reference&nbsp;</span><span>frame</span></span><br><span><span>//&nbsp;3.&nbsp;Maintain&nbsp;stable&nbsp;positioning&nbsp;across&nbsp;tracking&nbsp;</span><span>loss</span></span><br><span><span></span></span><br>
```

#### Anchor Properties

-   **`attached`** - Whether the entity has been attached to the anchor group (managed by system)

## Plane Detection

### Understanding Plane Detection

WebXR plane detection identifies flat surfaces in the real world:

-   **Horizontal planes**: Floors, tables, desks-   **Vertical planes**: Walls, doors, windows-   **Arbitrary planes**: Angled surfaces like ramps

### Working with Detected Planes

```
<span><span>//&nbsp;React&nbsp;to&nbsp;new&nbsp;planes</span></span><br><span><span>class</span><span>&nbsp;</span><span>PlaneProcessSystem</span><span>&nbsp;</span><span>extends</span><span>&nbsp;createSystem({</span></span><br><span><span>&nbsp;&nbsp;planeEntities:&nbsp;{&nbsp;required:&nbsp;[</span><span>XRPlane</span><span>]&nbsp;},</span></span><br><span><span>})&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;init()&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.queries.planeEntities.subscribe(</span><span>'qualify'</span><span>,&nbsp;(entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;planeObject&nbsp;=&nbsp;entity.object3D;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;position&nbsp;=&nbsp;planeObject.position;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;rotation&nbsp;=&nbsp;planeObject.quaternion;</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(</span><span>'Plane&nbsp;detected&nbsp;at:'</span><span>,&nbsp;position);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Place&nbsp;content&nbsp;on&nbsp;the&nbsp;plane</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;marker&nbsp;=&nbsp;createMarkerMesh();</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;marker.position.copy(position);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;marker.position.y&nbsp;+=&nbsp;</span><span>0.1</span><span>;&nbsp;</span><span>//&nbsp;Slightly&nbsp;above&nbsp;the&nbsp;plane</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;scene.add(marker);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.queries.planeEntities.subscribe(</span><span>'disqualify'</span><span>,&nbsp;(entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(</span><span>'Plane&nbsp;lost:'</span><span>,&nbsp;entity.object3D?.position);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Clean&nbsp;up&nbsp;any&nbsp;content&nbsp;placed&nbsp;on&nbsp;this&nbsp;plane</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

### Plane-based Content Placement

```
<span><span>//&nbsp;Place&nbsp;objects&nbsp;on&nbsp;detected&nbsp;floor&nbsp;planes</span></span><br><span><span>class</span><span>&nbsp;</span><span>PlaneProcessSystem</span><span>&nbsp;</span><span>extends</span><span>&nbsp;createSystem({</span></span><br><span><span>&nbsp;&nbsp;planeEntities:&nbsp;{&nbsp;required:&nbsp;[</span><span>XRPlane</span><span>]&nbsp;},</span></span><br><span><span>})&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;init()&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.queries.planeEntities.subscribe(</span><span>'qualify'</span><span>,&nbsp;(entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;plane&nbsp;=&nbsp;entity.getValue(</span><span>XRPlane</span><span>,&nbsp;</span><span>'_plane'</span><span>);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Check&nbsp;if&nbsp;it's&nbsp;a&nbsp;horizontal&nbsp;plane&nbsp;(floor-like)</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>if</span><span>&nbsp;(plane.orientation&nbsp;===&nbsp;</span><span>'horizontal'</span><span>)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;planePosition&nbsp;=&nbsp;entity.object3D.position;</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Place&nbsp;a&nbsp;virtual&nbsp;object&nbsp;on&nbsp;the&nbsp;floor</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;virtualObject&nbsp;=&nbsp;createVirtualObject();</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;virtualObject.position.copy(planePosition)</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;virtualObject.position.y&nbsp;+=&nbsp;</span><span>0.5</span><span>;&nbsp;</span><span>//&nbsp;Above&nbsp;the&nbsp;floor</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;scene.add(virtualObject);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

## Mesh Detection

### Understanding Mesh Detection

WebXR mesh detection provides detailed 3D geometry:

-   **Bounded meshes**: Individual objects with semantic labels-   **Global mesh**: Generic scene mesh objects-   **Semantic classification**: The label of the detected mesh object if it’s a bounded 3d mesh. Available sementic label values are listed [here](https://github.com/immersive-web/semantic-labels).

### Working with Detected Meshes

```
<span><span>class</span><span>&nbsp;</span><span>MeshProcessSystem</span><span>&nbsp;</span><span>extends</span><span>&nbsp;createSystem({</span></span><br><span><span>&nbsp;&nbsp;meshEntities:&nbsp;{&nbsp;required:&nbsp;[</span><span>XRMesh</span><span>]&nbsp;},</span></span><br><span><span>})&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;init()&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.queries.meshEntities.subscribe(</span><span>'qualify'</span><span>,&nbsp;(entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;isBounded&nbsp;=&nbsp;entity.getValue(</span><span>XRMesh</span><span>,&nbsp;</span><span>'isBounded3D'</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;semanticLabel&nbsp;=&nbsp;entity.getValue(</span><span>XRMesh</span><span>,&nbsp;</span><span>'semanticLabel'</span><span>);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>if</span><span>&nbsp;(isBounded)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;handleBoundedObject(entity,&nbsp;semanticLabel)</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;</span><span>else</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;handleGlobalMesh(entity);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>}</span></span><br><span><span></span></span><br><span><span>function</span><span>&nbsp;handleBoundedObject(entity,&nbsp;semanticLabel)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>const</span><span>&nbsp;dimensions&nbsp;=&nbsp;entity.getValue(</span><span>XRMesh</span><span>,&nbsp;</span><span>'dimensions'</span><span>);</span></span><br><span><span>&nbsp;&nbsp;</span><span>const</span><span>&nbsp;position&nbsp;=&nbsp;entity.object3D.position;</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>switch</span><span>&nbsp;(semanticLabel)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>case</span><span>&nbsp;</span><span>'table'</span><span>:</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(</span><span>`Table&nbsp;detected:&nbsp;</span><span>${dimensions[</span><span>0</span><span>]}</span><span>x</span><span>${dimensions[</span><span>2</span><span>]}</span><span>m`</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>break</span><span>;</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>case</span><span>&nbsp;</span><span>'chair'</span><span>:</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(</span><span>'Chair&nbsp;detected'</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Maybe&nbsp;spawn&nbsp;a&nbsp;virtual&nbsp;cushion&nbsp;or&nbsp;highlight</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>break</span><span>;</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>case</span><span>&nbsp;</span><span>'wall'</span><span>:</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(</span><span>'Wall&nbsp;detected'</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Could&nbsp;place&nbsp;artwork&nbsp;or&nbsp;UI&nbsp;panels</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>break</span><span>;</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>}</span></span><br><span><span></span></span><br><span><span>function</span><span>&nbsp;handleGlobalMesh(entity)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;console.log(</span><span>'Room&nbsp;structure&nbsp;detected'</span><span>);</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Could&nbsp;use&nbsp;for&nbsp;occlusion,&nbsp;physics,&nbsp;or&nbsp;environmen</span><span>tal&nbsp;effects</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

### Semantic-based Interactions

```
<span><span>//&nbsp;Example:&nbsp;Interactive&nbsp;table&nbsp;system</span></span><br><span><span>class</span><span>&nbsp;</span><span>TableInteractionSystem</span><span>&nbsp;</span><span>extends</span><span>&nbsp;createSystem({</span></span><br><span><span>&nbsp;&nbsp;tables:&nbsp;{&nbsp;required:&nbsp;[</span><span>XRMesh</span><span>],&nbsp;where:&nbsp;[eq(</span><span>XRMesh</span><span>,&nbsp;</span><span>'semanticLabel'</span><span>,&nbsp;</span><span>'table'</span><span>)]&nbsp;},</span></span><br><span><span>})&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;update()&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.queries.tables.entities.forEach((entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;dimensions&nbsp;=&nbsp;entity.getValue(</span><span>XRMesh</span><span>,&nbsp;</span><span>'dimensions'</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;position&nbsp;=&nbsp;entity.object3D.position;</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Create&nbsp;interactive&nbsp;surface</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.createTableInterface(position,&nbsp;dimensions);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;createTableInterface(position,&nbsp;dimensions)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Create&nbsp;UI&nbsp;or&nbsp;interactive&nbsp;elements&nbsp;for&nbsp;the&nbsp;table</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;interface&nbsp;=&nbsp;createTableUI(dimensions);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;interface.position.copy(position);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;interface.position.y&nbsp;+=&nbsp;</span><span>0.01</span><span>;&nbsp;</span><span>//&nbsp;Just&nbsp;above&nbsp;table&nbsp;surface</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.scene.add(interface);</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

## Anchoring

### Understanding Anchors

Anchors provide stable positioning that persists it’s world location that won’t be changed with recentering the view.

### Creating Anchored Content

```
<span><span>//&nbsp;Anchor&nbsp;existing&nbsp;object</span></span><br><span><span>const</span><span>&nbsp;existingObject&nbsp;=&nbsp;world.createTransformEntity(mesh</span><span>);</span></span><br><span><span>existingObject.object3D.position.</span><span>set</span><span>(</span><span>0</span><span>,&nbsp;</span><span>1</span><span>,&nbsp;-</span><span>2</span><span>);</span></span><br><span><span>existingObject.addComponent(</span><span>XRAnchor</span><span>);</span></span><br><span><span></span></span><br>
```

## Visual Feedback

### Wireframe Visualization

The system provides optional wireframe visualization for detected geometry:

```
<span><span>//&nbsp;Configure&nbsp;during&nbsp;registration</span></span><br><span><span>world.registerSystem(</span><span>SceneUnderstandingSystem</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;configData:&nbsp;{&nbsp;showWireFrame:&nbsp;</span><span>false</span><span>&nbsp;},</span></span><br><span><span>});</span></span><br><span><span></span></span><br><span><span>//&nbsp;Or&nbsp;enable/disable&nbsp;wireframes</span></span><br><span><span>world.getSystem(</span><span>SceneUnderstandingSystem</span><span>).config.showWireFrame.value&nbsp;=&nbsp;</span><span>true</span><span>;</span></span><br><span><span></span></span><br>
```

## Common Patterns

### AR Furniture Placement

```
<span><span>//&nbsp;Place&nbsp;virtual&nbsp;furniture&nbsp;on&nbsp;detected&nbsp;floor&nbsp;plane</span><span>s</span></span><br><span><span>class</span><span>&nbsp;</span><span>FurnitureSystem</span><span>&nbsp;</span><span>extends</span><span>&nbsp;createSystem({</span></span><br><span><span>&nbsp;&nbsp;planeEntities:&nbsp;{&nbsp;required:&nbsp;[</span><span>XRPlane</span><span>]&nbsp;},</span></span><br><span><span>})&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;init()&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.queries.planeEntities.subscribe(</span><span>'qualify'</span><span>,&nbsp;(entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;plane&nbsp;=&nbsp;entity.getValue(</span><span>XRPlane</span><span>,&nbsp;</span><span>'_plane'</span><span>);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>if</span><span>&nbsp;(plane.orientation&nbsp;===&nbsp;</span><span>'horizontal'</span><span>)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;planePosition&nbsp;=&nbsp;entity.object3D.position;</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Create&nbsp;anchored&nbsp;furniture</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;chairMesh&nbsp;=&nbsp;</span><span>//&nbsp;Create&nbsp;your&nbsp;chair&nbsp;mesh&nbsp;here</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;chair&nbsp;=&nbsp;world.createTransformEntity(chairMesh);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;chair.object3D.position.copy(planePosition</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;chair.object3D.position.y&nbsp;+=&nbsp;</span><span>0.4</span><span>;&nbsp;</span><span>//&nbsp;Chair&nbsp;height</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;chair.addComponent(</span><span>XRAnchor</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

### Interactive Surface Detection

```
<span><span>//&nbsp;Create&nbsp;interactive&nbsp;UI&nbsp;on&nbsp;detected&nbsp;tables</span></span><br><span><span>class</span><span>&nbsp;</span><span>SurfaceUISystem</span><span>&nbsp;</span><span>extends</span><span>&nbsp;createSystem({</span></span><br><span><span>&nbsp;&nbsp;meshes:&nbsp;{&nbsp;required:&nbsp;[</span><span>XRMesh</span><span>]&nbsp;},</span></span><br><span><span>})&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;update()&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.queries.meshes.entities.forEach((entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;semanticLabel&nbsp;=&nbsp;entity.getValue(</span><span>XRMesh</span><span>,&nbsp;</span><span>'semanticLabel'</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;isBounded&nbsp;=&nbsp;entity.getValue(</span><span>XRMesh</span><span>,&nbsp;</span><span>'isBounded3D'</span><span>);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>if</span><span>&nbsp;(isBounded&nbsp;&amp;&amp;&nbsp;semanticLabel&nbsp;===&nbsp;</span><span>'table'</span><span>)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.createTableUI(entity);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;createTableUI(tableEntity)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;dimensions&nbsp;=&nbsp;tableEntity.getValue(</span><span>XRMesh</span><span>,&nbsp;</span><span>'dimensions'</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;position&nbsp;=&nbsp;tableEntity.object3D.position;</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Create&nbsp;UI&nbsp;panel</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

### Scene-Aware Physics

```
<span><span>//&nbsp;Use&nbsp;detected&nbsp;planes&nbsp;as&nbsp;physics&nbsp;collision&nbsp;surfac</span><span>es</span></span><br><span><span>class</span><span>&nbsp;</span><span>PlanePhysicsSystem</span><span>&nbsp;</span><span>extends</span><span>&nbsp;createSystem({</span></span><br><span><span>&nbsp;&nbsp;planeEntities:&nbsp;{&nbsp;required:&nbsp;[</span><span>XRPlane</span><span>]&nbsp;},</span></span><br><span><span>})&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;init()&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.queries.planeEntities.subscribe(</span><span>'qualify'</span><span>,&nbsp;(planeEntity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Add&nbsp;physics&nbsp;collision&nbsp;to&nbsp;detected&nbsp;planes</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;planeMesh&nbsp;=&nbsp;planeEntity.object3D;</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;planeEntity.addComponent(</span><span>PhysicsShape</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;shape:&nbsp;</span><span>PhysicsShapeType</span><span>.</span><span>Box</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dimensions:&nbsp;[</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;planeMesh.geometry.parameters.width,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;planeMesh.geometry.parameters.height,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;planeMesh.geometry.parameters.depth,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;planeEntity.addComponent(</span><span>PhysicsBody</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;state:&nbsp;</span><span>PhysicsState</span><span>.</span><span>Static</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

## Troubleshooting

### Common Issues

**Scene understanding not working:**

-   Verify AR session with related features are properly requested-   If you are running on a Meta Horizon OS device, ensure that the room scaning (environment setup) is finished.

**Planes/meshes not detected:**

-   Ensure the environment has clear, well-lit surfaces-   Try manual room setup if available on the device

**Anchors not staying stable:**

-   Verify ‘anchor’ feature is enabled in WebXR session-   Ensure adequate visual features for tracking-   Some devices have limitations on anchor count

**Performance issues:**

-   Limit the number of entities with scene understanding components-   Consider disabling wireframes for better performance

### Debug Tips

**Log detection events:**

```
<span><span>class</span><span>&nbsp;</span><span>PlaneSystem</span><span>&nbsp;</span><span>extends</span><span>&nbsp;createSystem({</span></span><br><span><span>&nbsp;&nbsp;planeEntities:&nbsp;{&nbsp;required:&nbsp;[</span><span>XRPlane</span><span>]&nbsp;},</span></span><br><span><span>})&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;init()&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.queries.planeEntities.subscribe(</span><span>'qualify'</span><span>,&nbsp;(entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(</span><span>'Plane&nbsp;detected:'</span><span>,&nbsp;entity.getValue(</span><span>XRPlane</span><span>,&nbsp;</span><span>'_plane'</span><span>));</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.queries.planeEntities.subscribe(</span><span>'disqualify'</span><span>,&nbsp;(entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(</span><span>'Plane&nbsp;lost'</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

**Visualize bounding boxes:**

```
<span><span>class</span><span>&nbsp;</span><span>MeshSystem</span><span>&nbsp;</span><span>extends</span><span>&nbsp;createSystem({</span></span><br><span><span>&nbsp;&nbsp;meshEntities:&nbsp;{&nbsp;required:&nbsp;[</span><span>XRMesh</span><span>]&nbsp;},</span></span><br><span><span>})&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;init()&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.queries.meshEntities.subscribe(</span><span>'qualify'</span><span>,&nbsp;(entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;isBounded&nbsp;=&nbsp;entity.getValue(</span><span>XRMesh</span><span>,&nbsp;</span><span>'isBounded3D'</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>if</span><span>&nbsp;(isBounded)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;min&nbsp;=&nbsp;entity.getValue(</span><span>XRMesh</span><span>,&nbsp;</span><span>'min'</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;max&nbsp;=&nbsp;entity.getValue(</span><span>XRMesh</span><span>,&nbsp;</span><span>'max'</span><span>);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Create&nbsp;debug&nbsp;bounding&nbsp;box&nbsp;visualization</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;box&nbsp;=&nbsp;createBoundingBoxHelper(min,&nbsp;max);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```