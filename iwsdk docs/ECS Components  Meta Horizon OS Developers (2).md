Components are named, typed data schemas. They do not contain behavior. You attach them to entities to express state.

## Data vs behavior separation (mental model)

Think of components as database tables (columns are fields, rows are entities):

```
<span>Health</span><span> table</span><span>:</span><span>
  entity_id </span><span>|</span><span> current </span><span>|</span><span> max
  </span><span>----------+---------+-----</span><span>
        </span><span>12</span><span>  </span><span>|</span><span>   </span><span>100</span><span>   </span><span>|</span><span> </span><span>100</span><span>
        </span><span>37</span><span>  </span><span>|</span><span>    </span><span>25</span><span>   </span><span>|</span><span> </span><span>100</span><span>

</span><span>Position</span><span> table</span><span>:</span><span>
  entity_id </span><span>|</span><span>   x   </span><span>|</span><span>   y   </span><span>|</span><span>   z
  </span><span>----------+-------+-------+------</span><span>
        </span><span>12</span><span>  </span><span>|</span><span>  </span><span>0.0</span><span>  </span><span>|</span><span>  </span><span>1.7</span><span>  </span><span>|</span><span>  </span><span>0.0</span>
```

Systems are pure logic that run queries over these tables and update values. No behavior lives in the component definitions.

## Defining a component

```
<span>import</span><span> </span><span>{</span><span> </span><span>Types</span><span>,</span><span> createComponent </span><span>}</span><span> </span><span>from</span><span> </span><span>'@iwsdk/core'</span><span>;</span><span>

</span><span>export</span><span> </span><span>const</span><span> </span><span>Health</span><span> </span><span>=</span><span> createComponent</span><span>(</span><span>'Health'</span><span>,</span><span> </span><span>{</span><span>
  current</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Float32</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>100</span><span> </span><span>},</span><span>
  max</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Float32</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>100</span><span> </span><span>},</span><span>
</span><span>});</span>
```

Supported types include `Types.Boolean`, numeric types (`Float32`, `Int32`, …), `Types.String`, `Types.Enum`, `Types.Object`, and vector types like `Types.Vec3`.

Numeric fields may specify `min`/`max`. Enum fields require an `enum` map. `Types.Entity` stores an entity reference (index under the hood, `null` by default).

Note: IWSDK re‑exports `Types` and helpers from elics. The semantics are identical. You can import from `@iwsdk/core` for convenience.

## Enums

```
<span>export</span><span> </span><span>const</span><span> </span><span>MovementMode</span><span> </span><span>=</span><span> </span><span>{</span><span> </span><span>Walk</span><span>:</span><span> </span><span>'walk'</span><span>,</span><span> </span><span>Fly</span><span>:</span><span> </span><span>'fly'</span><span> </span><span>}</span><span> </span><span>as</span><span> </span><span>const</span><span>;</span><span>
</span><span>export</span><span> </span><span>const</span><span> </span><span>Locomotion</span><span> </span><span>=</span><span> createComponent</span><span>(</span><span>'Locomotion'</span><span>,</span><span> </span><span>{</span><span>
  mode</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Enum</span><span>,</span><span> </span><span>enum</span><span>:</span><span> </span><span>MovementMode</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>MovementMode</span><span>.</span><span>Walk</span><span> </span><span>},</span><span>
</span><span>});</span>
```

## Attaching to entities

```
<span>entity</span><span>.</span><span>addComponent</span><span>(</span><span>Health</span><span>,</span><span> </span><span>{</span><span> current</span><span>:</span><span> </span><span>50</span><span> </span><span>});</span>
```

## Reading/writing

```
<span>const</span><span> cur </span><span>=</span><span> entity</span><span>.</span><span>getValue</span><span>(</span><span>Health</span><span>,</span><span> </span><span>'current'</span><span>);</span><span>
entity</span><span>.</span><span>setValue</span><span>(</span><span>Health</span><span>,</span><span> </span><span>'current'</span><span>,</span><span> cur</span><span>!</span><span> </span><span>+</span><span> </span><span>10</span><span>);</span>
```

### Vectors and performance

For vector fields (`Vec2/3/4`), you can mutate in place using a typed view without allocations:

```
<span>const</span><span> pos </span><span>=</span><span> entity</span><span>.</span><span>getVectorView</span><span>(</span><span>Transform</span><span>,</span><span> </span><span>'position'</span><span>);</span><span> </span><span>// Float32Array [x,y,z]</span><span>
pos</span><span>[</span><span>0</span><span>]</span><span> </span><span>+=</span><span> </span><span>1</span><span>;</span>
```

If a query uses value predicates on a vector field, update through `setValue` (with a full tuple) so queries re‑evaluate, or mirror a scalar field for filtering.

### Internal fields

If a component needs internal implementation details, prefix field names with `_`. Documentation and tools can hide these (IWSDK’s docs do).