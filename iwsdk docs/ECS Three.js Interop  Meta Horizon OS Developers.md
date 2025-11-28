This is the most important concept to understand in IWSDK. Many developers get confused about when to use ECS vs Three.js APIs. This guide clarifies the relationship and shows you exactly how to work with both.

## The core problem: Two different APIs

**The confusion:**

```
<span>// Which way should I move an object?</span><span>

</span><span>// Three.js way:</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>position</span><span>.</span><span>x </span><span>+=</span><span> </span><span>1</span><span>;</span><span>

</span><span>// ECS way:</span><span>
</span><span>const</span><span> pos </span><span>=</span><span> entity</span><span>.</span><span>getVectorView</span><span>(</span><span>Transform</span><span>,</span><span> </span><span>'position'</span><span>);</span><span>
pos</span><span>[</span><span>0</span><span>]</span><span> </span><span>+=</span><span> </span><span>1</span><span>;</span>
```

**The answer:** Both work, but ECS Transform data is the source of truth. IWSDK automatically syncs to Three.js visuals.

## Mental model: Data-driven visuals

Think of it this way:

```
<span>ECS </span><span>Components</span><span> </span><span>(</span><span>Data</span><span>)</span><span>     </span><span>←</span><span>sync</span><span>→</span><span>     </span><span>Three</span><span>.</span><span>js </span><span>Objects</span><span> </span><span>(</span><span>Visuals</span><span>)</span><span>
</span><span>─────────────────────</span><span>                </span><span>──────────────────────────</span><span>
</span><span>Transform</span><span> </span><span>{</span><span> pos</span><span>:</span><span> </span><span>[</span><span>2</span><span>,</span><span>1</span><span>,</span><span>0</span><span>]</span><span> </span><span>}</span><span>  </span><span>────────→</span><span> object3D</span><span>.</span><span>position</span><span>:</span><span> </span><span>Vector3</span><span>(</span><span>2</span><span>,</span><span>1</span><span>,</span><span>0</span><span>)</span><span>
</span><span>Transform</span><span> </span><span>{</span><span> rot</span><span>:</span><span> </span><span>[</span><span>0</span><span>,</span><span>0</span><span>,</span><span>0</span><span>,</span><span>1</span><span>]</span><span> </span><span>}</span><span> </span><span>────────→</span><span> object3D</span><span>.</span><span>quaternion</span><span>:</span><span> </span><span>Quaternion</span><span>(</span><span>0</span><span>,</span><span>0</span><span>,</span><span>0</span><span>,</span><span>1</span><span>)</span><span>
</span><span>Transform</span><span> </span><span>{</span><span> scale</span><span>:</span><span> </span><span>[</span><span>1</span><span>,</span><span>1</span><span>,</span><span>1</span><span>]</span><span> </span><span>}</span><span> </span><span>────────→</span><span> object3D</span><span>.</span><span>scale</span><span>:</span><span> </span><span>Vector3</span><span>(</span><span>1</span><span>,</span><span>1</span><span>,</span><span>1</span><span>)</span><span>

</span><span>// ECS components store the authoritative state</span><span>
</span><span>// Three.js objects provide the visual representation</span>
```

**Key Insight:** ECS components hold the authoritative data. Three.js objects are synchronized views of that data.

## How IWSDK bridges the two worlds

### 1\. Entity creation links ECS + Three.js

```
<span>import</span><span> </span><span>{</span><span> </span><span>World</span><span> </span><span>}</span><span> </span><span>from</span><span> </span><span>'@iwsdk/core'</span><span>;</span><span>

</span><span>const</span><span> world </span><span>=</span><span> </span><span>await</span><span> </span><span>World</span><span>.</span><span>create</span><span>(</span><span>container</span><span>);</span><span>

</span><span>// This creates BOTH an ECS entity AND a Three.js Object3D</span><span>
</span><span>const</span><span> entity </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>();</span><span>

console</span><span>.</span><span>log</span><span>(</span><span>entity</span><span>.</span><span>index</span><span>);</span><span> </span><span>// ECS entity ID: 42</span><span>
console</span><span>.</span><span>log</span><span>(</span><span>entity</span><span>.</span><span>object3D</span><span>);</span><span> </span><span>// Three.js Object3D instance</span><span>
console</span><span>.</span><span>log</span><span>(</span><span>entity</span><span>.</span><span>hasComponent</span><span>(</span><span>Transform</span><span>));</span><span> </span><span>// true - ECS Transform component</span>
```

