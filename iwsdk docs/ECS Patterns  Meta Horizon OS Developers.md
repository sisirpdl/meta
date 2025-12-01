## One entity, many features

Prefer small components that compose:

```
<span>player</span><span>.</span><span>addComponent</span><span>(</span><span>Health</span><span>);</span><span>
player</span><span>.</span><span>addComponent</span><span>(</span><span>Wallet</span><span>);</span><span>
player</span><span>.</span><span>addComponent</span><span>(</span><span>Locomotion</span><span>,</span><span> </span><span>{</span><span> mode</span><span>:</span><span> </span><span>MovementMode</span><span>.</span><span>Walk</span><span> </span><span>});</span>
```

## Events through qualify/disqualify

Use query events to perform expensive setup once:

```
<span>this</span><span>.</span><span>queries</span><span>.</span><span>panels</span><span>.</span><span>subscribe</span><span>(</span><span>'qualify'</span><span>,</span><span> </span><span>(</span><span>e</span><span>)</span><span> </span><span>=&gt;</span><span> </span><span>{</span><span>
  </span><span>/* load UI config, attach */</span><span>
</span><span>});</span><span>
</span><span>this</span><span>.</span><span>queries</span><span>.</span><span>panels</span><span>.</span><span>subscribe</span><span>(</span><span>'disqualify'</span><span>,</span><span> </span><span>(</span><span>e</span><span>)</span><span> </span><span>=&gt;</span><span> </span><span>{</span><span>
  </span><span>/* cleanup */</span><span>
</span><span>});</span>
```

## Avoid O(N²)

When relating two sets, build an index or tag results to avoid nested loops each frame.

## Keep schema public, hide internals

If a component needs internal fields for systems, prefix with `_` so docs and tools can hide them.

## Debugging

-   Log query sizes in `update()` to spot performance issues.-   Temporarily expose config signals to tweak behavior from devtools.

## ECS vs OOP (Why composition wins)

-   Composition scales: add/remove components at runtime to change behavior.-   No inheritance diamonds: independent systems operate on shared data safely.-   Testability: systems are plain functions over data; easy to unit test with fake entities/components.

## Performance mental models

-   Columnar storage keeps per‑field arrays tightly packed → better cache behavior.-   Queries precompute masks and track membership; iterate query.entities directly.-   Prefer numbers/enums over nested objects in components.-   Use `getVectorView` to avoid allocations in hot paths.

## WebXR integration notes

-   XR session visibility affects when your systems should do heavy work; check `world.visibilityState`.-   Input/locomotion should run at high priority (more negative) to avoid visual lag.

## Advanced composition patterns

### State machine components

Use enum components to drive complex behaviors:

```
<span>const</span><span> </span><span>PlayerState</span><span> </span><span>=</span><span> </span><span>{</span><span>
  </span><span>Idle</span><span>:</span><span> </span><span>'idle'</span><span>,</span><span>
  </span><span>Walking</span><span>:</span><span> </span><span>'walking'</span><span>,</span><span>
  </span><span>Grabbing</span><span>:</span><span> </span><span>'grabbing'</span><span>,</span><span>
</span><span>}</span><span> </span><span>as</span><span> </span><span>const</span><span>;</span><span>
</span><span>const</span><span> </span><span>PlayerController</span><span> </span><span>=</span><span> createComponent</span><span>(</span><span>'PlayerController'</span><span>,</span><span> </span><span>{</span><span>
  state</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Enum</span><span>,</span><span> </span><span>enum</span><span>:</span><span> </span><span>PlayerState</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>PlayerState</span><span>.</span><span>Idle</span><span> </span><span>},</span><span>
  previousState</span><span>:</span><span> </span><span>{</span><span>
    type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Enum</span><span>,</span><span>
    </span><span>enum</span><span>:</span><span> </span><span>PlayerState</span><span>,</span><span>
    </span><span>default</span><span>:</span><span> </span><span>PlayerState</span><span>.</span><span>Idle</span><span>,</span><span>
  </span><span>},</span><span>
</span><span>});</span><span>

</span><span>// Different systems handle different states</span><span>
</span><span>export</span><span> </span><span>class</span><span> </span><span>WalkingSystem</span><span> </span><span>extends</span><span> createSystem</span><span>({</span><span>
  walkers</span><span>:</span><span> </span><span>{</span><span>
    required</span><span>:</span><span> </span><span>[</span><span>PlayerController</span><span>],</span><span>
    </span><span>where</span><span>:</span><span> </span><span>[</span><span>eq</span><span>(</span><span>PlayerController</span><span>,</span><span> </span><span>'state'</span><span>,</span><span> </span><span>'walking'</span><span>)],</span><span>
  </span><span>},</span><span>
</span><span>})</span><span> </span><span>{</span><span>
  </span><span>/* handle walking logic */</span><span>
</span><span>}</span><span>

</span><span>export</span><span> </span><span>class</span><span> </span><span>GrabbingSystem</span><span> </span><span>extends</span><span> createSystem</span><span>({</span><span>
  grabbers</span><span>:</span><span> </span><span>{</span><span>
    required</span><span>:</span><span> </span><span>[</span><span>PlayerController</span><span>],</span><span>
    </span><span>where</span><span>:</span><span> </span><span>[</span><span>eq</span><span>(</span><span>PlayerController</span><span>,</span><span> </span><span>'state'</span><span>,</span><span> </span><span>'grabbing'</span><span>)],</span><span>
  </span><span>},</span><span>
</span><span>})</span><span> </span><span>{</span><span>
  </span><span>/* handle grab logic */</span><span>
</span><span>}</span>
```

