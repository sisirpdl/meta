Understanding 3D transformations is crucial for WebXR development. Objects need to be positioned, rotated, and scaled correctly to feel natural in virtual space. This guide covers the fundamentals with practical examples.

## The three pillars of 3D transforms

Every 3D object has three fundamental properties:

```
<span>Transform</span><span> </span><span>=</span><span> </span><span>Position</span><span> </span><span>+</span><span> </span><span>Rotation</span><span> </span><span>+</span><span> </span><span>Scale</span><span>

</span><span>Position</span><span>:</span><span> </span><span>[</span><span>x</span><span>,</span><span> y</span><span>,</span><span> z</span><span>]</span><span>     </span><span>→</span><span> </span><span>Where</span><span> </span><span>is</span><span> it</span><span>?</span><span>
</span><span>Rotation</span><span>:</span><span> </span><span>[</span><span>x</span><span>,</span><span> y</span><span>,</span><span> z</span><span>,</span><span> w</span><span>]</span><span>  </span><span>→</span><span> </span><span>How</span><span> </span><span>is</span><span> it oriented</span><span>?</span><span> </span><span>(</span><span>quaternion</span><span>)</span><span>
</span><span>Scale</span><span>:</span><span>    </span><span>[</span><span>sx</span><span>,</span><span> sy</span><span>,</span><span> sz</span><span>]</span><span>  </span><span>→</span><span> </span><span>How</span><span> big </span><span>is</span><span> it</span><span>?</span>
```

In IWSDK, these are stored in the `Transform` component and automatically synced to Three.js.

## Position (translation)

Position determines **where** an object exists in 3D space.

### Understanding 3D coordinates

```
<span>IWSDK uses a right</span><span>-</span><span>handed coordinate system</span><span>:</span><span>
        </span><span>+</span><span>Y </span><span>(</span><span>up</span><span>)</span><span>
         </span><span>|</span><span>
         </span><span>|</span><span>
         </span><span>|</span><span>
    </span><span>----</span><span> </span><span>0</span><span> </span><span>----</span><span> </span><span>+</span><span>X </span><span>(</span><span>right</span><span>)</span><span>
        </span><span>/</span><span>
       </span><span>/</span><span>
    </span><span>+</span><span>Z </span><span>(</span><span>forward toward viewer</span><span>)</span>
```

**Real-world scale:** 1 unit = 1 meter (important for VR/AR)

### Working with position

```
<span>// Set absolute position</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>position</span><span>.</span><span>set</span><span>(</span><span>2</span><span>,</span><span> </span><span>1.7</span><span>,</span><span> </span><span>-</span><span>5</span><span>);</span><span>
</span><span>// Object appears 2m right, 1.7m up, 5m away</span><span>

</span><span>// Move relative to current position</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>position</span><span>.</span><span>x </span><span>+=</span><span> </span><span>1</span><span>;</span><span> </span><span>// Move 1 meter right</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>position</span><span>.</span><span>y </span><span>+=</span><span> </span><span>0</span><span>;</span><span> </span><span>// Same height</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>position</span><span>.</span><span>z </span><span>-=</span><span> </span><span>2</span><span>;</span><span> </span><span>// Move 2 meters away</span><span>

</span><span>// Or using ECS Transform for data-driven updates</span><span>
</span><span>const</span><span> pos </span><span>=</span><span> entity</span><span>.</span><span>getVectorView</span><span>(</span><span>Transform</span><span>,</span><span> </span><span>'position'</span><span>);</span><span>
pos</span><span>[</span><span>0</span><span>]</span><span> </span><span>+=</span><span> </span><span>1</span><span>;</span><span> </span><span>// Move 1 meter right</span><span>
pos</span><span>[</span><span>2</span><span>]</span><span> </span><span>-=</span><span> </span><span>2</span><span>;</span><span> </span><span>// Move 2 meters away</span>
```

### Common position patterns

**Moving Forward Based on Orientation:**

```
<span>// Create forward vector from object's rotation</span><span>
</span><span>const</span><span> forward </span><span>=</span><span> </span><span>new</span><span> </span><span>Vector3</span><span>(</span><span>0</span><span>,</span><span> </span><span>0</span><span>,</span><span> </span><span>-</span><span>1</span><span>);</span><span> </span><span>// -Z is forward</span><span>
forward</span><span>.</span><span>applyQuaternion</span><span>(</span><span>entity</span><span>.</span><span>object3D</span><span>.</span><span>quaternion</span><span>);</span><span>

</span><span>// Move in that direction</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>position</span><span>.</span><span>add</span><span>(</span><span>forward</span><span>.</span><span>multiplyScalar</span><span>(</span><span>speed </span><span>*</span><span> deltaTime</span><span>));</span>
```

