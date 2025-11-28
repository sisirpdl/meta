Turning rotates the player rig around the vertical axis. IWSDK supports snap turns (instant yaw steps) and smooth turns (continuous yaw), controlled with the right thumbstick or optional hand micro‑gestures.

```
<span>import</span><span> </span><span>{</span><span> </span><span>TurnSystem</span><span>,</span><span> </span><span>TurningMethod</span><span> </span><span>}</span><span> </span><span>from</span><span> </span><span>'@iwsdk/core/locomotion'</span><span>;</span><span>

world</span><span>.</span><span>registerSystem</span><span>(</span><span>TurnSystem</span><span>,</span><span> </span><span>{</span><span>
  configData</span><span>:</span><span> </span><span>{</span><span>
    turningMethod</span><span>:</span><span> </span><span>TurningMethod</span><span>.</span><span>SnapTurn</span><span>,</span><span>
    turningAngle</span><span>:</span><span> </span><span>45</span><span>,</span><span> </span><span>// degrees per snap</span><span>
    turningSpeed</span><span>:</span><span> </span><span>180</span><span>,</span><span> </span><span>// degrees/second for smooth mode</span><span>
    microGestureControlsEnabled</span><span>:</span><span> </span><span>false</span><span>,</span><span>
  </span><span>},</span><span>
</span><span>});</span>
```