### Component flags for optimization

Use boolean flags to control expensive operations:

```
<span>const</span><span> </span><span>OptimizationFlags</span><span> </span><span>=</span><span> createComponent</span><span>(</span><span>'OptimizationFlags'</span><span>,</span><span> </span><span>{</span><span>
  isDirty</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Boolean</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>false</span><span> </span><span>},</span><span>
  isVisible</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Boolean</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>true</span><span> </span><span>},</span><span>
  needsLODUpdate</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Boolean</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>false</span><span> </span><span>},</span><span>
</span><span>});</span><span>

</span><span>// Only process dirty, visible objects</span><span>
</span><span>export</span><span> </span><span>class</span><span> </span><span>ExpensiveSystem</span><span> </span><span>extends</span><span> createSystem</span><span>({</span><span>
  targets</span><span>:</span><span> </span><span>{</span><span>
    required</span><span>:</span><span> </span><span>[</span><span>SomeComponent</span><span>,</span><span> </span><span>OptimizationFlags</span><span>],</span><span>
    </span><span>where</span><span>:</span><span> </span><span>[</span><span>
      eq</span><span>(</span><span>OptimizationFlags</span><span>,</span><span> </span><span>'isDirty'</span><span>,</span><span> </span><span>true</span><span>),</span><span>
      eq</span><span>(</span><span>OptimizationFlags</span><span>,</span><span> </span><span>'isVisible'</span><span>,</span><span> </span><span>true</span><span>),</span><span>
    </span><span>],</span><span>
  </span><span>},</span><span>
</span><span>})</span><span> </span><span>{</span><span>
  update</span><span>()</span><span> </span><span>{</span><span>
    </span><span>for</span><span> </span><span>(</span><span>const</span><span> entity of </span><span>this</span><span>.</span><span>queries</span><span>.</span><span>targets</span><span>.</span><span>entities</span><span>)</span><span> </span><span>{</span><span>
      </span><span>// Do expensive work</span><span>
      </span><span>this</span><span>.</span><span>doExpensiveWork</span><span>(</span><span>entity</span><span>);</span><span>
      </span><span>// Mark clean</span><span>
      entity</span><span>.</span><span>setValue</span><span>(</span><span>OptimizationFlags</span><span>,</span><span> </span><span>'isDirty'</span><span>,</span><span> </span><span>false</span><span>);</span><span>
    </span><span>}</span><span>
  </span><span>}</span><span>
</span><span>}</span>
```

### Hierarchical system communication

Use parent-child relationships for coordinated behavior:

