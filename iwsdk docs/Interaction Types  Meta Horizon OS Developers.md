IWSDK’s grabbing system provides three distinct interaction patterns, each implemented with different handle configurations and pointer management strategies. Understanding their architectural differences helps choose the right pattern for specific use cases.

## One-Hand Grabbing

Single-controller direct manipulation optimized for immediate, responsive interactions.

### Architecture Characteristics

-   **Handle Configuration**: `multitouch: false`, `projectRays: false`-   **Pointer Events**: `pointerEventsType: { deny: 'ray' }` — prevents ray interference-   **Transform Support**: Translation and rotation only (no scaling)

### Implementation Details

The system creates a standard `HandleStore` with constraints derived directly from component properties:

```
<span>// Simplified handle creation from GrabSystem</span><span>
</span><span>const</span><span> handle </span><span>=</span><span> </span><span>new</span><span> </span><span>HandleStore</span><span>(</span><span>object</span><span>,</span><span> </span><span>()</span><span> </span><span>=&gt;</span><span> </span><span>({</span><span>
  rotate</span><span>:</span><span> entity</span><span>.</span><span>getValue</span><span>(</span><span>OneHandGrabbable</span><span>,</span><span> </span><span>'rotate'</span><span>)</span><span> </span><span>?</span><span> </span><span>{</span><span>
    x</span><span>:</span><span> </span><span>[</span><span>rotateMin</span><span>[</span><span>0</span><span>],</span><span> rotateMax</span><span>[</span><span>0</span><span>]],</span><span>
    y</span><span>:</span><span> </span><span>[</span><span>rotateMin</span><span>[</span><span>1</span><span>],</span><span> rotateMax</span><span>[</span><span>1</span><span>]],</span><span>
    z</span><span>:</span><span> </span><span>[</span><span>rotateMin</span><span>[</span><span>2</span><span>],</span><span> rotateMax</span><span>[</span><span>2</span><span>]]</span><span>
  </span><span>}</span><span> </span><span>:</span><span> </span><span>false</span><span>,</span><span>
  translate</span><span>:</span><span> entity</span><span>.</span><span>getValue</span><span>(</span><span>OneHandGrabbable</span><span>,</span><span> </span><span>'translate'</span><span>)</span><span> </span><span>?</span><span> </span><span>{</span><span>
    x</span><span>:</span><span> </span><span>[</span><span>translateMin</span><span>[</span><span>0</span><span>],</span><span> translateMax</span><span>[</span><span>0</span><span>]],</span><span>
    y</span><span>:</span><span> </span><span>[</span><span>translateMin</span><span>[</span><span>1</span><span>],</span><span> translateMax</span><span>[</span><span>1</span><span>]],</span><span>
    z</span><span>:</span><span> </span><span>[</span><span>translateMin</span><span>[</span><span>2</span><span>],</span><span> translateMax</span><span>[</span><span>2</span><span>]]</span><span>
  </span><span>}</span><span> </span><span>:</span><span> </span><span>false</span><span>,</span><span>
  multitouch</span><span>:</span><span> </span><span>false</span><span>  </span><span>// Single pointer only</span><span>
</span><span>}));</span>
```

### Design Trade-offs

-   **Immediacy vs Complexity** — Instant response but limited to basic transformations-   **Simplicity vs Capability** — Easy to predict behavior but no scaling operations-   **Performance vs Features** — Minimal overhead but fewer manipulation options

### Best Use Cases

-   Interactive tools and instruments (valves, levers, handles)-   Simple object repositioning-   Quick grab-and-move interactions-   Objects that should maintain their scale

## Two-Hand Grabbing

Dual-controller manipulation enabling advanced operations including scaling through multi-pointer coordination.

### Architecture Characteristics

-   **Handle Configuration**: `multitouch: true`, enables dual-pointer calculations-   **Pointer Events**: `pointerEventsType: { deny: 'ray' }` — same ray denial as one-hand-   **Transform Support**: Translation, rotation, and scaling

### Multi-Pointer Mathematics

Two-hand grabbing uses the relationship between controllers to derive transformations:

-   **Translation**: Controlled by primary hand position-   **Rotation**: Derived from the orientation relationship between hands-   **Scaling**: Based on the distance between controllers — closer hands reduce scale, farther hands increase scale