**Positioning Relative to Another Object:**

```
<span>// Place object 2 meters in front of another object</span><span>
</span><span>const</span><span> forward </span><span>=</span><span> </span><span>new</span><span> </span><span>Vector3</span><span>(</span><span>0</span><span>,</span><span> </span><span>0</span><span>,</span><span> </span><span>-</span><span>2</span><span>);</span><span> </span><span>// 2 meters forward</span><span>
forward</span><span>.</span><span>applyQuaternion</span><span>(</span><span>referenceObject</span><span>.</span><span>quaternion</span><span>);</span><span>

entity</span><span>.</span><span>object3D</span><span>.</span><span>position</span><span>.</span><span>copy</span><span>(</span><span>referenceObject</span><span>.</span><span>position</span><span>).</span><span>add</span><span>(</span><span>forward</span><span>);</span>
```

## Rotation (orientation)

Rotation determines **how** an object is oriented in 3D space.

### Quaternions vs Euler angles

**IWSDK uses quaternions**`[x, y, z, w]` for rotation because:

**No gimbal lock** - can represent any 3D rotation **Smooth interpolation** - natural animation between rotations **Efficient composition** - combining rotations is just multiplication **WebXR standard** - matches what VR/AR hardware provides

**Euler angles**`[pitch, yaw, roll]` have problems:

-   Gimbal lock at certain angles-   Order dependency (XYZ vs YXZ gives different results)-   Difficult to interpolate smoothly

### Working with rotation

```
<span>// Identity rotation (no rotation)</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>quaternion</span><span>.</span><span>set</span><span>(</span><span>0</span><span>,</span><span> </span><span>0</span><span>,</span><span> </span><span>0</span><span>,</span><span> </span><span>1</span><span>);</span><span>

</span><span>// Rotate around Y-axis (yaw/turn)</span><span>
</span><span>const</span><span> yawQuat </span><span>=</span><span> </span><span>new</span><span> </span><span>Quaternion</span><span>().</span><span>setFromAxisAngle</span><span>(</span><span>
  </span><span>new</span><span> </span><span>Vector3</span><span>(</span><span>0</span><span>,</span><span> </span><span>1</span><span>,</span><span> </span><span>0</span><span>),</span><span> </span><span>// Y-axis</span><span>
  </span><span>Math</span><span>.</span><span>PI </span><span>/</span><span> </span><span>4</span><span>,</span><span> </span><span>// 45 degrees in radians</span><span>
</span><span>);</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>quaternion</span><span>.</span><span>copy</span><span>(</span><span>yawQuat</span><span>);</span><span>

</span><span>// Combine rotations</span><span>
</span><span>const</span><span> additionalRot </span><span>=</span><span> </span><span>new</span><span> </span><span>Quaternion</span><span>().</span><span>setFromAxisAngle</span><span>(</span><span>
  </span><span>new</span><span> </span><span>Vector3</span><span>(</span><span>0</span><span>,</span><span> </span><span>1</span><span>,</span><span> </span><span>0</span><span>),</span><span>
  deltaTime</span><span>,</span><span>
</span><span>);</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>quaternion</span><span>.</span><span>multiply</span><span>(</span><span>additionalRot</span><span>);</span>
```

### Common rotation patterns

**Look At Target:**

```
<span>// Make object look at a target position</span><span>
</span><span>const</span><span> targetPosition </span><span>=</span><span> </span><span>new</span><span> </span><span>Vector3</span><span>(</span><span>5</span><span>,</span><span> </span><span>0</span><span>,</span><span> </span><span>0</span><span>);</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>lookAt</span><span>(</span><span>targetPosition</span><span>);</span><span>

</span><span>// Or calculate direction manually</span><span>
</span><span>const</span><span> direction </span><span>=</span><span> </span><span>new</span><span> </span><span>Vector3</span><span>()</span><span>
  </span><span>.</span><span>subVectors</span><span>(</span><span>targetPosition</span><span>,</span><span> entity</span><span>.</span><span>object3D</span><span>.</span><span>position</span><span>)</span><span>
  </span><span>.</span><span>normalize</span><span>();</span><span>

</span><span>const</span><span> quaternion </span><span>=</span><span> </span><span>new</span><span> </span><span>Quaternion</span><span>().</span><span>setFromUnitVectors</span><span>(</span><span>
  </span><span>new</span><span> </span><span>Vector3</span><span>(</span><span>0</span><span>,</span><span> </span><span>0</span><span>,</span><span> </span><span>-</span><span>1</span><span>),</span><span> </span><span>// Forward vector</span><span>
  direction</span><span>,</span><span>
</span><span>);</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>quaternion</span><span>.</span><span>copy</span><span>(</span><span>quaternion</span><span>);</span>
```