```
<span>// Parent entity coordinates children</span><span>
</span><span>export</span><span> </span><span>class</span><span> </span><span>SquadLeaderSystem</span><span> </span><span>extends</span><span> createSystem</span><span>({</span><span>
  squads</span><span>:</span><span> </span><span>{</span><span> required</span><span>:</span><span> </span><span>[</span><span>SquadLeader</span><span>,</span><span> </span><span>Transform</span><span>]</span><span> </span><span>},</span><span>
</span><span>})</span><span> </span><span>{</span><span>
  update</span><span>()</span><span> </span><span>{</span><span>
    </span><span>for</span><span> </span><span>(</span><span>const</span><span> leader of </span><span>this</span><span>.</span><span>queries</span><span>.</span><span>squads</span><span>.</span><span>entities</span><span>)</span><span> </span><span>{</span><span>
      </span><span>// Find all squad members (children with SquadMember component)</span><span>
      </span><span>const</span><span> members </span><span>=</span><span> </span><span>this</span><span>.</span><span>findChildrenWithComponent</span><span>(</span><span>leader</span><span>,</span><span> </span><span>SquadMember</span><span>);</span><span>
      </span><span>this</span><span>.</span><span>coordinateSquad</span><span>(</span><span>leader</span><span>,</span><span> members</span><span>);</span><span>
    </span><span>}</span><span>
  </span><span>}</span><span>

  </span><span>private</span><span> findChildrenWithComponent</span><span>(</span><span>parent</span><span>:</span><span> </span><span>Entity</span><span>,</span><span> component</span><span>:</span><span> </span><span>Component</span><span>)</span><span> </span><span>{</span><span>
    </span><span>// Walk transform hierarchy looking for component</span><span>
    </span><span>return</span><span> </span><span>(</span><span>
      parent</span><span>.</span><span>object3D</span><span>?.</span><span>children
        </span><span>.</span><span>map</span><span>((</span><span>child</span><span>)</span><span> </span><span>=&gt;</span><span> </span><span>this</span><span>.</span><span>world</span><span>.</span><span>getEntityByObject3D</span><span>(</span><span>child</span><span>))</span><span>
        </span><span>.</span><span>filter</span><span>((</span><span>entity</span><span>)</span><span> </span><span>=&gt;</span><span> entity</span><span>?.</span><span>hasComponent</span><span>(</span><span>component</span><span>))</span><span> </span><span>||</span><span> </span><span>[]</span><span>
    </span><span>);</span><span>
  </span><span>}</span><span>
</span><span>}</span>
```

### Performance-critical patterns

#### Batch processing

Process entities in chunks to maintain frame rate:

```
<span>export</span><span> </span><span>class</span><span> </span><span>BatchedSystem</span><span> </span><span>extends</span><span> createSystem</span><span>(</span><span>
  </span><span>{</span><span>
    targets</span><span>:</span><span> </span><span>{</span><span> required</span><span>:</span><span> </span><span>[</span><span>ExpensiveComponent</span><span>]</span><span> </span><span>},</span><span>
  </span><span>},</span><span>
  </span><span>{</span><span>
    batchSize</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Int32</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>50</span><span> </span><span>},</span><span>
  </span><span>},</span><span>
</span><span>)</span><span> </span><span>{</span><span>
  </span><span>private</span><span> currentIndex </span><span>=</span><span> </span><span>0</span><span>;</span><span>

  update</span><span>()</span><span> </span><span>{</span><span>
    </span><span>const</span><span> entities </span><span>=</span><span> </span><span>Array</span><span>.</span><span>from</span><span>(</span><span>this</span><span>.</span><span>queries</span><span>.</span><span>targets</span><span>.</span><span>entities</span><span>);</span><span>
    </span><span>const</span><span> batchSize </span><span>=</span><span> </span><span>this</span><span>.</span><span>config</span><span>.</span><span>batchSize</span><span>.</span><span>peek</span><span>();</span><span>

    </span><span>// Process only a subset each frame</span><span>
    </span><span>for</span><span> </span><span>(</span><span>let</span><span> i </span><span>=</span><span> </span><span>0</span><span>;</span><span> i </span><span>&lt;</span><span> batchSize </span><span>&amp;&amp;</span><span> </span><span>this</span><span>.</span><span>currentIndex </span><span>&lt;</span><span> entities</span><span>.</span><span>length</span><span>;</span><span> i</span><span>++)</span><span> </span><span>{</span><span>
      </span><span>this</span><span>.</span><span>processEntity</span><span>(</span><span>entities</span><span>[</span><span>this</span><span>.</span><span>currentIndex</span><span>]);</span><span>
      </span><span>this</span><span>.</span><span>currentIndex</span><span>++;</span><span>
    </span><span>}</span><span>

    </span><span>// Wrap around when done</span><span>
    </span><span>if</span><span> </span><span>(</span><span>this</span><span>.</span><span>currentIndex </span><span>&gt;=</span><span> entities</span><span>.</span><span>length</span><span>)</span><span> </span><span>{</span><span>
      </span><span>this</span><span>.</span><span>currentIndex </span><span>=</span><span> </span><span>0</span><span>;</span><span>
    </span><span>}</span><span>
  </span><span>}</span><span>
</span><span>}</span>
```

