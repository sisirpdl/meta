Mental model: lifecycle is about when the ECS does what. Understand boot, system setup, per‑frame execution, and teardown.

## World lifecycle and boot sequence

When you call `World.create(container, options)`, IWSDK does the following:

-   Constructs a `World` instance and registers core components/systems: `Transform`, `Visibility`, `TransformSystem`, `VisibilitySystem`.-   Creates Three.js objects: `Scene`, `PerspectiveCamera`, `WebGLRenderer`; enables WebXR.-   Wraps the Scene in an entity (`world.sceneEntity`) and initializes an `activeLevel` entity beneath it.-   Sets up default lighting unless disabled (gradient environment + background).-   Creates `XRInputManager`; wires `player` (XROrigin) and `input` into the world.-   Registers core feature systems (always‑on UI, Audio; optional Locomotion/Grabbing) with explicit priorities.-   Initializes `AssetManager`.-   Starts the render loop (`renderer.setAnimationLoop`): each tick sets `visibilityState`, runs `world.update(delta, time)`, then renders.-   If `options.xr.offer` is ‘once’ or ‘always’, IWSDK offers an XR session after init (and re‑offers on end if ‘always’). Otherwise, call `world.launchXR()` manually when the user presses your XR button.-   Preloads assets (if provided) and requests an initial level load via `world.loadLevel(url?)`.

### Implications

-   Systems run on every animation frame in priority order before the scene is rendered.-   Default priorities (negative numbers run earlier): Locomotion (−5), Input (−4), Grabbing (−3). You can pass `{ priority: number }` when registering a system.-   `visibilityState` is updated each frame from the XR session (or `non-immersive`).

## System lifecycle (per class)

-   `init()`
    -   Subscribe to query `qualify`/`disqualify` events.-   Set up configs (`this.config.foo.subscribe(...)`).-   Wire DOM/renderer listeners; enqueue cleanups into `this.cleanupFuncs` if you create disposables.-   `update(delta, time)`
    -   Iterate your query sets. Use `for (const e of this.queries.name.entities)`.-   Use `.peek()` when reading config signals inside tight loops to avoid unnecessary reactivity.-   Avoid allocations and nested loops in hot paths.-   `destroy()`
    -   Dispose resources and undo listeners. IWSDK calls all `cleanupFuncs` for you.

## Query membership and when it changes

-   Adding/removing a component on an entity (`addComponent` / `removeComponent`) triggers query re‑evaluation for component presence.-   Changing a component value with `setValue` triggers re‑evaluation for queries whose `where:` predicates depend on that component.-   `getVectorView` returns a typed slice; mutating it does NOT trigger re‑evaluation on its own. If a query depends on that field, write back via `setValue` or mirror a scalar used in predicates.-   Subscribe to membership edges:

```
<span>this</span><span>.</span><span>queries</span><span>.</span><span>panels</span><span>.</span><span>subscribe</span><span>(</span><span>'qualify'</span><span>,</span><span> </span><span>(</span><span>e</span><span>)</span><span> </span><span>=&gt;</span><span> </span><span>{</span><span>
  </span><span>/* attach once */</span><span>
</span><span>});</span><span>
</span><span>this</span><span>.</span><span>queries</span><span>.</span><span>panels</span><span>.</span><span>subscribe</span><span>(</span><span>'disqualify'</span><span>,</span><span> </span><span>(</span><span>e</span><span>)</span><span> </span><span>=&gt;</span><span> </span><span>{</span><span>
  </span><span>/* cleanup */</span><span>
</span><span>});</span>
```

## Entity lifecycle

-   `createEntity()` creates a bare entity (no `object3D`).-   `createTransformEntity(object?, parentOrOptions?)` creates an entity with an `object3D`, injects a `Transform`, and parents it under the level root or scene based on options.-   `entity.destroy()` marks the entity inactive, clears its bitmask, resets query membership, and detaches its `object3D` from the scene.

### Parenting rules

-   If you pass `{ parent: Entity }`, the resulting `object3D` is added under the parent’s `object3D`.-   `{ persistent: true }` forces parenting under the scene (survives level swaps).-   Otherwise, entities created during a level load are parented under the active level root; persistent utilities under the scene.

## Frame order recap

```
<span>set</span><span> visibilityState </span><span>→</span><span> world</span><span>.</span><span>update</span><span>(</span><span>delta</span><span>,</span><span>time</span><span>)</span><span> </span><span>→</span><span> renderer</span><span>.</span><span>render</span><span>(</span><span>scene</span><span>,</span><span>camera</span><span>)</span>
```

Within `world.update`, systems run in ascending priority (more negative first). Use lower (more negative) priorities for input/physics that must run before visuals.

### Frame diagram (text)

```
<span>requestAnimationFrame </span><span>/</span><span> </span><span>XRAnimationFrame</span><span>
  </span><span>└─</span><span> compute delta</span><span>,</span><span>time
     </span><span>├─</span><span> world</span><span>.</span><span>visibilityState </span><span>←</span><span> session</span><span>.</span><span>visibilityState
     </span><span>├─</span><span> world</span><span>.</span><span>update</span><span>(</span><span>delta</span><span>,</span><span>time</span><span>)</span><span>
     </span><span>│</span><span>   </span><span>├─</span><span> systems </span><span>@</span><span> priority </span><span>…</span><span> </span><span>-</span><span>5</span><span>,</span><span> </span><span>-</span><span>4</span><span>,</span><span> </span><span>-</span><span>3</span><span>,</span><span> </span><span>0</span><span>,</span><span> </span><span>1</span><span> </span><span>…</span><span>
     </span><span>│</span><span>   </span><span>└─</span><span> queries keep sets up to date </span><span>(</span><span>qualify</span><span>/</span><span>disqualify emitted</span><span>)</span><span>
     </span><span>└─</span><span> renderer</span><span>.</span><span>render</span><span>(</span><span>scene</span><span>,</span><span>camera</span><span>)</span>
```