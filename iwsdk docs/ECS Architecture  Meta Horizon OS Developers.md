Deep dive into how IWSDK’s ECS architecture enables scalable, performant WebXR applications.

## Data-oriented design

ECS follows data-oriented design principles that are especially important for VR performance:

### Memory layout: Why columnar storage matters

Traditional OOP stores objects like this:

```
<span>PlayerObject</span><span> </span><span>{</span><span> health</span><span>:</span><span> </span><span>100</span><span>,</span><span> position</span><span>:</span><span> </span><span>[</span><span>0</span><span>,</span><span>1</span><span>,</span><span>0</span><span>],</span><span> velocity</span><span>:</span><span> </span><span>[</span><span>1</span><span>,</span><span>0</span><span>,</span><span>0</span><span>]</span><span> </span><span>}</span><span>
</span><span>EnemyObject</span><span>  </span><span>{</span><span> health</span><span>:</span><span> </span><span>50</span><span>,</span><span>  position</span><span>:</span><span> </span><span>[</span><span>5</span><span>,</span><span>1</span><span>,</span><span>2</span><span>],</span><span> velocity</span><span>:</span><span> </span><span>[-</span><span>1</span><span>,</span><span>0</span><span>,</span><span>0</span><span>]</span><span> </span><span>}</span>
```

ECS stores the same data like this:

```
<span>Health</span><span>:</span><span>    </span><span>[</span><span>100</span><span>,</span><span> </span><span>50</span><span>,</span><span> </span><span>75</span><span>,</span><span> </span><span>...]</span><span>  </span><span>// all health values together</span><span>
</span><span>Position</span><span>:</span><span>  </span><span>[</span><span>0</span><span>,</span><span>1</span><span>,</span><span>0</span><span>,</span><span> </span><span>5</span><span>,</span><span>1</span><span>,</span><span>2</span><span>,</span><span> </span><span>...]</span><span>  </span><span>// all positions together</span><span>
</span><span>Velocity</span><span>:</span><span>  </span><span>[</span><span>1</span><span>,</span><span>0</span><span>,</span><span>0</span><span>,</span><span> </span><span>-</span><span>1</span><span>,</span><span>0</span><span>,</span><span>0</span><span>,</span><span> </span><span>...]</span><span> </span><span>// all velocities together</span>
```

**Why this matters in VR:**

-   **Cache efficiency**: When updating health, we only touch health data (no position/velocity)-   **SIMD potential**: Process multiple health values in parallel-   **Memory predictability**: Reduces cache misses during frame-critical updates

### Query performance model

Queries use bitmasking for O(1) component checks:

```
<span>Entity</span><span> </span><span>12</span><span>:</span><span> </span><span>Health</span><span>(✓)</span><span> </span><span>+</span><span> </span><span>Position</span><span>(✓)</span><span> </span><span>+</span><span> AI</span><span>(✓)</span><span>     </span><span>=</span><span> bitmask</span><span>:</span><span> </span><span>00000111</span><span>
</span><span>Entity</span><span> </span><span>37</span><span>:</span><span> </span><span>Health</span><span>(✓)</span><span> </span><span>+</span><span> </span><span>Position</span><span>(✓)</span><span> </span><span>+</span><span> </span><span>Player</span><span>(✓)</span><span> </span><span>=</span><span> bitmask</span><span>:</span><span> </span><span>00001011</span><span>

</span><span>Query</span><span> </span><span>{</span><span> required</span><span>:</span><span> </span><span>[</span><span>Health</span><span>,</span><span> </span><span>Position</span><span>]</span><span> </span><span>}</span><span>          </span><span>=</span><span> mask</span><span>:</span><span>    </span><span>00000011</span><span>
  </span><span>└─</span><span> </span><span>Entity</span><span> </span><span>12</span><span>:</span><span> </span><span>(</span><span>00000111</span><span> </span><span>&amp;</span><span> </span><span>00000011</span><span>)</span><span> </span><span>==</span><span> </span><span>00000011</span><span> </span><span>✓</span><span> matches
  </span><span>└─</span><span> </span><span>Entity</span><span> </span><span>37</span><span>:</span><span> </span><span>(</span><span>00001011</span><span> </span><span>&amp;</span><span> </span><span>00000011</span><span>)</span><span> </span><span>==</span><span> </span><span>00000011</span><span> </span><span>✓</span><span> matches</span>
```

