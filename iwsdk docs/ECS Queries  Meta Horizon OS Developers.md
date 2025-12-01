Queries define dynamic entity sets. Each query specifies:

-   `required`: components an entity must have-   `excluded`: components an entity must not have (optional)-   `where`: value predicates on component fields (optional)

Membership updates automatically as entities gain/lose components and when relevant component values change.

## Defining queries (required/excluded)

```
<span>export</span><span> </span><span>class</span><span> </span><span>RenderUISystem</span><span> </span><span>extends</span><span> createSystem</span><span>({</span><span>
  panels</span><span>:</span><span> </span><span>{</span><span> required</span><span>:</span><span> </span><span>[</span><span>PanelUI</span><span>],</span><span> excluded</span><span>:</span><span> </span><span>[</span><span>ScreenSpace</span><span>]</span><span> </span><span>},</span><span>
</span><span>})</span><span> </span><span>{</span><span>
  </span><span>/*…*/</span><span>
</span><span>}</span>
```

## Value predicates (`where`)

IWSDK re‑exports elics predicate helpers for readable, type‑safe value filters:

```
<span>import</span><span> </span><span>{</span><span> eq</span><span>,</span><span> ne</span><span>,</span><span> lt</span><span>,</span><span> le</span><span>,</span><span> gt</span><span>,</span><span> ge</span><span>,</span><span> isin</span><span>,</span><span> nin </span><span>}</span><span> </span><span>from</span><span> </span><span>'@iwsdk/core'</span><span>;</span><span>

</span><span>export</span><span> </span><span>class</span><span> </span><span>DangerHUD</span><span> </span><span>extends</span><span> createSystem</span><span>({</span><span>
  lowHealth</span><span>:</span><span> </span><span>{</span><span>
    required</span><span>:</span><span> </span><span>[</span><span>Health</span><span>],</span><span>
    </span><span>where</span><span>:</span><span> </span><span>[</span><span>lt</span><span>(</span><span>Health</span><span>,</span><span> </span><span>'current'</span><span>,</span><span> </span><span>30</span><span>)],</span><span>
  </span><span>},</span><span>
  statusBar</span><span>:</span><span> </span><span>{</span><span>
    required</span><span>:</span><span> </span><span>[</span><span>Status</span><span>],</span><span>
    </span><span>where</span><span>:</span><span> </span><span>[</span><span>isin</span><span>(</span><span>Status</span><span>,</span><span> </span><span>'phase'</span><span>,</span><span> </span><span>[</span><span>'combat'</span><span>,</span><span> </span><span>'boss'</span><span>])],</span><span>
  </span><span>},</span><span>
</span><span>})</span><span> </span><span>{</span><span>
  update</span><span>()</span><span> </span><span>{</span><span>
    </span><span>// Only entities with Health.current &lt; 30</span><span>
    </span><span>for</span><span> </span><span>(</span><span>const</span><span> e of </span><span>this</span><span>.</span><span>queries</span><span>.</span><span>lowHealth</span><span>.</span><span>entities</span><span>)</span><span> </span><span>{</span><span>
      </span><span>/* … */</span><span>
    </span><span>}</span><span>
  </span><span>}</span><span>
</span><span>}</span>
```

### Supported operators

-   Equality/inequality: `eq`, `ne`-   Numeric comparisons: `lt`, `le`, `gt`, `ge`-   Set membership: `isin` (in), `nin` (not in)

### Entity references

```
<span>// Types.Entity fields are nullable entity references; test for null/non-null</span><span>
</span><span>export</span><span> </span><span>const</span><span> </span><span>Target</span><span> </span><span>=</span><span> createComponent</span><span>(</span><span>'Target'</span><span>,</span><span> </span><span>{</span><span>
  entity</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Entity</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>null</span><span> </span><span>},</span><span>
</span><span>});</span><span>

</span><span>export</span><span> </span><span>class</span><span> </span><span>Targeting</span><span> </span><span>extends</span><span> createSystem</span><span>({</span><span>
  locked</span><span>:</span><span> </span><span>{</span><span> required</span><span>:</span><span> </span><span>[</span><span>Target</span><span>],</span><span> </span><span>where</span><span>:</span><span> </span><span>[</span><span>ne</span><span>(</span><span>Target</span><span>,</span><span> </span><span>'entity'</span><span>,</span><span> </span><span>null</span><span>)]</span><span> </span><span>},</span><span>
  free</span><span>:</span><span> </span><span>{</span><span> required</span><span>:</span><span> </span><span>[</span><span>Target</span><span>],</span><span> </span><span>where</span><span>:</span><span> </span><span>[</span><span>eq</span><span>(</span><span>Target</span><span>,</span><span> </span><span>'entity'</span><span>,</span><span> </span><span>null</span><span>)]</span><span> </span><span>},</span><span>
</span><span>})</span><span> </span><span>{</span><span>
  </span><span>/* … */</span><span>
</span><span>}</span>
```