**What happened:**

-   `createTransformEntity()` creates an ECS entity-   Creates a Three.js `Object3D` and attaches it as `entity.object3D`-   Adds a `Transform` component with position/rotation/scale data-   Registers the entity for automatic sync via TransformSystem

### 2\. `TransformSystem` keeps everything in sync

IWSDK runs a built-in `TransformSystem` that automatically synchronizes:

```
<span>// Every frame, TransformSystem does this internally:</span><span>
</span><span>for</span><span> </span><span>(</span><span>const</span><span> entity of </span><span>this</span><span>.</span><span>queries</span><span>.</span><span>transforms</span><span>.</span><span>entities</span><span>)</span><span> </span><span>{</span><span>
  </span><span>const</span><span> transform </span><span>=</span><span> entity</span><span>.</span><span>getComponent</span><span>(</span><span>Transform</span><span>);</span><span>
  </span><span>const</span><span> object3D </span><span>=</span><span> entity</span><span>.</span><span>object3D</span><span>;</span><span>

  </span><span>// Sync ECS data → Three.js visuals</span><span>
  object3D</span><span>.</span><span>position</span><span>.</span><span>fromArray</span><span>(</span><span>transform</span><span>.</span><span>position</span><span>);</span><span>
  object3D</span><span>.</span><span>quaternion</span><span>.</span><span>fromArray</span><span>(</span><span>transform</span><span>.</span><span>orientation</span><span>);</span><span>
  object3D</span><span>.</span><span>scale</span><span>.</span><span>fromArray</span><span>(</span><span>transform</span><span>.</span><span>scale</span><span>);</span><span>
</span><span>}</span>
```

You never write this code. IWSDK handles it automatically.

## When to use ECS vs Three.js APIs

### Use ECS APIs for:

**Transform updates:**

```
<span>// Update position through ECS - gets synced to Three.js automatically</span><span>
</span><span>const</span><span> pos </span><span>=</span><span> entity</span><span>.</span><span>getVectorView</span><span>(</span><span>Transform</span><span>,</span><span> </span><span>'position'</span><span>);</span><span>
pos</span><span>[</span><span>0</span><span>]</span><span> </span><span>+=</span><span> deltaX</span><span>;</span><span>
pos</span><span>[</span><span>1</span><span>]</span><span> </span><span>+=</span><span> deltaY</span><span>;</span><span>
pos</span><span>[</span><span>2</span><span>]</span><span> </span><span>+=</span><span> deltaZ</span><span>;</span>
```

**Data-driven logic:**

```
<span>// ECS Transform is the single source of truth</span><span>
entity</span><span>.</span><span>setValue</span><span>(</span><span>Transform</span><span>,</span><span> </span><span>'position'</span><span>,</span><span> </span><span>[</span><span>2</span><span>,</span><span> </span><span>1</span><span>,</span><span> </span><span>-</span><span>5</span><span>]);</span><span>
</span><span>// Three.js object3D.position gets updated automatically</span>
```

### Use Three.js APIs for:

**Creating meshes and materials:**

```
<span>import</span><span> </span><span>{</span><span> </span><span>BoxGeometry</span><span>,</span><span> </span><span>MeshStandardMaterial</span><span>,</span><span> </span><span>Mesh</span><span> </span><span>}</span><span> </span><span>from</span><span> </span><span>'@iwsdk/core'</span><span>;</span><span>

</span><span>const</span><span> geometry </span><span>=</span><span> </span><span>new</span><span> </span><span>BoxGeometry</span><span>(</span><span>1</span><span>,</span><span> </span><span>1</span><span>,</span><span> </span><span>1</span><span>);</span><span>
</span><span>const</span><span> material </span><span>=</span><span> </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>({</span><span> color</span><span>:</span><span> </span><span>0xff0000</span><span> </span><span>});</span><span>
</span><span>const</span><span> mesh </span><span>=</span><span> </span><span>new</span><span> </span><span>Mesh</span><span>(</span><span>geometry</span><span>,</span><span> material</span><span>);</span><span>

</span><span>const</span><span> entity </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>(</span><span>mesh</span><span>);</span>
```

**Complex 3D hierarchies:**