**Rotation Over Time:**

```
<span>// Rotate continuously around Y-axis</span><span>
</span><span>const</span><span> rotationSpeed </span><span>=</span><span> </span><span>Math</span><span>.</span><span>PI</span><span>;</span><span> </span><span>// radians per second</span><span>
</span><span>const</span><span> deltaQuat </span><span>=</span><span> </span><span>new</span><span> </span><span>Quaternion</span><span>().</span><span>setFromAxisAngle</span><span>(</span><span>
  </span><span>new</span><span> </span><span>Vector3</span><span>(</span><span>0</span><span>,</span><span> </span><span>1</span><span>,</span><span> </span><span>0</span><span>),</span><span> </span><span>// Y-axis</span><span>
  rotationSpeed </span><span>*</span><span> deltaTime</span><span>,</span><span>
</span><span>);</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>quaternion</span><span>.</span><span>multiply</span><span>(</span><span>deltaQuat</span><span>);</span>
```

**Convert from Euler Angles (when needed):**

```
<span>// If you have pitch/yaw/roll from some source</span><span>
</span><span>const</span><span> euler </span><span>=</span><span> </span><span>new</span><span> </span><span>Euler</span><span>(</span><span>pitch</span><span>,</span><span> yaw</span><span>,</span><span> roll</span><span>,</span><span> </span><span>'YXZ'</span><span>);</span><span> </span><span>// Order matters!</span><span>
</span><span>const</span><span> quaternion </span><span>=</span><span> </span><span>new</span><span> </span><span>Quaternion</span><span>().</span><span>setFromEuler</span><span>(</span><span>euler</span><span>);</span><span>
entity</span><span>.</span><span>setValue</span><span>(</span><span>Transform</span><span>,</span><span> </span><span>'orientation'</span><span>,</span><span> quaternion</span><span>.</span><span>toArray</span><span>());</span>
```

## Scale

Scale determines **how big** an object appears.

### Understanding scale values

```
<span>// Uniform scale (same in all directions)</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>scale</span><span>.</span><span>set</span><span>(</span><span>2</span><span>,</span><span> </span><span>2</span><span>,</span><span> </span><span>2</span><span>);</span><span> </span><span>// 2x bigger</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>scale</span><span>.</span><span>set</span><span>(</span><span>0.5</span><span>,</span><span> </span><span>0.5</span><span>,</span><span> </span><span>0.5</span><span>);</span><span> </span><span>// Half size</span><span>

</span><span>// Non-uniform scale</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>scale</span><span>.</span><span>set</span><span>(</span><span>2</span><span>,</span><span> </span><span>1</span><span>,</span><span> </span><span>0.5</span><span>);</span><span>
</span><span>// 2x wider, same height, half depth</span>
```

### Scale in WebXR context

**Real-world considerations:**

-   Users expect consistent sizing (door ≈ 2m tall)-   Very small/large scales can cause rendering issues-   Consider user interaction when sizing objects

```
<span>// Make object child-sized for interaction</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>scale</span><span>.</span><span>set</span><span>(</span><span>0.6</span><span>,</span><span> </span><span>0.6</span><span>,</span><span> </span><span>0.6</span><span>);</span><span>

</span><span>// Scale text based on distance for readability</span><span>
</span><span>const</span><span> distance </span><span>=</span><span> entity</span><span>.</span><span>object3D</span><span>.</span><span>position</span><span>.</span><span>distanceTo</span><span>(</span><span>camera</span><span>.</span><span>position</span><span>);</span><span>
</span><span>const</span><span> textScale </span><span>=</span><span> </span><span>Math</span><span>.</span><span>max</span><span>(</span><span>0.5</span><span>,</span><span> distance </span><span>*</span><span> </span><span>0.1</span><span>);</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>scale</span><span>.</span><span>set</span><span>(</span><span>textScale</span><span>,</span><span> textScale</span><span>,</span><span> textScale</span><span>);</span>
```

## Local vs world space

Understanding coordinate spaces is crucial for hierarchical objects.

### Coordinate spaces explained