Notes:

-   Predicates can reference fields across different required components.-   Predicates on numeric fields validate against min/max if your schema defines them (see components).-   Vector fields (Vec2/3/4) are exposed as typed arrays; if you need to filter by a vector field, prefer aliasing a numeric key (for example, `radius`) and update that via `setValue`.

## How membership updates when values change

When you call `entity.setValue(Component, 'key', value)`, the ECS:

-   writes the value into the component’s storage-   calls `updateEntityValue(entity, component)` to re‑evaluate queries whose `where` depends on that component

This happens automatically for scalar fields. For vector fields obtained via `getVectorView`, direct mutation does not trigger value re‑evaluation. If a query’s `where` depends on a vector field, update it through `setValue` (with a whole tuple) or keep a scalar mirror for filtering.

Live update diagram:

```
<span>entity</span><span>.</span><span>setValue</span><span>(</span><span>C</span><span>,</span><span>'hp'</span><span>,</span><span>20</span><span>)</span><span> </span><span>→</span><span> </span><span>QueryManager</span><span>.</span><span>updateEntityValue</span><span>(</span><span>entity</span><span>,</span><span>C</span><span>)</span><span>
  </span><span>→</span><span> re</span><span>-</span><span>evaluate queries </span><span>with</span><span> </span><span>where</span><span> on C </span><span>→</span><span> emit qualify</span><span>/</span><span>disqualify </span><span>→</span><span> update query</span><span>.</span><span>entities</span>
```

## Reacting to membership changes

```
<span>this</span><span>.</span><span>queries</span><span>.</span><span>panels</span><span>.</span><span>subscribe</span><span>(</span><span>'qualify'</span><span>,</span><span> </span><span>(</span><span>e</span><span>)</span><span> </span><span>=&gt;</span><span> </span><span>{</span><span>
  </span><span>// attach resources exactly once when an entity starts matching</span><span>
</span><span>});</span><span>
</span><span>this</span><span>.</span><span>queries</span><span>.</span><span>panels</span><span>.</span><span>subscribe</span><span>(</span><span>'disqualify'</span><span>,</span><span> </span><span>(</span><span>e</span><span>)</span><span> </span><span>=&gt;</span><span> </span><span>{</span><span>
  </span><span>// cleanup when it stops matching</span><span>
</span><span>});</span>
```

## Iterating entities efficiently

```
<span>for</span><span> </span><span>(</span><span>const</span><span> e of </span><span>this</span><span>.</span><span>queries</span><span>.</span><span>panels</span><span>.</span><span>entities</span><span>)</span><span> </span><span>{</span><span>
  </span><span>// per-frame work</span><span>
</span><span>}</span>
```

Avoid nested O(N²) loops across two large queries. Build an index (for example, Map from id → entity) or tag associations during `qualify` and reuse.

## Advanced query examples

### Dynamic difficulty adjustment

```
<span>export</span><span> </span><span>class</span><span> </span><span>DifficultySystem</span><span> </span><span>extends</span><span> createSystem</span><span>({</span><span>
  </span><span>// Only enemies that need difficulty scaling</span><span>
  weakEnemies</span><span>:</span><span> </span><span>{</span><span>
    required</span><span>:</span><span> </span><span>[</span><span>Health</span><span>,</span><span> </span><span>Enemy</span><span>],</span><span>
    </span><span>where</span><span>:</span><span> </span><span>[</span><span>lt</span><span>(</span><span>Health</span><span>,</span><span> </span><span>'current'</span><span>,</span><span> </span><span>20</span><span>)],</span><span>
  </span><span>},</span><span>
  strongEnemies</span><span>:</span><span> </span><span>{</span><span>
    required</span><span>:</span><span> </span><span>[</span><span>Health</span><span>,</span><span> </span><span>Enemy</span><span>],</span><span>
    </span><span>where</span><span>:</span><span> </span><span>[</span><span>gt</span><span>(</span><span>Health</span><span>,</span><span> </span><span>'current'</span><span>,</span><span> </span><span>80</span><span>)],</span><span>
  </span><span>},</span><span>
  playerNearby</span><span>:</span><span> </span><span>{</span><span>
    required</span><span>:</span><span> </span><span>[</span><span>Player</span><span>,</span><span> </span><span>Transform</span><span>],</span><span>
    </span><span>where</span><span>:</span><span> </span><span>[</span><span>lt</span><span>(</span><span>Transform</span><span>,</span><span> </span><span>'distanceToPlayer'</span><span>,</span><span> </span><span>10</span><span>)],</span><span>
  </span><span>},</span><span>
</span><span>})</span><span> </span><span>{</span><span>
  update</span><span>()</span><span> </span><span>{</span><span>
    </span><span>const</span><span> playerCount </span><span>=</span><span> </span><span>this</span><span>.</span><span>queries</span><span>.</span><span>playerNearby</span><span>.</span><span>entities</span><span>.</span><span>size</span><span>;</span><span>

    </span><span>// Buff weak enemies when players are close</span><span>
    </span><span>if</span><span> </span><span>(</span><span>playerCount </span><span>&gt;</span><span> </span><span>0</span><span>)</span><span> </span><span>{</span><span>
      </span><span>for</span><span> </span><span>(</span><span>const</span><span> enemy of </span><span>this</span><span>.</span><span>queries</span><span>.</span><span>weakEnemies</span><span>.</span><span>entities</span><span>)</span><span> </span><span>{</span><span>
        </span><span>const</span><span> current </span><span>=</span><span> enemy</span><span>.</span><span>getValue</span><span>(</span><span>Health</span><span>,</span><span> </span><span>'current'</span><span>)!;</span><span>
        enemy</span><span>.</span><span>setValue</span><span>(</span><span>Health</span><span>,</span><span> </span><span>'current'</span><span>,</span><span> </span><span>Math</span><span>.</span><span>min</span><span>(</span><span>100</span><span>,</span><span> current </span><span>+</span><span> </span><span>5</span><span>));</span><span>
      </span><span>}</span><span>
    </span><span>}</span><span>
  </span><span>}</span><span>
</span><span>}</span>
```

