An entity is a lightweight container for Components. In IWSDK, entities may also carry a Three.js `object3D`.

## Creating entities

```
<span>const</span><span> e </span><span>=</span><span> world</span><span>.</span><span>createEntity</span><span>();</span><span>
</span><span>const</span><span> t </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>();</span><span> </span><span>// adds an Object3D and a Transform component</span>
```

Parenting options:

```
<span>const</span><span> child </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>(</span><span>undefined</span><span>,</span><span> </span><span>{</span><span> parent</span><span>:</span><span> t </span><span>});</span><span>
</span><span>const</span><span> persistent </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>(</span><span>undefined</span><span>,</span><span> </span><span>{</span><span> persistent</span><span>:</span><span> </span><span>true</span><span> </span><span>});</span><span> </span><span>// parented under scene</span>
```

## Object3D attachment

```
<span>import</span><span> </span><span>{</span><span> </span><span>Mesh</span><span>,</span><span> </span><span>BoxGeometry</span><span>,</span><span> </span><span>MeshStandardMaterial</span><span> </span><span>}</span><span> </span><span>from</span><span> </span><span>'@iwsdk/core'</span><span>;</span><span>

</span><span>const</span><span> geometry </span><span>=</span><span> </span><span>new</span><span> </span><span>BoxGeometry</span><span>(</span><span>1</span><span>,</span><span> </span><span>1</span><span>,</span><span> </span><span>1</span><span>);</span><span>
</span><span>const</span><span> material </span><span>=</span><span> </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>({</span><span> color</span><span>:</span><span> </span><span>0x00ff00</span><span> </span><span>});</span><span>
</span><span>const</span><span> mesh </span><span>=</span><span> </span><span>new</span><span> </span><span>Mesh</span><span>(</span><span>geometry</span><span>,</span><span> material</span><span>);</span><span>

</span><span>const</span><span> entity </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>(</span><span>mesh</span><span>);</span>
```

`createTransformEntity` is the recommended way to attach Three.js objects to entities. It ensures `object3D` is properly managed and detached when the entity is released.

## Component operations

```
<span>e</span><span>.</span><span>addComponent</span><span>(</span><span>Health</span><span>,</span><span> </span><span>{</span><span> current</span><span>:</span><span> </span><span>100</span><span> </span><span>});</span><span>
e</span><span>.</span><span>removeComponent</span><span>(</span><span>Health</span><span>);</span><span>
e</span><span>.</span><span>has</span><span>(</span><span>Health</span><span>);</span><span> </span><span>// boolean</span>
```

## Reading and writing data (in systems)

```
<span>const</span><span> v </span><span>=</span><span> e</span><span>.</span><span>getValue</span><span>(</span><span>Health</span><span>,</span><span> </span><span>'current'</span><span>);</span><span> </span><span>// number | undefined</span><span>
e</span><span>.</span><span>setValue</span><span>(</span><span>Health</span><span>,</span><span> </span><span>'current'</span><span>,</span><span> </span><span>75</span><span>);</span><span>

</span><span>// For vector fields (Types.Vec3) use a typed view:</span><span>
</span><span>const</span><span> pos </span><span>=</span><span> e</span><span>.</span><span>getVectorView</span><span>(</span><span>Transform</span><span>,</span><span> </span><span>'position'</span><span>);</span><span> </span><span>// Float32Array</span><span>
pos</span><span>[</span><span>1</span><span>]</span><span> </span><span>+=</span><span> </span><span>1</span><span>;</span><span> </span><span>// move up</span>
```