World owns the ECS runtime, Three.js scene + renderer, input, player rig, and is the gateway to XR. IWSDK extends the base elics World with WebXR‑specific facilities.

## World as coordinator (mental model)

The World is the bridge between:

-   ECS data (entities/components)-   3D rendering (Three.js scene/camera/renderer)-   XR interaction (WebXR session via WebGLRenderer.xr)-   Content pipeline (asset manager, GLXF levels)

```
<span>Components</span><span> </span><span>←→</span><span> </span><span>Systems</span><span> </span><span>←→</span><span> </span><span>World</span><span> </span><span>←→</span><span> </span><span>Three</span><span>.</span><span>js</span><span>/</span><span>XR
                       </span><span>└→</span><span> </span><span>Assets</span><span>/</span><span>Levels</span>
```

## Creating a World

```
<span>import</span><span> </span><span>{</span><span> </span><span>World</span><span>,</span><span> </span><span>SessionMode</span><span> </span><span>}</span><span> </span><span>from</span><span> </span><span>'@iwsdk/core'</span><span>;</span><span>

</span><span>const</span><span> container </span><span>=</span><span> document</span><span>.</span><span>getElementById</span><span>(</span><span>'scene'</span><span>)</span><span> </span><span>as</span><span> </span><span>HTMLDivElement</span><span>;</span><span>
</span><span>const</span><span> world </span><span>=</span><span> </span><span>await</span><span> </span><span>World</span><span>.</span><span>create</span><span>(</span><span>container</span><span>,</span><span> </span><span>{</span><span>
  xr</span><span>:</span><span> </span><span>{</span><span> sessionMode</span><span>:</span><span> </span><span>SessionMode</span><span>.</span><span>ImmersiveVR</span><span> </span><span>},</span><span>
  features</span><span>:</span><span> </span><span>{</span><span> enableLocomotion</span><span>:</span><span> </span><span>true</span><span>,</span><span> enableGrabbing</span><span>:</span><span> </span><span>true</span><span> </span><span>},</span><span>
  level</span><span>:</span><span> </span><span>'/glxf/Composition.glxf'</span><span>,</span><span>
</span><span>});</span>
```

## Scene and level roots

-   `getActiveRoot()` returns the current level root or scene root if no level.-   `getPersistentRoot()` always returns the global scene root.

Use these roots when you attach Three.js nodes outside ECS.

## Creating Entities

```
<span>const</span><span> e </span><span>=</span><span> world</span><span>.</span><span>createEntity</span><span>();</span><span> </span><span>// bare entity (no object3D, no Transform)</span><span>
</span><span>const</span><span> t </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>();</span><span> </span><span>// entity + object3D + Transform</span>
```

`createTransformEntity(object?, parentOrOptions?)` accepts:

-   an existing `Object3D`-   `{ parent?: Entity; persistent?: boolean }` to choose the scene vs level parent

## Systems and Components

```
<span>world</span><span>.</span><span>registerComponent</span><span>(</span><span>MyComponent</span><span>);</span><span>
world</span><span>.</span><span>registerSystem</span><span>(</span><span>MySystem</span><span>);</span>
```

IWSDK registers core systems for you (Input, Audio, UI). Optional features like locomotion/grabbing are enabled via `World.create(..., { features })`.

## XR helpers

-   `launchXR(overrides?)` – explicitly request a session using defaults set at creation; pass partial overrides per-launch.-   `exitXR()` – end the active session.-   `visibilityState: Signal<'non-immersive'|'hidden'|'visible'|'visible-blurred'>`

Offering sessions (`navigator.xr.offerSession`) is managed by `World.create` via the `xr.offer` option:

```
<span>World</span><span>.</span><span>create</span><span>(</span><span>container</span><span>,</span><span> </span><span>{</span><span>
  xr</span><span>:</span><span> </span><span>{</span><span>
    sessionMode</span><span>:</span><span> </span><span>SessionMode</span><span>.</span><span>ImmersiveVR</span><span>,</span><span>
    </span><span>// 'none' | 'once' | 'always'</span><span>
    offer</span><span>:</span><span> </span><span>'once'</span><span>,</span><span>
  </span><span>},</span><span>
</span><span>});</span>
```

IWSDK vs elics: IWSDK adds XR helpers, scene ownership, and level wiring on top of elics’ ECS core.

## Update ordering and render loop

Each frame:

```
<span>update visibilityState </span><span>→</span><span> world</span><span>.</span><span>update</span><span>(</span><span>delta</span><span>,</span><span>time</span><span>)</span><span> </span><span>→</span><span> renderer</span><span>.</span><span>render</span><span>(</span><span>scene</span><span>,</span><span>camera</span><span>)</span>
```

Within `world.update`, systems run by ascending priority. Use negative priorities for input/physics that must precede visual updates.

## Levels

```
<span>await</span><span> world</span><span>.</span><span>loadLevel</span><span>(</span><span>'/glxf/Cave.glxf'</span><span>);</span>
```

The `LevelSystem` listens for requests and handles the load. When complete, the world’s `activeLevel` signal updates.