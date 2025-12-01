Systems implement behavior. They declare queries (entity sets) and optional config schema (reactive signals).

## Mental model: behavior that reacts to data

Systems are functions over sets of entities. Think of them as database stored procedures that run every frame:

```
<span>Traditional</span><span> </span><span>Game</span><span> </span><span>Loop</span><span>:</span><span>           ECS </span><span>System</span><span> </span><span>Approach</span><span>:</span><span>
</span><span>──────────────────────</span><span>           </span><span>───────────────────</span><span>
</span><span>for</span><span> each </span><span>object</span><span>:</span><span>                 </span><span>for</span><span> each relevant entity </span><span>set</span><span>:</span><span>
  </span><span>object</span><span>.</span><span>update</span><span>(</span><span>dt</span><span>)</span><span>                system</span><span>.</span><span>update</span><span>(</span><span>dt</span><span>,</span><span> entities</span><span>)</span><span>

</span><span>Problems</span><span>:</span><span>                        </span><span>Benefits</span><span>:</span><span>
</span><span>-</span><span> </span><span>Tight</span><span> coupling                 </span><span>-</span><span> </span><span>Data</span><span>/</span><span>behavior separation
</span><span>-</span><span> </span><span>Hard</span><span> to optimize               </span><span>-</span><span> </span><span>Cache</span><span>-</span><span>friendly iteration
</span><span>-</span><span> </span><span>Difficult</span><span> to disable           </span><span>-</span><span> </span><span>Easy</span><span> to enable</span><span>/</span><span>disable
</span><span>-</span><span> </span><span>Hard</span><span> to test                   </span><span>-</span><span> </span><span>Systems</span><span> are pure functions</span>
```

Queries pick the rows (entities) to process, and systems implement the logic of what to do with that data each frame.

## Anatomy

```
<span>import</span><span> </span><span>{</span><span> </span><span>Types</span><span>,</span><span> createSystem </span><span>}</span><span> </span><span>from</span><span> </span><span>'@iwsdk/core'</span><span>;</span><span>

</span><span>export</span><span> </span><span>class</span><span> </span><span>MySystem</span><span> </span><span>extends</span><span> createSystem</span><span>(</span><span>
  </span><span>{</span><span>
    groupA</span><span>:</span><span> </span><span>{</span><span> required</span><span>:</span><span> </span><span>[</span><span>CompA</span><span>],</span><span> excluded</span><span>:</span><span> </span><span>[</span><span>CompB</span><span>]</span><span> </span><span>},</span><span>
    groupB</span><span>:</span><span> </span><span>{</span><span> required</span><span>:</span><span> </span><span>[</span><span>CompC</span><span>]</span><span> </span><span>},</span><span>
  </span><span>},</span><span>
  </span><span>{</span><span>
    speed</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Float32</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>1</span><span> </span><span>},</span><span>
  </span><span>},</span><span>
</span><span>)</span><span> </span><span>{</span><span>
  init</span><span>()</span><span> </span><span>{</span><span>
    </span><span>this</span><span>.</span><span>queries</span><span>.</span><span>groupA</span><span>.</span><span>subscribe</span><span>(</span><span>'qualify'</span><span>,</span><span> </span><span>(</span><span>e</span><span>)</span><span> </span><span>=&gt;</span><span> </span><span>{</span><span>
      </span><span>/*…*/</span><span>
    </span><span>});</span><span>
  </span><span>}</span><span>
  update</span><span>(</span><span>dt</span><span>:</span><span> number</span><span>)</span><span> </span><span>{</span><span>
    </span><span>for</span><span> </span><span>(</span><span>const</span><span> e of </span><span>this</span><span>.</span><span>queries</span><span>.</span><span>groupB</span><span>.</span><span>entities</span><span>)</span><span> </span><span>{</span><span>
      </span><span>/*…*/</span><span>
    </span><span>}</span><span>
  </span><span>}</span><span>
  destroy</span><span>()</span><span> </span><span>{</span><span>
    </span><span>/* cleanup */</span><span>
  </span><span>}</span><span>
</span><span>}</span>
```

## Config signals

System config values are reactive signals powered by `@preact/signals`. Each config key is a `Signal<T>` at `this.config.key`.

