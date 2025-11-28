The input stack includes a `MultiPointer` per hand that aggregates a ray pointer (far interactions) and a grab pointer (near interactions), powered by `@pmndrs/pointer-events`.

## Concepts

-   `CombinedPointer` routes events to whichever sub‑pointer is “active”.-   Built‑ins:
    -   `RayPointer` — uses the XR target ray to raycast your scene. Visualizes a beam and a 2D cursor that aligns to surface normals.-   `GrabPointer` — anchored at the grip space for near interactions (e.g., grabbing widgets at your hand).-   Event mapping from `StatefulGamepad`:
    -   `select` → ray pointer (button 0)-   `squeeze` → grab pointer (button 2)

## Using the multipointer

```
<span>const</span><span> mpLeft </span><span>=</span><span> xrInput</span><span>.</span><span>multiPointers</span><span>.</span><span>left</span><span>;</span><span>
</span><span>const</span><span> mpRight </span><span>=</span><span> xrInput</span><span>.</span><span>multiPointers</span><span>.</span><span>right</span><span>;</span><span>

</span><span>// Toggle built‑ins</span><span>
mpLeft</span><span>.</span><span>toggleSubPointer</span><span>(</span><span>'ray'</span><span>,</span><span> </span><span>true</span><span>);</span><span>
mpLeft</span><span>.</span><span>toggleSubPointer</span><span>(</span><span>'grab'</span><span>,</span><span> </span><span>true</span><span>);</span><span>

</span><span>// Make grab the default target for generic events</span><span>
mpLeft</span><span>.</span><span>setDefault</span><span>(</span><span>'grab'</span><span>);</span><span>

</span><span>// Check if ray is currently targeting something</span><span>
</span><span>if</span><span> </span><span>(</span><span>mpRight</span><span>.</span><span>getRayBusy</span><span>())</span><span> </span><span>{</span><span>
  </span><span>// show a tooltip, etc.</span><span>
</span><span>}</span>
```

You normally don’t need to call `update` — the `XRInputManager` drives both multipointers each frame, enabling them only when a gamepad is present on the primary source.

## Making objects interactive

`@pmndrs/pointer-events` augments Three.js with pointer events. Assign handlers to your meshes/materials; the ray/ grab pointers will dispatch to them.

```
<span>import</span><span> </span><span>{</span><span> </span><span>Mesh</span><span>,</span><span> </span><span>MeshStandardMaterial</span><span>,</span><span> </span><span>BoxGeometry</span><span> </span><span>}</span><span> </span><span>from</span><span> </span><span>'three'</span><span>;</span><span>

</span><span>const</span><span> button </span><span>=</span><span> </span><span>new</span><span> </span><span>Mesh</span><span>(</span><span>
  </span><span>new</span><span> </span><span>BoxGeometry</span><span>(</span><span>0.1</span><span>,</span><span> </span><span>0.02</span><span>,</span><span> </span><span>0.1</span><span>),</span><span>
  </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>({</span><span> color</span><span>:</span><span> </span><span>'#3355ff'</span><span> </span><span>}),</span><span>
</span><span>);</span><span>
button</span><span>.</span><span>position</span><span>.</span><span>set</span><span>(</span><span>0</span><span>,</span><span> </span><span>1.4</span><span>,</span><span> </span><span>-</span><span>0.6</span><span>);</span><span>

</span><span>// Handlers use the pointer-events event model</span><span>
</span><span>(</span><span>button </span><span>as</span><span> any</span><span>).</span><span>onPointerEnter </span><span>=</span><span> </span><span>()</span><span> </span><span>=&gt;</span><span>
  </span><span>(</span><span>button</span><span>.</span><span>material </span><span>as</span><span> any</span><span>).</span><span>emissive</span><span>?.</span><span>set</span><span>(</span><span>'#2233aa'</span><span>);</span><span>
</span><span>(</span><span>button </span><span>as</span><span> any</span><span>).</span><span>onPointerLeave </span><span>=</span><span> </span><span>()</span><span> </span><span>=&gt;</span><span>
  </span><span>(</span><span>button</span><span>.</span><span>material </span><span>as</span><span> any</span><span>).</span><span>emissive</span><span>?.</span><span>set</span><span>(</span><span>'#000000'</span><span>);</span><span>
</span><span>(</span><span>button </span><span>as</span><span> any</span><span>).</span><span>onClick </span><span>=</span><span> </span><span>()</span><span> </span><span>=&gt;</span><span> console</span><span>.</span><span>log</span><span>(</span><span>'Clicked by XR ray'</span><span>);</span><span>
scene</span><span>.</span><span>add</span><span>(</span><span>button</span><span>);</span>
```

The `RayPointer` uses an optimized raycaster (`firstHitOnly = true`) for BVH‑accelerated scenes.

## Visual policy (ray + cursor)

The ray visual follows a simple policy:

-   If the ray pointer has capture → show ray, hide cursor.-   If any non‑ray pointer has capture → hide ray and cursor.-   Otherwise → show both when intersecting.

This reduces clutter when, e.g., your grab pointer is manipulating something.

## Custom pointers

You can build and register your own `Pointer` (from `@pmndrs/pointer-events`). Register with `CombinedPointer.register(pointer, isDefault)` and keep a reference to unregister later.

```
<span>import</span><span> </span><span>{</span><span> </span><span>CombinedPointer</span><span>,</span><span> createPointer </span><span>}</span><span> </span><span>from</span><span> </span><span>'@pmndrs/pointer-events'</span><span>;</span><span>

</span><span>const</span><span> myPointer </span><span>=</span><span> createPointer</span><span>(</span><span>/* your spatial transform source */</span><span>);</span><span>
</span><span>const</span><span> unregister </span><span>=</span><span> </span><span>(</span><span>xrInput </span><span>as</span><span> any</span><span>).</span><span>multiPointers</span><span>.</span><span>left</span><span>[</span><span>'combined'</span><span>].</span><span>register</span><span>(</span><span>
  myPointer</span><span>,</span><span>
  </span><span>false</span><span>,</span><span>
</span><span>);</span><span>
</span><span>// later</span><span>
unregister</span><span>();</span>
```

Tip: Mirror how `RayPointer` constructs its pointer — it supplies a camera getter and a `{ current: Group }` for the space whose world transform you want to use.

## Troubleshooting

-   No click events: ensure the primary input source on that side has a gamepad (some hand‑tracking runtimes don’t). The multipointer enables only when connected.-   Cursor misaligned on slanted surfaces: confirm surface normals make sense in object space; the ray visual converts them to world space via the normal matrix.