### Smart resource management

```
<span>export</span><span> </span><span>class</span><span> </span><span>ResourceSystem</span><span> </span><span>extends</span><span> createSystem</span><span>({</span><span>
  </span><span>// Entities that need expensive updates</span><span>
  highDetail</span><span>:</span><span> </span><span>{</span><span>
    required</span><span>:</span><span> </span><span>[</span><span>Mesh</span><span>,</span><span> </span><span>Transform</span><span>],</span><span>
    </span><span>where</span><span>:</span><span> </span><span>[</span><span>lt</span><span>(</span><span>Transform</span><span>,</span><span> </span><span>'distanceToCamera'</span><span>,</span><span> </span><span>50</span><span>)],</span><span>
  </span><span>},</span><span>
  </span><span>// Entities that can use cheap updates</span><span>
  lowDetail</span><span>:</span><span> </span><span>{</span><span>
    required</span><span>:</span><span> </span><span>[</span><span>Mesh</span><span>,</span><span> </span><span>Transform</span><span>],</span><span>
    </span><span>where</span><span>:</span><span> </span><span>[</span><span>gt</span><span>(</span><span>Transform</span><span>,</span><span> </span><span>'distanceToCamera'</span><span>,</span><span> </span><span>50</span><span>)],</span><span>
  </span><span>},</span><span>
  </span><span>// Completely invisible (can skip entirely)</span><span>
  invisible</span><span>:</span><span> </span><span>{</span><span>
    required</span><span>:</span><span> </span><span>[</span><span>Mesh</span><span>,</span><span> </span><span>Visibility</span><span>],</span><span>
    </span><span>where</span><span>:</span><span> </span><span>[</span><span>eq</span><span>(</span><span>Visibility</span><span>,</span><span> </span><span>'isVisible'</span><span>,</span><span> </span><span>false</span><span>)],</span><span>
  </span><span>},</span><span>
</span><span>})</span><span> </span><span>{</span><span>
  update</span><span>()</span><span> </span><span>{</span><span>
    </span><span>// Expensive processing only for nearby objects</span><span>
    </span><span>for</span><span> </span><span>(</span><span>const</span><span> entity of </span><span>this</span><span>.</span><span>queries</span><span>.</span><span>highDetail</span><span>.</span><span>entities</span><span>)</span><span> </span><span>{</span><span>
      </span><span>this</span><span>.</span><span>expensiveUpdate</span><span>(</span><span>entity</span><span>);</span><span>
    </span><span>}</span><span>

    </span><span>// Cheap processing for distant objects</span><span>
    </span><span>for</span><span> </span><span>(</span><span>const</span><span> entity of </span><span>this</span><span>.</span><span>queries</span><span>.</span><span>lowDetail</span><span>.</span><span>entities</span><span>)</span><span> </span><span>{</span><span>
      </span><span>this</span><span>.</span><span>cheapUpdate</span><span>(</span><span>entity</span><span>);</span><span>
    </span><span>}</span><span>

    </span><span>// Skip invisible entities entirely</span><span>
    console</span><span>.</span><span>log</span><span>(</span><span>
      </span><span>`Skipping ${this.queries.invisible.entities.size} invisible entities`</span><span>,</span><span>
    </span><span>);</span><span>
  </span><span>}</span><span>
</span><span>}</span>
```