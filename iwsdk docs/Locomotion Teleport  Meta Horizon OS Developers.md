Teleport offers high‑comfort navigation using a parabolic guide and a validated landing marker. It works with controllers and (optionally) hand micro‑gestures.

```
<span>world</span><span>.</span><span>registerSystem</span><span>(</span><span>TeleportSystem</span><span>,</span><span> </span><span>{</span><span>
  configData</span><span>:</span><span> </span><span>{</span><span>
    locomotor</span><span>,</span><span> </span><span>// shared Locomotor</span><span>
    rayGravity</span><span>:</span><span> </span><span>-</span><span>0.4</span><span>,</span><span> </span><span>// downward acceleration for arc</span><span>
    microGestureControlsEnabled</span><span>:</span><span> </span><span>false</span><span>,</span><span>
  </span><span>},</span><span>
</span><span>});</span>
```