This makes “find all entities with Health + Position” extremely fast even with thousands of entities.

## WebXR frame budget

VR applications must hit 72-90fps consistently. IWSDK’s ECS helps by:

### System priority architecture

```
<span>Frame</span><span> </span><span>Budget</span><span> </span><span>(</span><span>11ms</span><span> </span><span>for</span><span> </span><span>90fps</span><span>):</span><span>
</span><span>┌─</span><span> </span><span>Input</span><span> </span><span>System</span><span> </span><span>(-</span><span>4</span><span>)</span><span>          </span><span>│</span><span> </span><span>1ms</span><span>  </span><span>│</span><span> </span><span>Read</span><span> controllers</span><span>,</span><span> hands
</span><span>├─</span><span> </span><span>Locomotion</span><span> </span><span>(-</span><span>5</span><span>)</span><span>            </span><span>│</span><span> </span><span>2ms</span><span>  </span><span>│</span><span> </span><span>Update</span><span> player movement
</span><span>├─</span><span> </span><span>Physics</span><span> </span><span>(-</span><span>2</span><span>)</span><span>               </span><span>│</span><span> </span><span>3ms</span><span>  </span><span>│</span><span> </span><span>Collision</span><span> detection
</span><span>├─</span><span> </span><span>Game</span><span> </span><span>Logic</span><span> </span><span>(</span><span>0</span><span>)</span><span>             </span><span>│</span><span> </span><span>2ms</span><span>  </span><span>│</span><span> </span><span>Your</span><span> gameplay systems
</span><span>├─</span><span> UI </span><span>System</span><span> </span><span>(</span><span>1</span><span>)</span><span>              </span><span>│</span><span> </span><span>1ms</span><span>  </span><span>│</span><span> </span><span>Update</span><span> spatial panels
</span><span>└─</span><span> </span><span>Render</span><span> prep </span><span>(</span><span>2</span><span>)</span><span>            </span><span>│</span><span> </span><span>2ms</span><span>  </span><span>│</span><span> </span><span>Frustum</span><span> culling</span><span>,</span><span> LOD
                              </span><span>└────┘</span><span>
                               </span><span>11ms</span><span> total budget</span>
```

Systems with more negative priority run first, ensuring input lag stays minimal.

### Query-driven optimization

Smart systems only process entities that need updates:

```
<span>export</span><span> </span><span>class</span><span> </span><span>LODSystem</span><span> </span><span>extends</span><span> createSystem</span><span>({</span><span>
  </span><span>// Only process visible objects that moved</span><span>
  needsLODUpdate</span><span>:</span><span> </span><span>{</span><span>
    required</span><span>:</span><span> </span><span>[</span><span>Mesh</span><span>,</span><span> </span><span>Transform</span><span>,</span><span> </span><span>Visibility</span><span>],</span><span>
    </span><span>where</span><span>:</span><span> </span><span>[</span><span>eq</span><span>(</span><span>Visibility</span><span>,</span><span> </span><span>'changed'</span><span>,</span><span> </span><span>true</span><span>)],</span><span>
  </span><span>},</span><span>
</span><span>})</span><span> </span><span>{</span><span>
  update</span><span>()</span><span> </span><span>{</span><span>
    </span><span>// Process only moved, visible objects</span><span>
    </span><span>for</span><span> </span><span>(</span><span>const</span><span> entity of </span><span>this</span><span>.</span><span>queries</span><span>.</span><span>needsLODUpdate</span><span>.</span><span>entities</span><span>)</span><span> </span><span>{</span><span>
      </span><span>// Update level-of-detail based on distance to camera</span><span>
      </span><span>this</span><span>.</span><span>updateLOD</span><span>(</span><span>entity</span><span>);</span><span>
      entity</span><span>.</span><span>setValue</span><span>(</span><span>Visibility</span><span>,</span><span> </span><span>'changed'</span><span>,</span><span> </span><span>false</span><span>);</span><span>
    </span><span>}</span><span>
  </span><span>}</span><span>
</span><span>}</span>
```