#### Pooled entity pattern

Reuse entities instead of creating/destroying frequently:

```
<span>export</span><span> </span><span>class</span><span> </span><span>ProjectileSystem</span><span> </span><span>extends</span><span> createSystem</span><span>(</span><span>
  </span><span>{</span><span>
    active</span><span>:</span><span> </span><span>{</span><span> required</span><span>:</span><span> </span><span>[</span><span>Projectile</span><span>,</span><span> </span><span>Transform</span><span>]</span><span> </span><span>},</span><span>
    inactive</span><span>:</span><span> </span><span>{</span><span> required</span><span>:</span><span> </span><span>[</span><span>Projectile</span><span>],</span><span> excluded</span><span>:</span><span> </span><span>[</span><span>Transform</span><span>]</span><span> </span><span>},</span><span>
  </span><span>},</span><span>
  </span><span>{</span><span>
    poolSize</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Int32</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>100</span><span> </span><span>},</span><span>
  </span><span>},</span><span>
</span><span>)</span><span> </span><span>{</span><span>
  init</span><span>()</span><span> </span><span>{</span><span>
    </span><span>// Pre-create pooled entities</span><span>
    </span><span>for</span><span> </span><span>(</span><span>let</span><span> i </span><span>=</span><span> </span><span>0</span><span>;</span><span> i </span><span>&lt;</span><span> </span><span>this</span><span>.</span><span>config</span><span>.</span><span>poolSize</span><span>.</span><span>peek</span><span>();</span><span> i</span><span>++)</span><span> </span><span>{</span><span>
      </span><span>const</span><span> entity </span><span>=</span><span> </span><span>this</span><span>.</span><span>createEntity</span><span>();</span><span>
      entity</span><span>.</span><span>addComponent</span><span>(</span><span>Projectile</span><span>);</span><span>
      </span><span>// Start inactive (no Transform = not in scene)</span><span>
    </span><span>}</span><span>
  </span><span>}</span><span>

  spawnProjectile</span><span>(</span><span>position</span><span>:</span><span> </span><span>[</span><span>number</span><span>,</span><span> number</span><span>,</span><span> number</span><span>])</span><span> </span><span>{</span><span>
    </span><span>// Reuse inactive entity</span><span>
    </span><span>const</span><span> entity </span><span>=</span><span> </span><span>this</span><span>.</span><span>queries</span><span>.</span><span>inactive</span><span>.</span><span>entities</span><span>[</span><span>0</span><span>];</span><span>
    </span><span>if</span><span> </span><span>(</span><span>entity</span><span>)</span><span> </span><span>{</span><span>
      entity</span><span>.</span><span>addComponent</span><span>(</span><span>Transform</span><span>,</span><span> </span><span>{</span><span> position </span><span>});</span><span>
      </span><span>// Now active (has Transform)</span><span>
    </span><span>}</span><span>
  </span><span>}</span><span>

  update</span><span>()</span><span> </span><span>{</span><span>
    </span><span>for</span><span> </span><span>(</span><span>const</span><span> entity of </span><span>this</span><span>.</span><span>queries</span><span>.</span><span>active</span><span>.</span><span>entities</span><span>)</span><span> </span><span>{</span><span>
      </span><span>// Move projectile</span><span>
      </span><span>if</span><span> </span><span>(</span><span>this</span><span>.</span><span>shouldDespawn</span><span>(</span><span>entity</span><span>))</span><span> </span><span>{</span><span>
        entity</span><span>.</span><span>removeComponent</span><span>(</span><span>Transform</span><span>);</span><span> </span><span>// Back to pool</span><span>
      </span><span>}</span><span>
    </span><span>}</span><span>
  </span><span>}</span><span>
</span><span>}</span>
```

## Common anti-patterns to avoid

### Storing references in components

```
<span>// Bad: storing objects breaks ECS data orientation</span><span>
</span><span>const</span><span> </span><span>BadComponent</span><span> </span><span>=</span><span> createComponent</span><span>(</span><span>'Bad'</span><span>,</span><span> </span><span>{</span><span>
  mesh</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Object</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>null</span><span> </span><span>},</span><span> </span><span>// Three.js mesh object</span><span>
  callbacks</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Object</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>[]</span><span> </span><span>},</span><span> </span><span>// Function array</span><span>
</span><span>});</span>
```

