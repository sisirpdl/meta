The IWSDK provides a comprehensive physics system powered by the `@babylonjs/havok` physics engine. This chapter covers everything you need to know about implementing realistic physics in your IWSDK applications.

## What You’ll Build

By the end of this chapter, you’ll be able to:

-   Set up the Havok physics engine with customized gravity settings-   Create falling objects with realistic collision shapes and material properties-   Build static environments with floors, walls, and other immovable objects-   Implement grabbable objects with proper physics interactions-   Apply forces and manipulate object velocities for dynamic interactions-   Optimize physics performance for complex scenes

## Overview

The physics system is built using an Entity Component System (ECS) architecture and consists of three main components:

-   **`PhysicsSystem`** - The core system that manages the Havok physics world-   **`PhysicsShape`** - Defines collision shapes and physics material properties (density, restition, friction)-   **`PhysicsBody`** - Defines the motion behavior of entities (Static, Dynamic, Kinematic)-   **`PhysicsManipulation`** - Applies one-time force and velocity changes

## Quick Start

Here’s a minimal example to get physics working in your scene:

```
<span><span>import</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>World</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>PhysicsSystem</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>PhysicsBody</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>PhysicsShape</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>PhysicsState</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>PhysicsShapeType</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>Mesh</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>SphereGeometry</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>MeshStandardMaterial</span><span>,</span></span><br><span><span>}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'@iwsdk/core'</span><span>;</span></span><br><span><span></span></span><br><span><span>//&nbsp;1.&nbsp;Register&nbsp;the&nbsp;physics&nbsp;system&nbsp;with&nbsp;customized&nbsp;</span><span>gravity</span></span><br><span><span>world</span></span><br><span><span>&nbsp;&nbsp;.registerSystem(</span><span>PhysicsSystem</span><span>,&nbsp;{&nbsp;configData:&nbsp;{&nbsp;gravity:&nbsp;[</span><span>0</span><span>,&nbsp;-</span><span>10</span><span>,&nbsp;</span><span>0</span><span>]&nbsp;}&nbsp;})</span></span><br><span><span>&nbsp;&nbsp;.registerComponent(</span><span>PhysicsBody</span><span>)</span></span><br><span><span>&nbsp;&nbsp;.registerComponent(</span><span>PhysicsShape</span><span>);</span></span><br><span><span></span></span><br><span><span>//&nbsp;2.&nbsp;Create&nbsp;a&nbsp;mesh</span></span><br><span><span>const</span><span>&nbsp;sphere&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>Mesh</span><span>(</span></span><br><span><span>&nbsp;&nbsp;</span><span>new</span><span>&nbsp;</span><span>SphereGeometry</span><span>(</span><span>0.5</span><span>),</span></span><br><span><span>&nbsp;&nbsp;</span><span>new</span><span>&nbsp;</span><span>MeshStandardMaterial</span><span>({&nbsp;color:&nbsp;</span><span>0xff0000</span><span>&nbsp;}),</span></span><br><span><span>);</span></span><br><span><span>sphere.position.</span><span>set</span><span>(</span><span>0</span><span>,&nbsp;</span><span>5</span><span>,&nbsp;</span><span>0</span><span>);</span></span><br><span><span>scene.add(sphere);</span></span><br><span><span></span></span><br><span><span>//&nbsp;3.&nbsp;Create&nbsp;entity&nbsp;and&nbsp;add&nbsp;physics&nbsp;components</span></span><br><span><span>const</span><span>&nbsp;entity&nbsp;=&nbsp;world.createTransformEntity(sphere);</span></span><br><span><span>entity.addComponent(</span><span>PhysicsShape</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;shape:&nbsp;</span><span>PhysicsShapeType</span><span>.</span><span>Auto</span><span>,&nbsp;</span><span>//&nbsp;Automatically&nbsp;detects&nbsp;sphere</span></span><br><span><span>});</span></span><br><span><span>entity.addComponent(</span><span>PhysicsBody</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;state:&nbsp;</span><span>PhysicsState</span><span>.</span><span>Dynamic</span><span>,&nbsp;</span><span>//&nbsp;Falls&nbsp;due&nbsp;to&nbsp;gravity</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

## System Setup

### Step 1: Register the Physics System

The `PhysicsSystem` must be registered with your world to enable physics simulation:

```
<span><span>world</span></span><br><span><span>&nbsp;&nbsp;.registerSystem(</span><span>PhysicsSystem</span><span>)</span></span><br><span><span>&nbsp;&nbsp;.registerComponent(</span><span>PhysicsBody</span><span>)</span></span><br><span><span>&nbsp;&nbsp;.registerComponent(</span><span>PhysicsShape</span><span>);</span></span><br><span><span></span></span><br>
```

### Step 2: Physics World Configuration

The physics system automatically creates a Havok physics world with:

-   **Gravity**: Default value `[0, -9.81, 0]` (configurable in physics system) (Earth-like gravity)-   **Step Rate**: Synchronized with your application’s frame rate-   **Automatic Cleanup**: Physics resources are cleaned up when entities are removed

## Understanding the Components

### PhysicsShape

Defines the collision shape and material properties of an entity.

```
<span><span>entity.addComponent(</span><span>PhysicsShape</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;shape:&nbsp;</span><span>PhysicsShapeType</span><span>.</span><span>Box</span><span>,</span></span><br><span><span>&nbsp;&nbsp;dimensions:&nbsp;[</span><span>2</span><span>,&nbsp;</span><span>1</span><span>,&nbsp;</span><span>1</span><span>],</span></span><br><span><span>&nbsp;&nbsp;density:&nbsp;</span><span>1.0</span><span>,</span></span><br><span><span>&nbsp;&nbsp;friction:&nbsp;</span><span>0.5</span><span>,</span></span><br><span><span>&nbsp;&nbsp;restitution:&nbsp;</span><span>0.0</span><span>,</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

#### Required Properties

-   **`shape`** - The collision shape type (see [Shape Types](https://developers.meta.com/horizon/documentation/web/iwsdk-guide-physics/#shape-types))

#### Optional Properties

-   **`dimensions`** - Shape-specific dimensions array. Not applicable when `PhysicsShapeType.Auto` is used.-   **`density`** - Mass density (default: 1.0)-   **`friction`** - Surface friction coefficient (default: 0.5)-   **`restitution`** - Bounciness factor (default: 0.0)

#### Shape Types

##### Auto Detection

The most convenient option that automatically detects the best shape from your Three.js geometry. When this type is selected, the dimensions field in PhysicsShape will be overridden by the size of the Three.js geometry.

```
<span><span>entity.addComponent(</span><span>PhysicsShape</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;shape:&nbsp;</span><span>PhysicsShapeType</span><span>.</span><span>Auto</span><span>,</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

**Mapping Rules:**

-   `SphereGeometry` → `Sphere`-   `BoxGeometry` → `Box`-   `PlaneGeometry` → `Box` (thin)-   `CylinderGeometry` → `Cylinder`-   Other geometries → `ConvexHull`

##### Sphere

Most efficient for round objects.

```
<span><span>entity.addComponent(</span><span>PhysicsShape</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;shape:&nbsp;</span><span>PhysicsShapeType</span><span>.</span><span>Sphere</span><span>,</span></span><br><span><span>&nbsp;&nbsp;dimensions:&nbsp;[</span><span>0.5</span><span>,&nbsp;</span><span>0</span><span>,&nbsp;</span><span>0</span><span>],&nbsp;</span><span>//&nbsp;[radius,&nbsp;unused,&nbsp;unused]</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

##### Box

Perfect for rectangular objects.

```
<span><span>entity.addComponent(</span><span>PhysicsShape</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;shape:&nbsp;</span><span>PhysicsShapeType</span><span>.</span><span>Box</span><span>,</span></span><br><span><span>&nbsp;&nbsp;dimensions:&nbsp;[</span><span>2</span><span>,&nbsp;</span><span>1</span><span>,&nbsp;</span><span>1</span><span>],&nbsp;</span><span>//&nbsp;[width,&nbsp;height,&nbsp;depth]</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

##### Cylinder

For cylindrical objects.

```
<span><span>entity.addComponent(</span><span>PhysicsShape</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;shape:&nbsp;</span><span>PhysicsShapeType</span><span>.</span><span>Cylinder</span><span>,</span></span><br><span><span>&nbsp;&nbsp;dimensions:&nbsp;[</span><span>0.5</span><span>,&nbsp;</span><span>2</span><span>,&nbsp;</span><span>0</span><span>],&nbsp;</span><span>//&nbsp;[radius,&nbsp;height,&nbsp;unused]</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

##### ConvexHull

A convex hull is the smallest convex shape containing points. It has good balance between accuracy and performance for complex shapes.

```
<span><span>entity.addComponent(</span><span>PhysicsShape</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;shape:&nbsp;</span><span>PhysicsShapeType</span><span>.</span><span>ConvexHull</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;dimensions&nbsp;automatically&nbsp;calculated&nbsp;from&nbsp;geomet</span><span>ry</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

##### TriMesh

Using tri mesh to fit the geometry. Most accurate but computationally expensive. Best for static objects.

```
<span><span>entity.addComponent(</span><span>PhysicsShape</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;shape:&nbsp;</span><span>PhysicsShapeType</span><span>.</span><span>TriMesh</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;dimensions&nbsp;automatically&nbsp;calculated&nbsp;from&nbsp;geomet</span><span>ry</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

#### Physics Material Properties

#### Density

Controls the mass of the object. Higher density = heavier object.

```
<span><span>//&nbsp;Light&nbsp;object&nbsp;(foam&nbsp;ball)</span></span><br><span><span>entity.addComponent(</span><span>PhysicsShape</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;shape:&nbsp;</span><span>PhysicsShapeType</span><span>.</span><span>Sphere</span><span>,</span></span><br><span><span>&nbsp;&nbsp;dimensions:&nbsp;[</span><span>0.5</span><span>,&nbsp;</span><span>0</span><span>,&nbsp;</span><span>0</span><span>],</span></span><br><span><span>&nbsp;&nbsp;density:&nbsp;</span><span>0.1</span><span>,</span></span><br><span><span>});</span></span><br><span><span></span></span><br><span><span>//&nbsp;Heavy&nbsp;object&nbsp;(metal&nbsp;ball)</span></span><br><span><span>entity.addComponent(</span><span>PhysicsShape</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;shape:&nbsp;</span><span>PhysicsShapeType</span><span>.</span><span>Sphere</span><span>,</span></span><br><span><span>&nbsp;&nbsp;dimensions:&nbsp;[</span><span>0.5</span><span>,&nbsp;</span><span>0</span><span>,&nbsp;</span><span>0</span><span>],</span></span><br><span><span>&nbsp;&nbsp;density:&nbsp;</span><span>10.0</span><span>,</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

### Friction

Controls sliding behavior on surfaces (0 = no friction, 1 = high friction).

```
<span><span>//&nbsp;Slippery&nbsp;ice&nbsp;surface</span></span><br><span><span>iceEntity.addComponent(</span><span>PhysicsShape</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;shape:&nbsp;</span><span>PhysicsShapeType</span><span>.</span><span>Box</span><span>,</span></span><br><span><span>&nbsp;&nbsp;dimensions:&nbsp;[</span><span>10</span><span>,&nbsp;</span><span>0.1</span><span>,&nbsp;</span><span>10</span><span>],</span></span><br><span><span>&nbsp;&nbsp;friction:&nbsp;</span><span>0.1</span><span>,</span></span><br><span><span>});</span></span><br><span><span></span></span><br><span><span>//&nbsp;Grippy&nbsp;rubber&nbsp;surface</span></span><br><span><span>rubberEntity.addComponent(</span><span>PhysicsShape</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;shape:&nbsp;</span><span>PhysicsShapeType</span><span>.</span><span>Box</span><span>,</span></span><br><span><span>&nbsp;&nbsp;dimensions:&nbsp;[</span><span>10</span><span>,&nbsp;</span><span>0.1</span><span>,&nbsp;</span><span>10</span><span>],</span></span><br><span><span>&nbsp;&nbsp;friction:&nbsp;</span><span>0.9</span><span>,</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

### Restitution

Controls bounciness (0 = no bounce, 1 = perfect bounce).

```
<span><span>//&nbsp;Dead&nbsp;ball&nbsp;(no&nbsp;bounce)</span></span><br><span><span>deadBallEntity.addComponent(</span><span>PhysicsShape</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;shape:&nbsp;</span><span>PhysicsShapeType</span><span>.</span><span>Sphere</span><span>,</span></span><br><span><span>&nbsp;&nbsp;dimensions:&nbsp;[</span><span>0.5</span><span>,&nbsp;</span><span>0</span><span>,&nbsp;</span><span>0</span><span>],</span></span><br><span><span>&nbsp;&nbsp;restitution:&nbsp;</span><span>0.0</span><span>,</span></span><br><span><span>});</span></span><br><span><span></span></span><br><span><span>//&nbsp;Super&nbsp;bouncy&nbsp;ball</span></span><br><span><span>bouncyBallEntity.addComponent(</span><span>PhysicsShape</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;shape:&nbsp;</span><span>PhysicsShapeType</span><span>.</span><span>Sphere</span><span>,</span></span><br><span><span>&nbsp;&nbsp;dimensions:&nbsp;[</span><span>0.5</span><span>,&nbsp;</span><span>0</span><span>,&nbsp;</span><span>0</span><span>],</span></span><br><span><span>&nbsp;&nbsp;restitution:&nbsp;</span><span>0.95</span><span>,</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

### PhysicsBody

Defines the motion behavior of an entity in the physics simulation.

```
<span><span>entity.addComponent(</span><span>PhysicsBody</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;state:&nbsp;</span><span>PhysicsState</span><span>.</span><span>Dynamic</span><span>,&nbsp;</span><span>//&nbsp;Required:&nbsp;motion&nbsp;type</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

#### Motion Types

-   **`PhysicsState.Static`** - Immovable objects like walls and floors
    -   Never moves, but affects other bodies-   Ideal for environment geometry-   **`PhysicsState.Dynamic`** - Responds to forces and gravity
    -   Affected by collisions, gravity, and applied forces-   Most common for interactive objects-   **`PhysicsState.Kinematic`** - Programmatically controlled
    -   Can be moved by code but not affected by other bodies-   Useful for moving platforms or player-controlled objects

```
<span><span>//&nbsp;Static&nbsp;floor</span></span><br><span><span>floorEntity.addComponent(</span><span>PhysicsBody</span><span>,&nbsp;{&nbsp;state:&nbsp;</span><span>PhysicsState</span><span>.</span><span>Static</span><span>&nbsp;});</span></span><br><span><span></span></span><br><span><span>//&nbsp;Dynamic&nbsp;ball&nbsp;that&nbsp;falls&nbsp;and&nbsp;bounces</span></span><br><span><span>ballEntity.addComponent(</span><span>PhysicsBody</span><span>,&nbsp;{&nbsp;state:&nbsp;</span><span>PhysicsState</span><span>.</span><span>Dynamic</span><span>&nbsp;});</span></span><br><span><span></span></span><br><span><span>//&nbsp;Kinematic&nbsp;elevator&nbsp;platform</span></span><br><span><span>elevatorEntity.addComponent(</span><span>PhysicsBody</span><span>,&nbsp;{&nbsp;state:&nbsp;</span><span>PhysicsState</span><span>.</span><span>Kinematic</span><span>&nbsp;});</span></span><br><span><span></span></span><br>
```

### PhysicsManipulation

The `PhysicsManipulation` component allows you to apply one-time forces and set velocities. The component is automatically removed after application.

#### Applying Forces

Forces are applied as impulses at the entity’s center of mass:

```
<span><span>//&nbsp;Make&nbsp;object&nbsp;jump</span></span><br><span><span>entity.addComponent(</span><span>PhysicsManipulation</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;force:&nbsp;[</span><span>0</span><span>,&nbsp;</span><span>10</span><span>,&nbsp;</span><span>0</span><span>],&nbsp;</span><span>//&nbsp;Upward&nbsp;force</span></span><br><span><span>});</span></span><br><span><span></span></span><br><span><span>//&nbsp;Throw&nbsp;object&nbsp;forward</span></span><br><span><span>entity.addComponent(</span><span>PhysicsManipulation</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;force:&nbsp;[</span><span>5</span><span>,&nbsp;</span><span>2</span><span>,&nbsp;</span><span>0</span><span>],&nbsp;</span><span>//&nbsp;Forward&nbsp;and&nbsp;up</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

### Setting Velocities

Directly set linear and angular velocities:

```
<span><span>//&nbsp;Set&nbsp;specific&nbsp;movement</span></span><br><span><span>entity.addComponent(</span><span>PhysicsManipulation</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;linearVelocity:&nbsp;[</span><span>3</span><span>,&nbsp;</span><span>0</span><span>,&nbsp;</span><span>0</span><span>],&nbsp;</span><span>//&nbsp;Move&nbsp;right&nbsp;at&nbsp;3&nbsp;m/s</span></span><br><span><span>&nbsp;&nbsp;angularVelocity:&nbsp;[</span><span>0</span><span>,&nbsp;</span><span>2</span><span>,&nbsp;</span><span>0</span><span>],&nbsp;</span><span>//&nbsp;Spin&nbsp;around&nbsp;Y-axis</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

### Combined Manipulation

You can combine forces and velocities in a single manipulation:

```
<span><span>entity.addComponent(</span><span>PhysicsManipulation</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;force:&nbsp;[</span><span>0</span><span>,&nbsp;</span><span>5</span><span>,&nbsp;</span><span>0</span><span>],&nbsp;</span><span>//&nbsp;Push&nbsp;up</span></span><br><span><span>&nbsp;&nbsp;linearVelocity:&nbsp;[</span><span>2</span><span>,&nbsp;</span><span>0</span><span>,&nbsp;</span><span>0</span><span>],&nbsp;</span><span>//&nbsp;Set&nbsp;rightward&nbsp;velocity</span></span><br><span><span>&nbsp;&nbsp;angularVelocity:&nbsp;[</span><span>0</span><span>,&nbsp;</span><span>1</span><span>,&nbsp;</span><span>0</span><span>],&nbsp;</span><span>//&nbsp;Add&nbsp;spin</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

## Common Patterns

### Creating a Falling Object

```
<span><span>const</span><span>&nbsp;box&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>Mesh</span><span>(</span><span>new</span><span>&nbsp;</span><span>BoxGeometry</span><span>(</span><span>1</span><span>,&nbsp;</span><span>1</span><span>,&nbsp;</span><span>1</span><span>),&nbsp;</span><span>new</span><span>&nbsp;</span><span>MeshStandardMaterial</span><span>());</span></span><br><span><span>box.position.</span><span>set</span><span>(</span><span>0</span><span>,&nbsp;</span><span>10</span><span>,&nbsp;</span><span>0</span><span>);</span></span><br><span><span>scene.add(box);</span></span><br><span><span></span></span><br><span><span>const</span><span>&nbsp;entity&nbsp;=&nbsp;world.createTransformEntity(box);</span></span><br><span><span>entity.addComponent(</span><span>PhysicsShape</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;shape:&nbsp;</span><span>PhysicsShapeType</span><span>.</span><span>Auto</span><span>,</span></span><br><span><span>});</span></span><br><span><span>entity.addComponent(</span><span>PhysicsBody</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;state:&nbsp;</span><span>PhysicsState</span><span>.</span><span>Dynamic</span><span>,</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

### Creating a Static Environment

```
<span><span>const</span><span>&nbsp;floor&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>Mesh</span><span>(</span><span>new</span><span>&nbsp;</span><span>PlaneGeometry</span><span>(</span><span>20</span><span>,&nbsp;</span><span>20</span><span>),&nbsp;</span><span>new</span><span>&nbsp;</span><span>MeshStandardMaterial</span><span>());</span></span><br><span><span>floor.position.</span><span>set</span><span>(</span><span>0</span><span>,&nbsp;</span><span>0</span><span>,&nbsp;</span><span>0</span><span>);</span></span><br><span><span>scene.add(floor);</span></span><br><span><span></span></span><br><span><span>const</span><span>&nbsp;floorEntity&nbsp;=&nbsp;world.createTransformEntity(floor);</span></span><br><span><span>floorEntity.addComponent(</span><span>PhysicsShape</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;shape:&nbsp;</span><span>PhysicsShapeType</span><span>.</span><span>Auto</span><span>,</span></span><br><span><span>});</span></span><br><span><span>floorEntity.addComponent(</span><span>PhysicsBody</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;state:&nbsp;</span><span>PhysicsState</span><span>.</span><span>Static</span><span>,</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

### Interactive Grabbable Objects

```
<span><span>//&nbsp;Create&nbsp;a&nbsp;grabbable&nbsp;ball</span></span><br><span><span>const</span><span>&nbsp;ball&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>Mesh</span><span>(</span></span><br><span><span>&nbsp;&nbsp;</span><span>new</span><span>&nbsp;</span><span>SphereGeometry</span><span>(</span><span>0.2</span><span>),</span></span><br><span><span>&nbsp;&nbsp;</span><span>new</span><span>&nbsp;</span><span>MeshStandardMaterial</span><span>({&nbsp;color:&nbsp;</span><span>0x00ff00</span><span>&nbsp;}),</span></span><br><span><span>);</span></span><br><span><span>ball.position.</span><span>set</span><span>(</span><span>0</span><span>,&nbsp;</span><span>2</span><span>,&nbsp;</span><span>0</span><span>);</span></span><br><span><span>scene.add(ball);</span></span><br><span><span></span></span><br><span><span>const</span><span>&nbsp;ballEntity&nbsp;=&nbsp;world.createTransformEntity(ball);</span></span><br><span><span>ballEntity.addComponent(</span><span>PhysicsShape</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;shape:&nbsp;</span><span>PhysicsShapeType</span><span>.</span><span>Sphere</span><span>,</span></span><br><span><span>&nbsp;&nbsp;dimensions:&nbsp;[</span><span>0.2</span><span>],</span></span><br><span><span>&nbsp;&nbsp;density:&nbsp;</span><span>0.5</span><span>,</span></span><br><span><span>&nbsp;&nbsp;restitution:&nbsp;</span><span>0.6</span><span>,</span></span><br><span><span>});</span></span><br><span><span>ballEntity.addComponent(</span><span>PhysicsBody</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;state:&nbsp;</span><span>PhysicsState</span><span>.</span><span>Dynamic</span><span>,</span></span><br><span><span>});</span></span><br><span><span></span></span><br><span><span>//&nbsp;Add&nbsp;grabbing&nbsp;capability&nbsp;(requires&nbsp;GrabSystem)</span></span><br><span><span>ballEntity.addComponent(</span><span>Interactable</span><span>);</span></span><br><span><span>ballEntity.addComponent(</span><span>OneHandGrabbable</span><span>);</span></span><br><span><span></span></span><br>
```

### Kinematic Moving Platforms

```
<span><span>const</span><span>&nbsp;platform&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>Mesh</span><span>(</span></span><br><span><span>&nbsp;&nbsp;</span><span>new</span><span>&nbsp;</span><span>BoxGeometry</span><span>(</span><span>3</span><span>,&nbsp;</span><span>0.2</span><span>,&nbsp;</span><span>3</span><span>),</span></span><br><span><span>&nbsp;&nbsp;</span><span>new</span><span>&nbsp;</span><span>MeshStandardMaterial</span><span>({&nbsp;color:&nbsp;</span><span>0x0000ff</span><span>&nbsp;}),</span></span><br><span><span>);</span></span><br><span><span>scene.add(platform);</span></span><br><span><span></span></span><br><span><span>const</span><span>&nbsp;platformEntity&nbsp;=&nbsp;world.createTransformEntity(plat</span><span>form);</span></span><br><span><span>platformEntity.addComponent(</span><span>PhysicsShape</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;shape:&nbsp;</span><span>PhysicsShapeType</span><span>.</span><span>Box</span><span>,</span></span><br><span><span>&nbsp;&nbsp;dimensions:&nbsp;[</span><span>3</span><span>,&nbsp;</span><span>0.2</span><span>,&nbsp;</span><span>3</span><span>],</span></span><br><span><span>&nbsp;&nbsp;friction:&nbsp;</span><span>0.8</span><span>,</span></span><br><span><span>});</span></span><br><span><span>platformEntity.addComponent(</span><span>PhysicsBody</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;state:&nbsp;</span><span>PhysicsState</span><span>.</span><span>Kinematic</span><span>,</span></span><br><span><span>});</span></span><br><span><span></span></span><br><span><span>//&nbsp;Animate&nbsp;the&nbsp;platform&nbsp;(in&nbsp;your&nbsp;update&nbsp;loop)</span></span><br><span><span>function</span><span>&nbsp;animatePlatform(time)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;platform.position.y&nbsp;=&nbsp;</span><span>Math</span><span>.sin(time&nbsp;*&nbsp;</span><span>0.001</span><span>)&nbsp;*&nbsp;</span><span>2</span><span>&nbsp;+&nbsp;</span><span>2</span><span>;</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

## Performance Optimization

-   **Use appropriate shape types:**
    -   Primitives (Sphere, Box) are fastest-   ConvexHull for moderate complexity-   TriMesh only for static, highly detailed objects-   **Optimize shape complexity:**
    -   Simplify meshes when possible. Use ConvexHull over TriMesh when possble.-   Use fewer vertices for ConvexHull and TriMesh shapes-   **Manage entity count:**
    -   Remove physics components from distant objects-   Use object pooling for frequently created/destroyed objects

## Troubleshooting

### Common Issues

**Physics objects fall through the floor:**

-   Ensure your floor has a `PhysicsShape` component-   Make sure floor has a `PhysicsBody` component with `PhysicsState.Static`-   Check that floor dimensions match visual geometry

**Objects don’t collide:**

-   Verify both objects have `PhysicsShape` components-   Check that shapes have appropriate dimensions-   Ensure objects are not starting inside each other-   Make sure floor has a `PhysicsBody` component with `PhysicsState.Dynamic`

**Poor performance:**

-   Use simpler shape types when possible-   Reduce the number of physics entities-   Consider using TriMesh only for static objects

**Objects behave unexpectedly:**

-   Check density values (very high/low values can cause issues)-   Verify friction and restitution are in reasonable ranges (0-1)-   Ensure forces aren’t too large

### Debug Tips

-   **Log component values** to verify they’re set correctly-   **Test with simple primitive shapes** before using complex geometry-   **Check console for warnings** from the physics system

The physics components are also available in MetaSpatial projects through XML component definitions:

```
<span><span>&lt;!--&nbsp;PhysicsBody&nbsp;component&nbsp;--&gt;</span></span><br><span><span>&lt;</span><span>IWSDKPhysicsBody</span><span>&nbsp;</span><span>state</span><span>=</span><span>"DYNAMIC"</span><span>&nbsp;</span><span>/</span><span>&gt;</span></span><br><span><span></span></span><br><span><span>&lt;!--&nbsp;PhysicsShape&nbsp;component&nbsp;--&gt;</span></span><br><span><span>&lt;</span><span>IWSDKPhysicsShape</span></span><br><span><span>&nbsp;&nbsp;</span><span>shape</span><span>=</span><span>"Box"</span></span><br><span><span>&nbsp;&nbsp;</span><span>dimensions</span><span>=</span><span>"2f,&nbsp;1f,&nbsp;1f"</span></span><br><span><span>&nbsp;&nbsp;</span><span>density</span><span>=</span><span>"1f"</span></span><br><span><span>&nbsp;&nbsp;</span><span>friction</span><span>=</span><span>"0.5f"</span></span><br><span><span>&nbsp;&nbsp;</span><span>restitution</span><span>=</span><span>"0f"</span><span>&nbsp;</span><span>/</span><span>&gt;</span></span><br><span><span></span></span><br><span><span>&lt;!--&nbsp;PhysicsManipulation&nbsp;component&nbsp;--&gt;</span></span><br><span><span>&lt;</span><span>IWSDKPhysicsManipulation</span></span><br><span><span>&nbsp;&nbsp;</span><span>force</span><span>=</span><span>"0f,&nbsp;10f,&nbsp;0f"</span></span><br><span><span>&nbsp;&nbsp;</span><span>linearVelocity</span><span>=</span><span>"0f,&nbsp;0f,&nbsp;0f"</span></span><br><span><span>&nbsp;&nbsp;</span><span>angularVelocity</span><span>=</span><span>"0f,&nbsp;0f,&nbsp;0f"</span><span>&nbsp;</span><span>/</span><span>&gt;</span></span><br><span><span></span></span><br>
```

## Example Projects

Check out the `examples/physics` project in the SDK for a complete working example that demonstrates:

-   Basic physics setup-   Dynamic sphere creation-   Force application-   Integration with XR interactions

The example creates a bouncing sphere with applied forces and can be run with:

```
<span>cd examples</span><span>/</span><span>physics
pnpm install
pnpm dev</span>
```