## Composition patterns for WebXR

### Feature composition

Build complex VR interactions through component composition:

```
<span>// Make any object grabbable</span><span>
entity</span><span>.</span><span>addComponent</span><span>(</span><span>Grabbable</span><span>);</span><span>
entity</span><span>.</span><span>addComponent</span><span>(</span><span>RigidBody</span><span>);</span><span> </span><span>// Physics integration</span><span>

</span><span>// Make it also glowable</span><span>
entity</span><span>.</span><span>addComponent</span><span>(</span><span>Interactable</span><span>,</span><span> </span><span>{</span><span> glowColor</span><span>:</span><span> </span><span>[</span><span>0</span><span>,</span><span> </span><span>1</span><span>,</span><span> </span><span>0</span><span>]</span><span> </span><span>});</span><span>

</span><span>// Make it respond to voice commands</span><span>
entity</span><span>.</span><span>addComponent</span><span>(</span><span>VoiceTarget</span><span>,</span><span> </span><span>{</span><span> keywords</span><span>:</span><span> </span><span>[</span><span>'pick up'</span><span>,</span><span> </span><span>'grab'</span><span>]</span><span> </span><span>});</span>
```

Each system operates independently — GrabSystem, GlowSystem, VoiceSystem all work together without knowing about each other.

### Hierarchical entities

WebXR often needs nested objects (hand → fingers → joints):

```
<span>// Create hand hierarchy</span><span>
</span><span>const</span><span> hand </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>();</span><span>
hand</span><span>.</span><span>addComponent</span><span>(</span><span>HandTracking</span><span>);</span><span>

</span><span>const</span><span> thumb </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>(</span><span>undefined</span><span>,</span><span> </span><span>{</span><span> parent</span><span>:</span><span> hand </span><span>});</span><span>
thumb</span><span>.</span><span>addComponent</span><span>(</span><span>FingerJoint</span><span>,</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>'thumb'</span><span> </span><span>});</span><span>

</span><span>const</span><span> index </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>(</span><span>undefined</span><span>,</span><span> </span><span>{</span><span> parent</span><span>:</span><span> hand </span><span>});</span><span>
index</span><span>.</span><span>addComponent</span><span>(</span><span>FingerJoint</span><span>,</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>'index'</span><span> </span><span>});</span>
```

Transform system automatically handles parent-child matrix updates.

## Scale and performance characteristics

### Entity limits

-   **Lightweight entities**: ~1000-5000 active entities typical for VR scenes-   **Component overhead**: ~8 bytes per component per entity (just indices)-   **System overhead**: ~0.1ms per system with empty queries

### Query optimization

```
<span>// Inefficient: checks every entity every frame</span><span>
</span><span>for</span><span> </span><span>(</span><span>const</span><span> entity of world</span><span>.</span><span>entities</span><span>)</span><span> </span><span>{</span><span>
  </span><span>if</span><span> </span><span>(</span><span>entity</span><span>.</span><span>hasComponent</span><span>(</span><span>Health</span><span>)</span><span> </span><span>&amp;&amp;</span><span> entity</span><span>.</span><span>hasComponent</span><span>(</span><span>AI</span><span>))</span><span> </span><span>{</span><span>
    </span><span>// process</span><span>
  </span><span>}</span><span>
</span><span>}</span><span>

</span><span>// Efficient: precomputed set, direct iteration</span><span>
</span><span>for</span><span> </span><span>(</span><span>const</span><span> entity of </span><span>this</span><span>.</span><span>queries</span><span>.</span><span>healthyAI</span><span>.</span><span>entities</span><span>)</span><span> </span><span>{</span><span>
  </span><span>// process only matching entities</span><span>
</span><span>}</span>
```

### Memory usage patterns

-   **Packed components**: ~32 bytes per component instance (depends on field count)-   **Query indices**: ~4 bytes per entity per matching query-   **System overhead**: ~1KB per system class

## Integration with Three.js and WebXR

### Object3D synchronization

IWSDK bridges ECS data and Three.js scene graph:

