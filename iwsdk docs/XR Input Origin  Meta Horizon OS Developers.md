`XROrigin` is the transform root for input. It contains Groups for the user’s head, ray spaces, and grip spaces. `XRInputManager` updates these from the XR frame each tick.

## Spaces

-   `head`: viewer pose (HMD). Parent head‑attached UI here.-   `raySpaces.left/right`: target‑ray spaces for pointing.-   `gripSpaces.left/right`: grip spaces for holding tools/objects.-   `secondaryRaySpaces.left/right`: additional spaces used when a non‑primary source is present.-   `secondaryGripSpaces.left/right`: likewise for grips.

Only `head`, primary `raySpaces`, and primary `gripSpaces` are added as children of the origin by default. Secondary spaces are updated but not parented for rendering since their visuals are hidden; you may parent or visualize them if needed.

## Lifecycle and updates

Each frame (`XRInputManager.update`):

-   For each detected `XRInputSource`, choose the appropriate target spaces (primary vs secondary) for that side.-   Copy pose matrices from `XRFrame.getPose(...)` into the chosen `ray` and `grip` groups.-   If the source lacks `gripSpace`, the adapter mirrors the ray transform into the grip.-   Update the head from `getViewerPose`.-   Call `xrOrigin.updateMatrixWorld(true)` before pointer updates.

## Using spaces in your app

Attach your own tools to the spaces to keep them aligned in XR.

```
<span>// A laser sight attached to the right ray</span><span>
</span><span>const</span><span> sight </span><span>=</span><span> </span><span>new</span><span> </span><span>Mesh</span><span>(</span><span>new</span><span> </span><span>CylinderGeometry</span><span>(</span><span>0.001</span><span>,</span><span> </span><span>0.001</span><span>,</span><span> </span><span>0.2</span><span>),</span><span> mat</span><span>);</span><span>
xrInput</span><span>.</span><span>xrOrigin</span><span>.</span><span>raySpaces</span><span>.</span><span>right</span><span>.</span><span>add</span><span>(</span><span>sight</span><span>);</span><span>

</span><span>// A held gadget anchored to the left grip</span><span>
</span><span>const</span><span> gadget </span><span>=</span><span> </span><span>new</span><span> </span><span>Object3D</span><span>();</span><span>
gadget</span><span>.</span><span>position</span><span>.</span><span>set</span><span>(</span><span>0</span><span>,</span><span> </span><span>-</span><span>0.02</span><span>,</span><span> </span><span>0.05</span><span>);</span><span>
xrInput</span><span>.</span><span>xrOrigin</span><span>.</span><span>gripSpaces</span><span>.</span><span>left</span><span>.</span><span>add</span><span>(</span><span>gadget</span><span>);</span>
```

Head‑locked UI:

```
<span>const</span><span> hud </span><span>=</span><span> createReticleOrHUD</span><span>();</span><span>
hud</span><span>.</span><span>position</span><span>.</span><span>set</span><span>(</span><span>0</span><span>,</span><span> </span><span>0</span><span>,</span><span> </span><span>-</span><span>0.6</span><span>);</span><span>
xrInput</span><span>.</span><span>xrOrigin</span><span>.</span><span>head</span><span>.</span><span>add</span><span>(</span><span>hud</span><span>);</span>
```

## Coordinate spaces and conversions

-   `XROrigin` itself lives in world space and can be moved/rotated (e.g., for locomotion). Its children spaces receive poses relative to the XR reference space.-   To convert a world‑space point to origin‑local (for e.g., cursor placement), use Three.js helpers:

```
<span>const</span><span> pLocal </span><span>=</span><span> cursorWorld</span><span>.</span><span>clone</span><span>();</span><span>
xrInput</span><span>.</span><span>xrOrigin</span><span>.</span><span>worldToLocal</span><span>(</span><span>pLocal</span><span>);</span>
```

## Tips

-   Keep long‑lived objects parented under the appropriate space to avoid per‑frame copying of transforms.-   If you show secondary sources in your app, consider adding `secondaryRaySpaces`/`secondaryGripSpaces` under the origin to make their transforms visible in the scene graph.