```
<span>// Good: use indices/IDs and lookup in systems</span><span>
</span><span>const</span><span> </span><span>GoodComponent</span><span> </span><span>=</span><span> createComponent</span><span>(</span><span>'Good'</span><span>,</span><span> </span><span>{</span><span>
  meshId</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>String</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>''</span><span> </span><span>},</span><span>
  callbackTypes</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>String</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>''</span><span> </span><span>},</span><span> </span><span>// comma-separated</span><span>
</span><span>});</span>
```

### Fat components

```
<span>// Bad: kitchen sink component</span><span>
</span><span>const</span><span> </span><span>PlayerComponent</span><span> </span><span>=</span><span> createComponent</span><span>(</span><span>'Player'</span><span>,</span><span> </span><span>{</span><span>
  health</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Float32</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>100</span><span> </span><span>},</span><span>
  ammo</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Int32</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>30</span><span> </span><span>},</span><span>
  experience</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Int32</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>0</span><span> </span><span>},</span><span>
  inventory</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Object</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>{}</span><span> </span><span>},</span><span>
  achievements</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Object</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>{}</span><span> </span><span>},</span><span>
</span><span>});</span>
```

```
<span>// Good: focused, composable components</span><span>
</span><span>const</span><span> </span><span>Health</span><span> </span><span>=</span><span> createComponent</span><span>(</span><span>'Health'</span><span>,</span><span> </span><span>{</span><span> current</span><span>:</span><span> </span><span>...,</span><span> max</span><span>:</span><span> </span><span>...</span><span> </span><span>});</span><span>
</span><span>const</span><span> </span><span>Inventory</span><span> </span><span>=</span><span> createComponent</span><span>(</span><span>'Inventory'</span><span>,</span><span> </span><span>{</span><span> itemIds</span><span>:</span><span> </span><span>...,</span><span> capacity</span><span>:</span><span> </span><span>...</span><span> </span><span>});</span><span>
</span><span>const</span><span> </span><span>Experience</span><span> </span><span>=</span><span> createComponent</span><span>(</span><span>'Experience'</span><span>,</span><span> </span><span>{</span><span> points</span><span>:</span><span> </span><span>...,</span><span> level</span><span>:</span><span> </span><span>...</span><span> </span><span>});</span>
```

### Systems doing too much

```
<span>// Bad: god system</span><span>
</span><span>export</span><span> </span><span>class</span><span> </span><span>PlayerSystem</span><span> </span><span>extends</span><span> createSystem</span><span>({</span><span>
  players</span><span>:</span><span> </span><span>{</span><span> required</span><span>:</span><span> </span><span>[</span><span>Player</span><span>]</span><span> </span><span>},</span><span>
</span><span>})</span><span> </span><span>{</span><span>
  update</span><span>()</span><span> </span><span>{</span><span>
    </span><span>for</span><span> </span><span>(</span><span>const</span><span> player of </span><span>this</span><span>.</span><span>queries</span><span>.</span><span>players</span><span>.</span><span>entities</span><span>)</span><span> </span><span>{</span><span>
      </span><span>this</span><span>.</span><span>updateHealth</span><span>(</span><span>player</span><span>);</span><span>
      </span><span>this</span><span>.</span><span>updateMovement</span><span>(</span><span>player</span><span>);</span><span>
      </span><span>this</span><span>.</span><span>updateInventory</span><span>(</span><span>player</span><span>);</span><span>
      </span><span>this</span><span>.</span><span>updateAchievements</span><span>(</span><span>player</span><span>);</span><span>
      </span><span>this</span><span>.</span><span>updateUI</span><span>(</span><span>player</span><span>);</span><span>
      </span><span>this</span><span>.</span><span>playAudio</span><span>(</span><span>player</span><span>);</span><span>
    </span><span>}</span><span>
  </span><span>}</span><span>
</span><span>}</span>
```

```
<span>// Good: focused systems</span><span>
</span><span>export</span><span> </span><span>class</span><span> </span><span>HealthSystem</span><span> </span><span>extends</span><span> createSystem</span><span>(...)</span><span>
</span><span>export</span><span> </span><span>class</span><span> </span><span>MovementSystem</span><span> </span><span>extends</span><span> createSystem</span><span>(...)</span><span>
</span><span>export</span><span> </span><span>class</span><span> </span><span>InventorySystem</span><span> </span><span>extends</span><span> createSystem</span><span>(...)</span><span>
</span><span>// Each system handles one concern</span>
```