```
<span>ECS </span><span>Side</span><span>:</span><span>              </span><span>Three</span><span>.</span><span>js </span><span>Side</span><span>:</span><span>
</span><span>─────────</span><span>              </span><span>──────────────</span><span>
</span><span>Entity</span><span> </span><span>12</span><span> </span><span>←──</span><span>linked</span><span>──→</span><span> </span><span>Object3D</span><span>
</span><span>├─</span><span> </span><span>Transform</span><span>           </span><span>├─</span><span> position</span><span>:</span><span> </span><span>[</span><span>1</span><span>,</span><span>2</span><span>,</span><span>3</span><span>]</span><span>
</span><span>│</span><span>  </span><span>└─</span><span> position</span><span>:</span><span> </span><span>[</span><span>1</span><span>,</span><span>2</span><span>,</span><span>3</span><span>]</span><span> </span><span>└─</span><span> quaternion</span><span>:</span><span> </span><span>[...]</span><span>
</span><span>└─</span><span> </span><span>Mesh</span><span>                </span><span>└─</span><span> mesh</span><span>:</span><span> </span><span>BoxGeometry</span><span>
   </span><span>└─</span><span> geometry</span><span>:</span><span> </span><span>"box"</span>
```

Transform system automatically syncs ECS component data to Three.js matrices.

### WebXR session lifecycle

```
<span>Session</span><span> </span><span>Start</span><span>:</span><span>
</span><span>├─</span><span> </span><span>World</span><span>.</span><span>visibilityState </span><span>→</span><span> </span><span>'visible'</span><span>
</span><span>├─</span><span> </span><span>Input</span><span> systems activate </span><span>(</span><span>hand</span><span>/</span><span>controller tracking</span><span>)</span><span>
</span><span>├─</span><span> </span><span>Locomotion</span><span> systems start physics updates
</span><span>└─</span><span> </span><span>Render</span><span> loop switches to XR frame timing </span><span>(</span><span>90fps</span><span>)</span><span>

</span><span>Session</span><span> </span><span>End</span><span>:</span><span>
</span><span>├─</span><span> </span><span>World</span><span>.</span><span>visibilityState </span><span>→</span><span> </span><span>'non-immersive'</span><span>
</span><span>├─</span><span> </span><span>Input</span><span> systems pause expensive tracking
</span><span>└─</span><span> </span><span>Render</span><span> loop returns to </span><span>60fps</span>
```

Systems can check `world.visibilityState` to reduce CPU load when VR headset is removed.

## Debugging and profiling

### Query analysis

```
<span>console</span><span>.</span><span>log</span><span>(</span><span>'System performance:'</span><span>);</span><span>
</span><span>for</span><span> </span><span>(</span><span>const</span><span> </span><span>[</span><span>name</span><span>,</span><span> query</span><span>]</span><span> of </span><span>Object</span><span>.</span><span>entries</span><span>(</span><span>this</span><span>.</span><span>queries</span><span>))</span><span> </span><span>{</span><span>
  console</span><span>.</span><span>log</span><span>(</span><span>`  ${name}: ${query.entities.size} entities`</span><span>);</span><span>
</span><span>}</span>
```

### Component memory usage

```
<span>// Check component distribution</span><span>
world</span><span>.</span><span>entityManager</span><span>.</span><span>entities</span><span>.</span><span>forEach</span><span>((</span><span>entity</span><span>)</span><span> </span><span>=&gt;</span><span> </span><span>{</span><span>
  console</span><span>.</span><span>log</span><span>(</span><span>
    </span><span>`Entity ${entity.index}:`</span><span>,</span><span>
    entity</span><span>.</span><span>getComponents</span><span>().</span><span>map</span><span>((</span><span>c</span><span>)</span><span> </span><span>=&gt;</span><span> c</span><span>.</span><span>id</span><span>),</span><span>
  </span><span>);</span><span>
</span><span>});</span>
```

### System timing

Built-in performance monitoring shows per-system frame time:

```
<span>world</span><span>.</span><span>enablePerformanceMonitoring </span><span>=</span><span> </span><span>true</span><span>;</span><span> </span><span>// Shows system timing</span>
```

This architecture enables IWSDK applications to scale from simple demos to complex multiplayer VR experiences while maintaining consistent performance.