```
<span>World</span><span> </span><span>Space</span><span>:</span><span> </span><span>Global</span><span> coordinate system </span><span>(</span><span>the scene</span><span>)</span><span>
</span><span>├─</span><span> </span><span>Car</span><span> </span><span>Entity</span><span> </span><span>(</span><span>world position</span><span>:</span><span> </span><span>[</span><span>10</span><span>,</span><span> </span><span>0</span><span>,</span><span> </span><span>5</span><span>])</span><span>
    </span><span>└─</span><span> </span><span>Local</span><span> </span><span>Space</span><span>:</span><span> </span><span>Relative</span><span> to car
       </span><span>├─</span><span> </span><span>Wheel</span><span> </span><span>(</span><span>local</span><span> position</span><span>:</span><span> </span><span>[-</span><span>2</span><span>,</span><span> </span><span>-</span><span>0.5</span><span>,</span><span> </span><span>1</span><span>])</span><span>
       </span><span>└─</span><span> </span><span>Door</span><span> </span><span>(</span><span>local</span><span> position</span><span>:</span><span> </span><span>[</span><span>0</span><span>,</span><span> </span><span>0</span><span>,</span><span> </span><span>1.5</span><span>])</span>
```

**World positions:** Where things actually are in the scene **Local positions:** Where things are relative to their parent

### Working with coordinate spaces

```
<span>// Get world position of a child object</span><span>
</span><span>const</span><span> worldPos </span><span>=</span><span> child</span><span>.</span><span>object3D</span><span>!.</span><span>getWorldPosition</span><span>(</span><span>new</span><span> </span><span>Vector3</span><span>());</span><span>

</span><span>// Convert local point to world space</span><span>
</span><span>const</span><span> localPoint </span><span>=</span><span> </span><span>new</span><span> </span><span>Vector3</span><span>(</span><span>0</span><span>,</span><span> </span><span>0</span><span>,</span><span> </span><span>-</span><span>1</span><span>);</span><span> </span><span>// 1 meter forward in local space</span><span>
</span><span>const</span><span> worldPoint </span><span>=</span><span> localPoint</span><span>.</span><span>applyMatrix4</span><span>(</span><span>entity</span><span>.</span><span>object3D</span><span>!.</span><span>matrixWorld</span><span>);</span><span>

</span><span>// Convert world point to local space</span><span>
</span><span>const</span><span> worldPoint </span><span>=</span><span> </span><span>new</span><span> </span><span>Vector3</span><span>(</span><span>5</span><span>,</span><span> </span><span>2</span><span>,</span><span> </span><span>0</span><span>);</span><span>
</span><span>const</span><span> localPoint </span><span>=</span><span> worldPoint</span><span>.</span><span>applyMatrix4</span><span>(</span><span>entity</span><span>.</span><span>object3D</span><span>!.</span><span>worldToLocal</span><span>);</span>
```

### Hierarchical movement example

```
<span>// Create a car with wheels as children</span><span>
</span><span>const</span><span> car </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>();</span><span>
</span><span>const</span><span> wheel1 </span><span>=</span><span> </span><span>new</span><span> </span><span>Mesh</span><span>(</span><span>wheelGeometry</span><span>,</span><span> wheelMaterial</span><span>);</span><span>
</span><span>const</span><span> wheel2 </span><span>=</span><span> </span><span>new</span><span> </span><span>Mesh</span><span>(</span><span>wheelGeometry</span><span>,</span><span> wheelMaterial</span><span>);</span><span>

car</span><span>.</span><span>object3D</span><span>.</span><span>add</span><span>(</span><span>wheel1</span><span>);</span><span>
car</span><span>.</span><span>object3D</span><span>.</span><span>add</span><span>(</span><span>wheel2</span><span>);</span><span>

</span><span>// Position wheels relative to car</span><span>
wheel1</span><span>.</span><span>position</span><span>.</span><span>set</span><span>(-</span><span>1</span><span>,</span><span> </span><span>-</span><span>0.5</span><span>,</span><span> </span><span>1.2</span><span>);</span><span>
wheel2</span><span>.</span><span>position</span><span>.</span><span>set</span><span>(</span><span>1</span><span>,</span><span> </span><span>-</span><span>0.5</span><span>,</span><span> </span><span>1.2</span><span>);</span><span>

</span><span>// Move car - wheels follow automatically</span><span>
car</span><span>.</span><span>object3D</span><span>.</span><span>position</span><span>.</span><span>x </span><span>+=</span><span> speed </span><span>*</span><span> deltaTime</span><span>;</span><span>

</span><span>// Rotate wheels in local space</span><span>
wheel1</span><span>.</span><span>rotateX</span><span>((</span><span>speed </span><span>*</span><span> deltaTime</span><span>)</span><span> </span><span>/</span><span> wheelRadius</span><span>);</span><span>
wheel2</span><span>.</span><span>rotateX</span><span>((</span><span>speed </span><span>*</span><span> deltaTime</span><span>)</span><span> </span><span>/</span><span> wheelRadius</span><span>);</span>
```