```
<span>export</span><span> </span><span>class</span><span> </span><span>CameraShake</span><span> </span><span>extends</span><span> createSystem</span><span>(</span><span>
  </span><span>{},</span><span>
  </span><span>{</span><span>
    intensity</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Float32</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>0</span><span> </span><span>},</span><span>
    decayPerSecond</span><span>:</span><span> </span><span>{</span><span> type</span><span>:</span><span> </span><span>Types</span><span>.</span><span>Float32</span><span>,</span><span> </span><span>default</span><span>:</span><span> </span><span>1</span><span> </span><span>},</span><span>
  </span><span>},</span><span>
</span><span>)</span><span> </span><span>{</span><span>
  update</span><span>(</span><span>dt</span><span>:</span><span> number</span><span>)</span><span> </span><span>{</span><span>
    </span><span>const</span><span> i </span><span>=</span><span> </span><span>this</span><span>.</span><span>config</span><span>.</span><span>intensity</span><span>.</span><span>peek</span><span>();</span><span>
    </span><span>if</span><span> </span><span>(</span><span>i </span><span>&lt;=</span><span> </span><span>0</span><span>)</span><span> </span><span>return</span><span>;</span><span>
    </span><span>// apply random offset scaled by i</span><span>
    </span><span>this</span><span>.</span><span>camera</span><span>.</span><span>position</span><span>.</span><span>x </span><span>+=</span><span> </span><span>(</span><span>Math</span><span>.</span><span>random</span><span>()</span><span> </span><span>-</span><span> </span><span>0.5</span><span>)</span><span> </span><span>*</span><span> </span><span>0.01</span><span> </span><span>*</span><span> i</span><span>;</span><span>
    </span><span>this</span><span>.</span><span>config</span><span>.</span><span>intensity</span><span>.</span><span>value </span><span>=</span><span> </span><span>Math</span><span>.</span><span>max</span><span>(</span><span>
      </span><span>0</span><span>,</span><span>
      i </span><span>-</span><span> </span><span>this</span><span>.</span><span>config</span><span>.</span><span>decayPerSecond</span><span>.</span><span>peek</span><span>()</span><span> </span><span>*</span><span> dt</span><span>,</span><span>
    </span><span>);</span><span>
  </span><span>}</span><span>
</span><span>}</span>
```

### Reading vs tracking

-   `.value` — set and track.-   `.peek()` — read without tracking to avoid incidental subscriptions.-   `.subscribe(fn)` — run when the value changes.

```
<span>const</span><span> unsubscribe </span><span>=</span><span> </span><span>this</span><span>.</span><span>config</span><span>.</span><span>intensity</span><span>.</span><span>subscribe</span><span>((</span><span>v</span><span>)</span><span> </span><span>=&gt;</span><span> console</span><span>.</span><span>log</span><span>(</span><span>v</span><span>));</span><span>
</span><span>// later</span><span>
unsubscribe</span><span>();</span>
```

### UI ↔ ECS wiring

Config signals are ideal for developer tools and UI controls:

```
<span>// debugging slider</span><span>
document</span><span>.</span><span>getElementById</span><span>(</span><span>'intensity'</span><span>)!.</span><span>addEventListener</span><span>(</span><span>'input'</span><span>,</span><span> </span><span>(</span><span>e</span><span>)</span><span> </span><span>=&gt;</span><span> </span><span>{</span><span>
  </span><span>this</span><span>.</span><span>config</span><span>.</span><span>intensity</span><span>.</span><span>value </span><span>=</span><span> </span><span>Number</span><span>((</span><span>e</span><span>.</span><span>target </span><span>as</span><span> </span><span>HTMLInputElement</span><span>).</span><span>value</span><span>);</span><span>
</span><span>});</span>
```

## Creating/destroying entities in systems

```
<span>const</span><span> e </span><span>=</span><span> </span><span>this</span><span>.</span><span>createEntity</span><span>();</span><span>
e</span><span>.</span><span>addComponent</span><span>(</span><span>CompA</span><span>);</span><span>
e</span><span>.</span><span>destroy</span><span>();</span><span> </span><span>// remove when done</span>
```

## Priorities

Systems run each frame in ascending `priority` (more negative runs earlier). IWSDK registers some priorities by default when you enable features in `World.create`:

-   Locomotion: −5 (if enabled)-   Input: −4 (always)-   Grabbing: −3 (if enabled)

You control your system’s order through `{ priority }` when registering:

```
<span>world</span><span>.</span><span>registerSystem</span><span>(</span><span>MySystem</span><span>,</span><span> </span><span>{</span><span> priority</span><span>:</span><span> </span><span>-</span><span>2</span><span> </span><span>});</span>
```

## Query events and resource management

Use `qualify`/`disqualify` to perform one‑time setup/teardown per entity. Cache handles on the entity (for example, through a component or a symbol) instead of recomputing every frame.

## Batching and allocations

-   Avoid creating objects in `update` loops. Reuse vectors/arrays.-   Keep derived numbers in components if they are consumed by multiple systems.

## Debugging patterns

-   Log query sizes: `console.debug('N panels', this.queries.panels.entities.size)`.-   Temporarily increase verbosity of specific systems with a debug config signal.

## Sharing data through globals

`this.globals` is a reference to `world.globals`. It’s a simple shared object store. Use sparingly for cross‑system coordination.

```
<span>this</span><span>.</span><span>globals</span><span>.</span><span>navMesh </span><span>=</span><span> myNavMesh</span><span>;</span>
```