### Implementation Details

The handle configuration enables multitouch and adds scaling constraints:

```
<span>const</span><span> handle </span><span>=</span><span> </span><span>new</span><span> </span><span>HandleStore</span><span>(</span><span>object</span><span>,</span><span> </span><span>()</span><span> </span><span>=&gt;</span><span> </span><span>({</span><span>
  rotate</span><span>:</span><span> </span><span>/* rotation constraints */</span><span>,</span><span>
  translate</span><span>:</span><span> </span><span>/* translation constraints */</span><span>,</span><span>
  scale</span><span>:</span><span> entity</span><span>.</span><span>getValue</span><span>(</span><span>TwoHandsGrabbable</span><span>,</span><span> </span><span>'scale'</span><span>)</span><span> </span><span>?</span><span> </span><span>{</span><span>
    x</span><span>:</span><span> </span><span>[</span><span>scaleMin</span><span>[</span><span>0</span><span>],</span><span> scaleMax</span><span>[</span><span>0</span><span>]],</span><span>
    y</span><span>:</span><span> </span><span>[</span><span>scaleMin</span><span>[</span><span>1</span><span>],</span><span> scaleMax</span><span>[</span><span>1</span><span>]],</span><span>
    z</span><span>:</span><span> </span><span>[</span><span>scaleMin</span><span>[</span><span>2</span><span>],</span><span> scaleMax</span><span>[</span><span>2</span><span>]]</span><span>
  </span><span>}</span><span> </span><span>:</span><span> </span><span>false</span><span>,</span><span>
  multitouch</span><span>:</span><span> </span><span>true</span><span>  </span><span>// Enables dual-pointer processing</span><span>
</span><span>}));</span>
```

### Design Trade-offs

-   **Capability vs Complexity** — Supports scaling but requires coordination between hands-   **Precision vs Effort** — Enables precise manipulation but demands two-hand engagement-   **Features vs Performance** — Rich interaction set but higher computational cost

### Best Use Cases

-   Resizable objects (artwork, models, UI panels)-   Precise positioning tasks requiring stability-   Objects where scale adjustment is important-   Complex manipulation requiring both hands’ dexterity

## Distance Grabbing

Ray-based remote manipulation with specialized movement algorithms for telekinetic-style interactions.

### Architecture Characteristics

-   **Handle Configuration**: Custom `DistanceGrabHandle` class with movement mode algorithms-   **Pointer Events**: `pointerEventsType: { deny: 'grab' }` — opposite configuration from direct grabbing-   **Transform Support**: Translation, rotation, and scaling with mode-specific behaviors

### Movement Mode Algorithms

Distance grabbing implements four distinct movement algorithms:

#### MoveTowardsTarget Algorithm

```
<span>// From DistanceGrabHandle.update()</span><span>
</span><span>const</span><span> pointerOrigin </span><span>=</span><span> p1</span><span>.</span><span>pointerWorldOrigin</span><span>;</span><span>
</span><span>const</span><span> distance </span><span>=</span><span> pointerOrigin</span><span>.</span><span>distanceTo</span><span>(</span><span>position</span><span>);</span><span>

</span><span>if</span><span> </span><span>(</span><span>distance </span><span>&gt;</span><span> </span><span>this</span><span>.</span><span>moveSpeed</span><span>)</span><span> </span><span>{</span><span>
  </span><span>const</span><span> step </span><span>=</span><span> pointerOrigin</span><span>.</span><span>sub</span><span>(</span><span>position</span><span>)</span><span>
    </span><span>.</span><span>normalize</span><span>()</span><span>
    </span><span>.</span><span>multiplyScalar</span><span>(</span><span>this</span><span>.</span><span>moveSpeed</span><span>);</span><span>
  position</span><span>.</span><span>add</span><span>(</span><span>step</span><span>);</span><span>
</span><span>}</span><span> </span><span>else</span><span> </span><span>{</span><span>
  </span><span>// Snap to target when close enough</span><span>
  position</span><span>.</span><span>copy</span><span>(</span><span>pointerOrigin</span><span>);</span><span>
  quaternion</span><span>.</span><span>copy</span><span>(</span><span>p1</span><span>.</span><span>pointerWorldQuaternion</span><span>);</span><span>
</span><span>}</span>
```