```
<span>// Build a complex object with multiple parts</span><span>
</span><span>const</span><span> parent </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>();</span><span>
</span><span>const</span><span> body </span><span>=</span><span> </span><span>new</span><span> </span><span>Mesh</span><span>(</span><span>bodyGeometry</span><span>,</span><span> bodyMaterial</span><span>);</span><span>
</span><span>const</span><span> wheel1 </span><span>=</span><span> </span><span>new</span><span> </span><span>Mesh</span><span>(</span><span>wheelGeometry</span><span>,</span><span> wheelMaterial</span><span>);</span><span>
</span><span>const</span><span> wheel2 </span><span>=</span><span> </span><span>new</span><span> </span><span>Mesh</span><span>(</span><span>wheelGeometry</span><span>,</span><span> wheelMaterial</span><span>);</span><span>

parent</span><span>.</span><span>object3D</span><span>.</span><span>add</span><span>(</span><span>body</span><span>);</span><span>
parent</span><span>.</span><span>object3D</span><span>.</span><span>add</span><span>(</span><span>wheel1</span><span>);</span><span>
parent</span><span>.</span><span>object3D</span><span>.</span><span>add</span><span>(</span><span>wheel2</span><span>);</span><span>

</span><span>// Position wheels relative to parent</span><span>
wheel1</span><span>.</span><span>position</span><span>.</span><span>set</span><span>(-</span><span>1</span><span>,</span><span> </span><span>-</span><span>0.5</span><span>,</span><span> </span><span>1.2</span><span>);</span><span>
wheel2</span><span>.</span><span>position</span><span>.</span><span>set</span><span>(</span><span>1</span><span>,</span><span> </span><span>-</span><span>0.5</span><span>,</span><span> </span><span>1.2</span><span>);</span>
```

**Visual properties:**

```
<span>// Set Three.js-specific properties</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>name </span><span>=</span><span> </span><span>'MyObject'</span><span>;</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>layers</span><span>.</span><span>set</span><span>(</span><span>1</span><span>);</span><span> </span><span>// Render layer</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>castShadow </span><span>=</span><span> </span><span>true</span><span>;</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>receiveShadow </span><span>=</span><span> </span><span>true</span><span>;</span>
```

## Common patterns

### Pattern 1: Direct Three.js updates (Recommended)

```
<span>// Update Three.js object directly - immediate and familiar</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>position</span><span>.</span><span>x </span><span>+=</span><span> deltaX</span><span>;</span><span> </span><span>// Move right</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>position</span><span>.</span><span>y </span><span>+=</span><span> deltaY</span><span>;</span><span> </span><span>// Move up</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>position</span><span>.</span><span>z </span><span>+=</span><span> deltaZ</span><span>;</span><span> </span><span>// Move forward</span><span>

</span><span>// Animate rotation over time</span><span>
</span><span>const</span><span> time </span><span>=</span><span> performance</span><span>.</span><span>now</span><span>()</span><span> </span><span>*</span><span> </span><span>0.001</span><span>;</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>rotation</span><span>.</span><span>y </span><span>=</span><span> time</span><span>;</span><span> </span><span>// Rotate around Y-axis</span>
```

### Pattern 2: ECS transform updates

```
<span>// Update position through ECS - syncs to Three.js automatically</span><span>
</span><span>const</span><span> pos </span><span>=</span><span> entity</span><span>.</span><span>getVectorView</span><span>(</span><span>Transform</span><span>,</span><span> </span><span>'position'</span><span>);</span><span>
pos</span><span>[</span><span>0</span><span>]</span><span> </span><span>+=</span><span> deltaX</span><span>;</span><span> </span><span>// Move right</span><span>
pos</span><span>[</span><span>1</span><span>]</span><span> </span><span>+=</span><span> deltaY</span><span>;</span><span> </span><span>// Move up</span><span>
pos</span><span>[</span><span>2</span><span>]</span><span> </span><span>+=</span><span> deltaZ</span><span>;</span><span> </span><span>// Move forward</span><span>

</span><span>// IWSDK's TransformSystem automatically updates:</span><span>
</span><span>// entity.object3D.position.set(pos[0], pos[1], pos[2])</span>
```

## Parenting and hierarchies

### Scene vs level roots

IWSDK provides two root contexts:

