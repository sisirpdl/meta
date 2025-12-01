`StatefulGamepad` wraps the XR `Gamepad` to provide edge‑triggered events and helpful axes utilities based on the active WebXR Input Profile.

## Why use it?

-   Edge events: `getButtonDown/Up()` so you don’t hand‑roll previous/next button arrays.-   Mapping by component id: call `getButtonPressed('xr-standard-squeeze')` instead of hard‑coding indices.-   Axes helpers: 2D magnitude, per‑direction enter/leave (Up/Down/Left/Right) with a threshold.

## Accessing gamepads

`XRInputManager` exposes lazily‑created stateful pads for the current primary source on each side.

```
<span>const</span><span> leftPad </span><span>=</span><span> xrInput</span><span>.</span><span>gamepads</span><span>.</span><span>left</span><span>;</span><span>
</span><span>const</span><span> rightPad </span><span>=</span><span> xrInput</span><span>.</span><span>gamepads</span><span>.</span><span>right</span><span>;</span><span>

</span><span>// Example: trigger a use action on select edge</span><span>
</span><span>if</span><span> </span><span>(</span><span>rightPad</span><span>?.</span><span>getSelectStart</span><span>())</span><span> doUse</span><span>();</span><span>
</span><span>if</span><span> </span><span>(</span><span>rightPad</span><span>?.</span><span>getSelectEnd</span><span>())</span><span> stopUse</span><span>();</span>
```

Pads are re‑created when the primary input source changes or when a gamepad appears/disappears on that source. Always null‑check.

## Mappings from input profiles

When first created, the pad resolves the active profile and builds:

-   `buttonMapping: Map<string, number>` — component id → button index.-   `axesMapping: Map<string, {x,y}>` — component id → axis indices.

Common component ids include:

-   `'xr-standard-trigger'`, `'xr-standard-squeeze'`-   `'xr-standard-thumbstick'`, `'xr-standard-touchpad'`-   `'a-button'`, `'b-button'`, `'x-button'`, `'y-button'`, `'thumbrest'`, `'menu'`

## API cheatsheet

```
<span>// Buttons by id or raw index</span><span>
pad</span><span>.</span><span>getButtonPressed</span><span>(</span><span>'xr-standard-trigger'</span><span>);</span><span>
pad</span><span>.</span><span>getButtonDown</span><span>(</span><span>'xr-standard-squeeze'</span><span>);</span><span>
pad</span><span>.</span><span>getButtonUpByIdx</span><span>(</span><span>3</span><span>);</span><span>
pad</span><span>.</span><span>getButtonValue</span><span>(</span><span>'xr-standard-trigger'</span><span>);</span><span> </span><span>// 0..1</span><span>

</span><span>// Select convenience (from layout.selectComponentId)</span><span>
pad</span><span>.</span><span>getSelectStart</span><span>();</span><span>
pad</span><span>.</span><span>getSelectEnd</span><span>();</span><span>
pad</span><span>.</span><span>getSelecting</span><span>();</span><span>

</span><span>// 2D axes (thumbstick/touchpad)</span><span>
</span><span>const</span><span> v </span><span>=</span><span> pad</span><span>.</span><span>getAxesValues</span><span>(</span><span>'xr-standard-thumbstick'</span><span>);</span><span> </span><span>// { x, y }</span><span>
</span><span>const</span><span> mag </span><span>=</span><span> pad</span><span>.</span><span>get2DInputValue</span><span>(</span><span>'xr-standard-thumbstick'</span><span>);</span><span> </span><span>// 0..√2</span><span>

</span><span>// Directional state machine (with threshold)</span><span>
pad</span><span>.</span><span>axesThreshold </span><span>=</span><span> </span><span>0.8</span><span>;</span><span> </span><span>// default</span><span>
pad</span><span>.</span><span>getAxesEnteringUp</span><span>(</span><span>'xr-standard-thumbstick'</span><span>);</span><span>
pad</span><span>.</span><span>getAxesLeavingRight</span><span>(</span><span>'xr-standard-thumbstick'</span><span>);</span>
```

Directional states are one of `Default, Up, Down, Left, Right` and update each `pad.update()` tick. The input manager calls `update()` for you when the gamepad is present.

## Patterns

### Smooth locomotion with thumbstick

```
<span>const</span><span> pad </span><span>=</span><span> xrInput</span><span>.</span><span>gamepads</span><span>.</span><span>left</span><span>;</span><span>
</span><span>if</span><span> </span><span>(</span><span>pad</span><span>)</span><span> </span><span>{</span><span>
  </span><span>const</span><span> </span><span>{</span><span> x</span><span>,</span><span> y </span><span>}</span><span> </span><span>=</span><span> pad</span><span>.</span><span>getAxesValues</span><span>(</span><span>'xr-standard-thumbstick'</span><span>)!;</span><span>
  </span><span>// Move in grip space forward/right</span><span>
  moveRigFromGrip</span><span>(</span><span>xrInput</span><span>.</span><span>xrOrigin</span><span>.</span><span>gripSpaces</span><span>.</span><span>left</span><span>,</span><span> x</span><span>,</span><span> y</span><span>,</span><span> dt</span><span>);</span><span>
</span><span>}</span>
```

### Snap turn on entering Left/Right

```
<span>const</span><span> pad </span><span>=</span><span> xrInput</span><span>.</span><span>gamepads</span><span>.</span><span>right</span><span>;</span><span>
</span><span>if</span><span> </span><span>(</span><span>pad</span><span>?.</span><span>getAxesEnteringLeft</span><span>(</span><span>'xr-standard-thumbstick'</span><span>))</span><span> snapTurn</span><span>(-</span><span>30</span><span>);</span><span>
</span><span>if</span><span> </span><span>(</span><span>pad</span><span>?.</span><span>getAxesEnteringRight</span><span>(</span><span>'xr-standard-thumbstick'</span><span>))</span><span> snapTurn</span><span>(</span><span>30</span><span>);</span>
```

### Press‑to‑hold interactions

```
<span>const</span><span> pad </span><span>=</span><span> xrInput</span><span>.</span><span>gamepads</span><span>.</span><span>right</span><span>;</span><span>
</span><span>if</span><span> </span><span>(</span><span>pad</span><span>?.</span><span>getButtonDown</span><span>(</span><span>'xr-standard-trigger'</span><span>))</span><span> startLaser</span><span>();</span><span>
</span><span>if</span><span> </span><span>(</span><span>pad</span><span>?.</span><span>getButtonUp</span><span>(</span><span>'xr-standard-trigger'</span><span>))</span><span> stopLaser</span><span>();</span>
```

## Troubleshooting

-   `getSelectStart()` never fires: ensure the active layout’s `selectComponentId` matches your device profile, and that you’re checking the pad for the primary side.-   Axes events feel jittery: increase `axesThreshold` above 0.8 to reduce accidental cardinal transitions.