## Performance optimization

### Direct Object3D vs ECS updates

```
<span>// For frequent updates, direct Three.js can be faster</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>position</span><span>.</span><span>x </span><span>+=</span><span> deltaX</span><span>;</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>position</span><span>.</span><span>y </span><span>+=</span><span> deltaY</span><span>;</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>position</span><span>.</span><span>z </span><span>+=</span><span> deltaZ</span><span>;</span><span>

</span><span>// For data-driven updates, use ECS Transform</span><span>
</span><span>const</span><span> pos </span><span>=</span><span> entity</span><span>.</span><span>getVectorView</span><span>(</span><span>Transform</span><span>,</span><span> </span><span>'position'</span><span>);</span><span>
pos</span><span>[</span><span>0</span><span>]</span><span> </span><span>+=</span><span> deltaX</span><span>;</span><span>
pos</span><span>[</span><span>1</span><span>]</span><span> </span><span>+=</span><span> deltaY</span><span>;</span><span>
pos</span><span>[</span><span>2</span><span>]</span><span> </span><span>+=</span><span> deltaZ</span><span>;</span>
```

### Avoid unnecessary calculations

```
<span>// Recalculating every frame</span><span>
</span><span>const</span><span> forward </span><span>=</span><span> </span><span>new</span><span> </span><span>Vector3</span><span>(</span><span>0</span><span>,</span><span> </span><span>0</span><span>,</span><span> </span><span>-</span><span>1</span><span>).</span><span>applyQuaternion</span><span>(</span><span>
  entity</span><span>.</span><span>object3D</span><span>.</span><span>quaternion</span><span>,</span><span>
</span><span>);</span><span>

</span><span>// Reuse vectors when possible</span><span>
</span><span>const</span><span> forward </span><span>=</span><span> </span><span>new</span><span> </span><span>Vector3</span><span>(</span><span>0</span><span>,</span><span> </span><span>0</span><span>,</span><span> </span><span>-</span><span>1</span><span>);</span><span>
forward</span><span>.</span><span>applyQuaternion</span><span>(</span><span>entity</span><span>.</span><span>object3D</span><span>.</span><span>quaternion</span><span>);</span><span>

</span><span>// Cache complex calculations</span><span>
</span><span>let</span><span> lastRotation </span><span>=</span><span> entity</span><span>.</span><span>object3D</span><span>.</span><span>quaternion</span><span>.</span><span>clone</span><span>();</span><span>
</span><span>let</span><span> cachedForward </span><span>=</span><span> </span><span>new</span><span> </span><span>Vector3</span><span>(</span><span>0</span><span>,</span><span> </span><span>0</span><span>,</span><span> </span><span>-</span><span>1</span><span>).</span><span>applyQuaternion</span><span>(</span><span>lastRotation</span><span>);</span><span>

</span><span>if</span><span> </span><span>(!</span><span>entity</span><span>.</span><span>object3D</span><span>.</span><span>quaternion</span><span>.</span><span>equals</span><span>(</span><span>lastRotation</span><span>))</span><span> </span><span>{</span><span>
  lastRotation</span><span>.</span><span>copy</span><span>(</span><span>entity</span><span>.</span><span>object3D</span><span>.</span><span>quaternion</span><span>);</span><span>
  cachedForward</span><span>.</span><span>set</span><span>(</span><span>0</span><span>,</span><span> </span><span>0</span><span>,</span><span> </span><span>-</span><span>1</span><span>).</span><span>applyQuaternion</span><span>(</span><span>lastRotation</span><span>);</span><span>
</span><span>}</span>
```

## Summary

**Key Takeaways:**

-   **Position**`[x, y, z]` - where objects exist in meters-   **Rotation**`[x, y, z, w]` - quaternions for orientation (no gimbal lock)-   **Scale**`[sx, sy, sz]` - size multipliers-   **Use vector views** for performance in hot paths-   **IWSDK syncs automatically** - update ECS, visuals follow-   **WebXR scale matters** - 1 unit = 1 meter in real space-   **Understand coordinate spaces** - local vs world for hierarchical objects

Understanding these fundamentals enables you to build natural-feeling VR/AR experiences where objects move, rotate, and scale predictably in 3D space.