#### MoveAtSource Algorithm

```
<span>// Delta-based movement tracking</span><span>
</span><span>const</span><span> current </span><span>=</span><span> p1</span><span>.</span><span>pointerWorldOrigin</span><span>;</span><span>
</span><span>if</span><span> </span><span>(</span><span>this</span><span>.</span><span>previousPointerOrigin </span><span>!=</span><span> </span><span>undefined</span><span>)</span><span> </span><span>{</span><span>
  </span><span>const</span><span> delta </span><span>=</span><span> current</span><span>.</span><span>sub</span><span>(</span><span>this</span><span>.</span><span>previousPointerOrigin</span><span>);</span><span>
  position</span><span>.</span><span>add</span><span>(</span><span>delta</span><span>);</span><span>
</span><span>}</span><span>
</span><span>this</span><span>.</span><span>previousPointerOrigin</span><span>.</span><span>copy</span><span>(</span><span>current</span><span>);</span>
```

#### MoveFromTarget & RotateAtSource

-   **MoveFromTarget**: Direct 1:1 mapping with ray endpoint (delegates to standard handle)-   **RotateAtSource**: Rotation-only mode with automatic translation/scale disabling

### Pointer Event Strategy

Distance grabbing uses a reverse pointer event configuration to prevent conflicts:

```
<span>// Distance grabbable objects deny grab pointers, accept rays</span><span>
obj</span><span>.</span><span>pointerEventsType </span><span>=</span><span> </span><span>{</span><span> deny</span><span>:</span><span> </span><span>'grab'</span><span> </span><span>};</span><span>

</span><span>// Versus direct grabbing which denies rays</span><span>
obj</span><span>.</span><span>pointerEventsType </span><span>=</span><span> </span><span>{</span><span> deny</span><span>:</span><span> </span><span>'ray'</span><span> </span><span>};</span>
```

### Return-to-Origin Mechanics

The `returnToOrigin` feature overrides the standard handle application:

```
<span>// From DistanceGrabHandle.apply()</span><span>
</span><span>if</span><span> </span><span>(</span><span>this</span><span>.</span><span>returnToOrigin </span><span>&amp;&amp;</span><span> </span><span>this</span><span>.</span><span>outputState</span><span>?.</span><span>last</span><span>)</span><span> </span><span>{</span><span>
  target</span><span>.</span><span>position</span><span>.</span><span>copy</span><span>(</span><span>this</span><span>.</span><span>initialTargetPosition</span><span>);</span><span>
  target</span><span>.</span><span>quaternion</span><span>.</span><span>copy</span><span>(</span><span>this</span><span>.</span><span>initialTargetQuaternion</span><span>);</span><span>
  target</span><span>.</span><span>scale</span><span>.</span><span>copy</span><span>(</span><span>this</span><span>.</span><span>initialTargetScale</span><span>);</span><span>
  </span><span>return</span><span>;</span><span> </span><span>// Skip standard handle application</span><span>
</span><span>}</span>
```

### Design Trade-offs

-   **Reach vs Directness** — Can interact with any visible object but lacks direct tactile feedback-   **Flexibility vs Predictability** — Multiple movement modes provide options but require mode selection-   **Magic vs Realism** — Enables impossible interactions but may feel less grounded

### Best Use Cases

-   Out-of-reach objects in large environments-   Magical or supernatural interaction themes-   Accessibility — reaching objects without physical movement-   Telekinetic gameplay mechanics

## Selection Guidelines

### Interaction Context

-   **Immediate objects**: Use direct grabbing (one/two-hand)-   **Remote objects**: Use distance grabbing-   **Resizable content**: Requires two-hand grabbing-   **Tool-like objects**: Usually one-hand grabbing

### User Experience Patterns

Most applications combine multiple grabbing types:

-   **Gallery Setup**: Paintings (one-hand rotation-only), Sculptures (two-hand with scaling), Floating artifacts (distance with return-to-origin)-   **Workshop Environment**: Tools (one-hand), Workpieces (two-hand), Stored materials (distance)-   **Gaming Context**: Weapons (one-hand), Interactive objects (two-hand), Magic items (distance)

The system’s automatic handle management makes it seamless to use different grabbing types on different objects within the same scene.