```
<span>// Persistent objects (survive level changes)</span><span>
</span><span>const</span><span> ui </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>(</span><span>undefined</span><span>,</span><span> </span><span>{</span><span> persistent</span><span>:</span><span> </span><span>true</span><span> </span><span>});</span><span>
</span><span>// Attached to: world.getPersistentRoot() (the Scene)</span><span>

</span><span>// Level objects (cleaned up on level change)</span><span>
</span><span>const</span><span> prop </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>();</span><span> </span><span>// default</span><span>
</span><span>// Attached to: world.getActiveRoot() (current level)</span>
```

### Entity parenting

```
<span>const</span><span> parent </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>();</span><span>
</span><span>const</span><span> child </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>(</span><span>undefined</span><span>,</span><span> </span><span>{</span><span> parent </span><span>});</span><span>

</span><span>// Both ECS Transform and Three.js hierarchy are set up:</span><span>
console</span><span>.</span><span>log</span><span>(</span><span>child</span><span>.</span><span>getValue</span><span>(</span><span>Transform</span><span>,</span><span> </span><span>'parent'</span><span>)</span><span> </span><span>===</span><span> parent</span><span>.</span><span>index</span><span>);</span><span> </span><span>// true</span><span>
console</span><span>.</span><span>log</span><span>(</span><span>child</span><span>.</span><span>object3D</span><span>.</span><span>parent </span><span>===</span><span> parent</span><span>.</span><span>object3D</span><span>);</span><span> </span><span>// true</span>
```

## Frame order and timing

Understanding when things happen each frame:

```
<span>1.</span><span> </span><span>Input</span><span> </span><span>Systems</span><span> </span><span>(-</span><span>4</span><span> priority</span><span>)</span><span> </span><span>───</span><span> </span><span>Update</span><span> controller</span><span>/</span><span>hand data
</span><span>2.</span><span> </span><span>Game</span><span> </span><span>Logic</span><span> </span><span>Systems</span><span> </span><span>(</span><span>0</span><span> priority</span><span>)</span><span> </span><span>─</span><span> </span><span>Your</span><span> gameplay code here
</span><span>3.</span><span> </span><span>TransformSystem</span><span> </span><span>(</span><span>1</span><span> priority</span><span>)</span><span> </span><span>──</span><span> </span><span>Sync</span><span> ECS </span><span>→</span><span> </span><span>Three</span><span>.</span><span>js
</span><span>4.</span><span> renderer</span><span>.</span><span>render</span><span>(</span><span>scene</span><span>,</span><span> camera</span><span>)</span><span> </span><span>─</span><span> </span><span>Three</span><span>.</span><span>js draws the frame</span>
```

**Key rules:**

-   Write game logic in your systems (priority 0 or negative)-   Never write code that runs after `TransformSystem`-   Three.js objects are automatically synced before rendering

## Common pitfalls and solutions

### Pitfall: fighting the sync system

```
<span>// DON'T: Manually update Three.js and expect ECS to follow</span><span>
entity</span><span>.</span><span>object3D</span><span>!.</span><span>position</span><span>.</span><span>x </span><span>=</span><span> </span><span>5</span><span>;</span><span> </span><span>// This gets overwritten!</span><span>

</span><span>// DO: Update ECS and let TransformSystem sync</span><span>
</span><span>const</span><span> pos </span><span>=</span><span> entity</span><span>.</span><span>getVectorView</span><span>(</span><span>Transform</span><span>,</span><span> </span><span>'position'</span><span>);</span><span>
pos</span><span>[</span><span>0</span><span>]</span><span> </span><span>=</span><span> </span><span>5</span><span>;</span><span> </span><span>// Three.js automatically updates</span>
```

### Pitfall: component vs Object3D confusion

```
<span>// DON'T: Store Three.js objects directly in components</span><span>
</span><span>// Keep ECS data separate from Three.js objects</span><span>

</span><span>// DO: Use Transform component for position/rotation/scale</span><span>
</span><span>// IWSDK handles the Object3D sync automatically</span>
```

## Summary

**The golden rules:**

-   **ECS owns the data** - Transform components are the source of truth-   **Three.js shows the data** - Object3D properties are synchronized views-   **IWSDK handles sync** - TransformSystem runs automatically every frame-   **Use ECS for logic** - Game systems should manipulate components-   **Use Three.js for setup** - Materials, geometries, and visual properties

This interop system lets you leverage the best of both worlds: ECS’s data-driven architecture for game logic, and Three.js’s powerful rendering capabilities for visuals.