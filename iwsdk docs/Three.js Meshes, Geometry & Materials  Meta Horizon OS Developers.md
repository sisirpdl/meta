Understanding how to create and work with 3D objects is fundamental to any Three.js application. This guide covers the building blocks: geometries (shapes), materials (appearance), and meshes (the combination).

## The Core Equation

Every visible 3D object follows this pattern:

```
<span>Mesh</span><span> </span><span>=</span><span> </span><span>Geometry</span><span> </span><span>+</span><span> </span><span>Material</span><span>

</span><span>Geometry</span><span>:</span><span> </span><span>The</span><span> shape </span><span>(</span><span>vertices</span><span>,</span><span> faces</span><span>,</span><span> </span><span>UVs</span><span>)</span><span>
</span><span>Material</span><span>:</span><span> </span><span>The</span><span> appearance </span><span>(</span><span>color</span><span>,</span><span> texture</span><span>,</span><span> shading</span><span>)</span><span>
</span><span>Mesh</span><span>:</span><span> </span><span>The</span><span> renderable </span><span>object</span><span> that combines them</span>
```

In IWSDK, you create these using Three.js classes and attach them to entities.

## Geometries: The Shape of Things

Geometry defines the **shape** of 3D objects using vertices, faces, and texture coordinates.

### Built-in Geometries

Three.js provides many primitive shapes:

```
<span>import</span><span> </span><span>{</span><span>
  </span><span>BoxGeometry</span><span>,</span><span>
  </span><span>SphereGeometry</span><span>,</span><span>
  </span><span>CylinderGeometry</span><span>,</span><span>
  </span><span>PlaneGeometry</span><span>,</span><span>
  </span><span>TorusGeometry</span><span>,</span><span>
</span><span>}</span><span> </span><span>from</span><span> </span><span>'@iwsdk/core'</span><span>;</span><span>

</span><span>// Basic shapes with parameters</span><span>
</span><span>const</span><span> box </span><span>=</span><span> </span><span>new</span><span> </span><span>BoxGeometry</span><span>(</span><span>1</span><span>,</span><span> </span><span>1</span><span>,</span><span> </span><span>1</span><span>);</span><span> </span><span>// width, height, depth</span><span>
</span><span>const</span><span> sphere </span><span>=</span><span> </span><span>new</span><span> </span><span>SphereGeometry</span><span>(</span><span>0.5</span><span>,</span><span> </span><span>32</span><span>,</span><span> </span><span>16</span><span>);</span><span> </span><span>// radius, widthSeg, heightSeg</span><span>
</span><span>const</span><span> cylinder </span><span>=</span><span> </span><span>new</span><span> </span><span>CylinderGeometry</span><span>(</span><span>0.5</span><span>,</span><span> </span><span>0.5</span><span>,</span><span> </span><span>2</span><span>,</span><span> </span><span>32</span><span>);</span><span> </span><span>// radiusTop, radiusBottom, height, segments</span><span>
</span><span>const</span><span> plane </span><span>=</span><span> </span><span>new</span><span> </span><span>PlaneGeometry</span><span>(</span><span>2</span><span>,</span><span> </span><span>2</span><span>);</span><span> </span><span>// width, height</span><span>
</span><span>const</span><span> torus </span><span>=</span><span> </span><span>new</span><span> </span><span>TorusGeometry</span><span>(</span><span>1</span><span>,</span><span> </span><span>0.3</span><span>,</span><span> </span><span>16</span><span>,</span><span> </span><span>100</span><span>);</span><span> </span><span>// radius, tube, radialSeg, tubularSeg</span>
```

### Custom Geometry

For complex shapes, create custom BufferGeometry:

```
<span>import</span><span> </span><span>{</span><span> </span><span>BufferGeometry</span><span>,</span><span> </span><span>BufferAttribute</span><span> </span><span>}</span><span> </span><span>from</span><span> </span><span>'@iwsdk/core'</span><span>;</span><span>

</span><span>// Create triangle</span><span>
</span><span>const</span><span> geometry </span><span>=</span><span> </span><span>new</span><span> </span><span>BufferGeometry</span><span>();</span><span>

</span><span>// Define vertices (3 points in 3D space)</span><span>
</span><span>const</span><span> vertices </span><span>=</span><span> </span><span>new</span><span> </span><span>Float32Array</span><span>([</span><span>
  </span><span>-</span><span>1</span><span>,</span><span>
  </span><span>-</span><span>1</span><span>,</span><span>
  </span><span>0</span><span>,</span><span> </span><span>// vertex 1</span><span>
  </span><span>1</span><span>,</span><span>
  </span><span>-</span><span>1</span><span>,</span><span>
  </span><span>0</span><span>,</span><span> </span><span>// vertex 2</span><span>
  </span><span>0</span><span>,</span><span>
  </span><span>1</span><span>,</span><span>
  </span><span>0</span><span>,</span><span> </span><span>// vertex 3</span><span>
</span><span>]);</span><span>

</span><span>// Define normals (for lighting)</span><span>
</span><span>const</span><span> normals </span><span>=</span><span> </span><span>new</span><span> </span><span>Float32Array</span><span>([</span><span>
  </span><span>0</span><span>,</span><span>
  </span><span>0</span><span>,</span><span>
  </span><span>1</span><span>,</span><span> </span><span>// normal for vertex 1</span><span>
  </span><span>0</span><span>,</span><span>
  </span><span>0</span><span>,</span><span>
  </span><span>1</span><span>,</span><span> </span><span>// normal for vertex 2</span><span>
  </span><span>0</span><span>,</span><span>
  </span><span>0</span><span>,</span><span>
  </span><span>1</span><span>,</span><span> </span><span>// normal for vertex 3</span><span>
</span><span>]);</span><span>

</span><span>// Define UV coordinates (for texturing)</span><span>
</span><span>const</span><span> uvs </span><span>=</span><span> </span><span>new</span><span> </span><span>Float32Array</span><span>([</span><span>
  </span><span>0</span><span>,</span><span>
  </span><span>0</span><span>,</span><span> </span><span>// UV for vertex 1</span><span>
  </span><span>1</span><span>,</span><span>
  </span><span>0</span><span>,</span><span> </span><span>// UV for vertex 2</span><span>
  </span><span>0.5</span><span>,</span><span>
  </span><span>1</span><span>,</span><span> </span><span>// UV for vertex 3</span><span>
</span><span>]);</span><span>

geometry</span><span>.</span><span>setAttribute</span><span>(</span><span>'position'</span><span>,</span><span> </span><span>new</span><span> </span><span>BufferAttribute</span><span>(</span><span>vertices</span><span>,</span><span> </span><span>3</span><span>));</span><span>
geometry</span><span>.</span><span>setAttribute</span><span>(</span><span>'normal'</span><span>,</span><span> </span><span>new</span><span> </span><span>BufferAttribute</span><span>(</span><span>normals</span><span>,</span><span> </span><span>3</span><span>));</span><span>
geometry</span><span>.</span><span>setAttribute</span><span>(</span><span>'uv'</span><span>,</span><span> </span><span>new</span><span> </span><span>BufferAttribute</span><span>(</span><span>uvs</span><span>,</span><span> </span><span>2</span><span>));</span>
```

### Reusing Geometry

```
<span>// Create geometry once, reuse for multiple entities</span><span>
</span><span>const</span><span> sharedGeometry </span><span>=</span><span> </span><span>new</span><span> </span><span>BoxGeometry</span><span>(</span><span>1</span><span>,</span><span> </span><span>1</span><span>,</span><span> </span><span>1</span><span>);</span><span>

</span><span>// Create multiple entities with same shape</span><span>
</span><span>for</span><span> </span><span>(</span><span>let</span><span> i </span><span>=</span><span> </span><span>0</span><span>;</span><span> i </span><span>&lt;</span><span> </span><span>10</span><span>;</span><span> i</span><span>++)</span><span> </span><span>{</span><span>
  </span><span>const</span><span> material </span><span>=</span><span> </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>({</span><span>
    color</span><span>:</span><span> </span><span>Math</span><span>.</span><span>random</span><span>()</span><span> </span><span>*</span><span> </span><span>0xffffff</span><span>,</span><span>
  </span><span>});</span><span>
  </span><span>const</span><span> mesh </span><span>=</span><span> </span><span>new</span><span> </span><span>Mesh</span><span>(</span><span>sharedGeometry</span><span>,</span><span> material</span><span>);</span><span>
  </span><span>const</span><span> entity </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>(</span><span>mesh</span><span>);</span><span>

  </span><span>// Position each entity differently</span><span>
  entity</span><span>.</span><span>object3D</span><span>.</span><span>position</span><span>.</span><span>set</span><span>(</span><span>i </span><span>*</span><span> </span><span>2</span><span>,</span><span> </span><span>0</span><span>,</span><span> </span><span>0</span><span>);</span><span>
</span><span>}</span>
```

## Materials: The Look of Things

Materials define how surfaces **look** - their color, shininess, transparency, and how they react to light.

### Material Types

**For WebXR, use physically-based materials:**

```
<span>import</span><span> </span><span>{</span><span>
  </span><span>MeshStandardMaterial</span><span>,</span><span> </span><span>// Good balance of quality and performance</span><span>
  </span><span>MeshPhysicalMaterial</span><span>,</span><span> </span><span>// Advanced PBR features (clearcoat, transmission)</span><span>
  </span><span>MeshBasicMaterial</span><span>,</span><span> </span><span>// Unlit (use sparingly)</span><span>
</span><span>}</span><span> </span><span>from</span><span> </span><span>'@iwsdk/core'</span><span>;</span><span>

</span><span>// Standard PBR material (recommended)</span><span>
</span><span>const</span><span> pbr </span><span>=</span><span> </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>({</span><span>
  color</span><span>:</span><span> </span><span>0x00ff00</span><span>,</span><span> </span><span>// Base color (green)</span><span>
  metalness</span><span>:</span><span> </span><span>0.1</span><span>,</span><span> </span><span>// 0 = dielectric, 1 = metallic</span><span>
  roughness</span><span>:</span><span> </span><span>0.7</span><span>,</span><span> </span><span>// 0 = mirror, 1 = completely rough</span><span>
</span><span>});</span><span>

</span><span>// Advanced PBR material</span><span>
</span><span>const</span><span> advanced </span><span>=</span><span> </span><span>new</span><span> </span><span>MeshPhysicalMaterial</span><span>({</span><span>
  color</span><span>:</span><span> </span><span>0xffffff</span><span>,</span><span>
  metalness</span><span>:</span><span> </span><span>0</span><span>,</span><span>
  roughness</span><span>:</span><span> </span><span>0.1</span><span>,</span><span>
  clearcoat</span><span>:</span><span> </span><span>1.0</span><span>,</span><span> </span><span>// Clear coating effect</span><span>
  clearcoatRoughness</span><span>:</span><span> </span><span>0.1</span><span>,</span><span>
  transmission</span><span>:</span><span> </span><span>0.9</span><span>,</span><span> </span><span>// Glass-like transparency</span><span>
  thickness</span><span>:</span><span> </span><span>1.0</span><span>,</span><span>
</span><span>});</span><span>

</span><span>// Unlit material (for UI elements)</span><span>
</span><span>const</span><span> unlit </span><span>=</span><span> </span><span>new</span><span> </span><span>MeshBasicMaterial</span><span>({</span><span>
  color</span><span>:</span><span> </span><span>0xff0000</span><span>,</span><span>
  transparent</span><span>:</span><span> </span><span>true</span><span>,</span><span>
  opacity</span><span>:</span><span> </span><span>0.8</span><span>,</span><span>
</span><span>});</span>
```

### Working with Textures

Textures add detail and realism:

```
<span>import</span><span> </span><span>{</span><span> </span><span>TextureLoader</span><span> </span><span>}</span><span> </span><span>from</span><span> </span><span>'@iwsdk/core'</span><span>;</span><span>

</span><span>const</span><span> loader </span><span>=</span><span> </span><span>new</span><span> </span><span>TextureLoader</span><span>();</span><span>

</span><span>// Load textures</span><span>
</span><span>const</span><span> diffuseTexture </span><span>=</span><span> loader</span><span>.</span><span>load</span><span>(</span><span>'/textures/brick_diffuse.jpg'</span><span>);</span><span>
</span><span>const</span><span> normalTexture </span><span>=</span><span> loader</span><span>.</span><span>load</span><span>(</span><span>'/textures/brick_normal.jpg'</span><span>);</span><span>
</span><span>const</span><span> roughnessTexture </span><span>=</span><span> loader</span><span>.</span><span>load</span><span>(</span><span>'/textures/brick_roughness.jpg'</span><span>);</span><span>

</span><span>// Apply to material</span><span>
</span><span>const</span><span> material </span><span>=</span><span> </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>({</span><span>
  map</span><span>:</span><span> diffuseTexture</span><span>,</span><span> </span><span>// Base color texture</span><span>
  normalMap</span><span>:</span><span> normalTexture</span><span>,</span><span> </span><span>// Surface detail</span><span>
  roughnessMap</span><span>:</span><span> roughnessTexture</span><span>,</span><span> </span><span>// Roughness variation</span><span>
</span><span>});</span><span>

</span><span>// Configure texture settings</span><span>
diffuseTexture</span><span>.</span><span>wrapS </span><span>=</span><span> </span><span>RepeatWrapping</span><span>;</span><span>
diffuseTexture</span><span>.</span><span>wrapT </span><span>=</span><span> </span><span>RepeatWrapping</span><span>;</span><span>
diffuseTexture</span><span>.</span><span>repeat</span><span>.</span><span>set</span><span>(</span><span>2</span><span>,</span><span> </span><span>2</span><span>);</span><span> </span><span>// Tile 2x2</span>
```

### Color Space Management

**Critical for correct colors in VR:**

```
<span>// Set color space for albedo textures</span><span>
diffuseTexture</span><span>.</span><span>colorSpace </span><span>=</span><span> </span><span>SRGBColorSpace</span><span>;</span><span>

</span><span>// Linear textures (normals, roughness, etc.) use LinearSRGBColorSpace</span><span>
normalTexture</span><span>.</span><span>colorSpace </span><span>=</span><span> </span><span>LinearSRGBColorSpace</span><span>;</span><span>
roughnessTexture</span><span>.</span><span>colorSpace </span><span>=</span><span> </span><span>LinearSRGBColorSpace</span><span>;</span>
```

## Meshes: Putting It Together

Meshes combine geometry and materials into renderable objects:

```
<span>import</span><span> </span><span>{</span><span> </span><span>Mesh</span><span> </span><span>}</span><span> </span><span>from</span><span> </span><span>'@iwsdk/core'</span><span>;</span><span>

</span><span>// Create mesh</span><span>
</span><span>const</span><span> geometry </span><span>=</span><span> </span><span>new</span><span> </span><span>BoxGeometry</span><span>(</span><span>1</span><span>,</span><span> </span><span>1</span><span>,</span><span> </span><span>1</span><span>);</span><span>
</span><span>const</span><span> material </span><span>=</span><span> </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>({</span><span> color</span><span>:</span><span> </span><span>0x00ff00</span><span> </span><span>});</span><span>
</span><span>const</span><span> mesh </span><span>=</span><span> </span><span>new</span><span> </span><span>Mesh</span><span>(</span><span>geometry</span><span>,</span><span> material</span><span>);</span><span>

</span><span>// Add to IWSDK entity</span><span>
</span><span>const</span><span> entity </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>(</span><span>mesh</span><span>);</span><span>

</span><span>// Set additional Three.js properties</span><span>
mesh</span><span>.</span><span>castShadow </span><span>=</span><span> </span><span>true</span><span>;</span><span>
mesh</span><span>.</span><span>receiveShadow </span><span>=</span><span> </span><span>true</span><span>;</span><span>
mesh</span><span>.</span><span>name </span><span>=</span><span> </span><span>'GreenBox'</span><span>;</span>
```

### Multiple Materials

Objects can have different materials on different faces:

```
<span>// Array of materials for different faces</span><span>
</span><span>const</span><span> materials </span><span>=</span><span> </span><span>[</span><span>
  </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>({</span><span> color</span><span>:</span><span> </span><span>0xff0000</span><span> </span><span>}),</span><span> </span><span>// +X</span><span>
  </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>({</span><span> color</span><span>:</span><span> </span><span>0x00ff00</span><span> </span><span>}),</span><span> </span><span>// -X</span><span>
  </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>({</span><span> color</span><span>:</span><span> </span><span>0x0000ff</span><span> </span><span>}),</span><span> </span><span>// +Y</span><span>
  </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>({</span><span> color</span><span>:</span><span> </span><span>0xffff00</span><span> </span><span>}),</span><span> </span><span>// -Y</span><span>
  </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>({</span><span> color</span><span>:</span><span> </span><span>0xff00ff</span><span> </span><span>}),</span><span> </span><span>// +Z</span><span>
  </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>({</span><span> color</span><span>:</span><span> </span><span>0x00ffff</span><span> </span><span>}),</span><span> </span><span>// -Z</span><span>
</span><span>];</span><span>

</span><span>const</span><span> mesh </span><span>=</span><span> </span><span>new</span><span> </span><span>Mesh</span><span>(</span><span>new</span><span> </span><span>BoxGeometry</span><span>(</span><span>1</span><span>,</span><span> </span><span>1</span><span>,</span><span> </span><span>1</span><span>),</span><span> materials</span><span>);</span>
```

## Lighting and Environment

### IWSDK’s Default Lighting

IWSDK provides good default lighting:

```
<span>// This happens automatically in World.create()</span><span>
</span><span>// - Gradient environment (soft ambient lighting)</span><span>
</span><span>// - PMREM generation for reflections</span><span>
</span><span>// - Proper tone mapping</span>
```

### Custom Environment Maps

For realistic reflections and lighting:

```
<span>import</span><span> </span><span>{</span><span> </span><span>RGBELoader</span><span>,</span><span> </span><span>PMREMGenerator</span><span> </span><span>}</span><span> </span><span>from</span><span> </span><span>'@iwsdk/core'</span><span>;</span><span>

</span><span>const</span><span> loader </span><span>=</span><span> </span><span>new</span><span> </span><span>RGBELoader</span><span>();</span><span>
</span><span>const</span><span> pmremGenerator </span><span>=</span><span> </span><span>new</span><span> </span><span>PMREMGenerator</span><span>(</span><span>world</span><span>.</span><span>renderer</span><span>);</span><span>

loader</span><span>.</span><span>load</span><span>(</span><span>'/environments/sunset.hdr'</span><span>,</span><span> </span><span>(</span><span>texture</span><span>)</span><span> </span><span>=&gt;</span><span> </span><span>{</span><span>
  </span><span>const</span><span> envMap </span><span>=</span><span> pmremGenerator</span><span>.</span><span>fromEquirectangular</span><span>(</span><span>texture</span><span>).</span><span>texture</span><span>;</span><span>
  pmremGenerator</span><span>.</span><span>dispose</span><span>();</span><span>

  </span><span>// Apply to scene</span><span>
  world</span><span>.</span><span>scene</span><span>.</span><span>environment </span><span>=</span><span> envMap</span><span>;</span><span>
  world</span><span>.</span><span>scene</span><span>.</span><span>background </span><span>=</span><span> envMap</span><span>;</span><span> </span><span>// Optional: visible background</span><span>

  </span><span>// Apply to specific materials</span><span>
  material</span><span>.</span><span>envMap </span><span>=</span><span> envMap</span><span>;</span><span>
</span><span>});</span>
```

### Lighting Best Practices for WebXR

**Environment vs Direct Lights:**

```
<span>// ✅ Prefer environment lighting for VR (matches real-world lighting)</span><span>
world</span><span>.</span><span>scene</span><span>.</span><span>environment </span><span>=</span><span> envMap</span><span>;</span><span>

</span><span>// ✅ Add directional light only if needed</span><span>
</span><span>const</span><span> sun </span><span>=</span><span> </span><span>new</span><span> </span><span>DirectionalLight</span><span>(</span><span>0xffffff</span><span>,</span><span> </span><span>0.5</span><span>);</span><span>
sun</span><span>.</span><span>position</span><span>.</span><span>set</span><span>(</span><span>10</span><span>,</span><span> </span><span>10</span><span>,</span><span> </span><span>5</span><span>);</span><span>
world</span><span>.</span><span>scene</span><span>.</span><span>add</span><span>(</span><span>sun</span><span>);</span><span>

</span><span>// ❌ Avoid too many dynamic lights (performance impact)</span>
```

## Performance Optimization

### Geometry Sharing

```
<span>// ✅ Reuse geometry for identical shapes</span><span>
</span><span>const</span><span> boxGeometry </span><span>=</span><span> </span><span>new</span><span> </span><span>BoxGeometry</span><span>(</span><span>1</span><span>,</span><span> </span><span>1</span><span>,</span><span> </span><span>1</span><span>);</span><span>

</span><span>for</span><span> </span><span>(</span><span>let</span><span> i </span><span>=</span><span> </span><span>0</span><span>;</span><span> i </span><span>&lt;</span><span> </span><span>100</span><span>;</span><span> i</span><span>++)</span><span> </span><span>{</span><span>
  </span><span>const</span><span> material </span><span>=</span><span> </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>({</span><span>
    color</span><span>:</span><span> </span><span>new</span><span> </span><span>Color</span><span>().</span><span>setHSL</span><span>(</span><span>i </span><span>/</span><span> </span><span>100</span><span>,</span><span> </span><span>1</span><span>,</span><span> </span><span>0.5</span><span>),</span><span>
  </span><span>});</span><span>
  </span><span>const</span><span> mesh </span><span>=</span><span> </span><span>new</span><span> </span><span>Mesh</span><span>(</span><span>boxGeometry</span><span>,</span><span> material</span><span>);</span><span> </span><span>// Same geometry</span><span>
  </span><span>// ... create entities</span><span>
</span><span>}</span>
```

### Material Sharing and Uniforms

```
<span>// ✅ Share materials when possible</span><span>
</span><span>const</span><span> sharedMaterial </span><span>=</span><span> </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>({</span><span> color</span><span>:</span><span> </span><span>0x00ff00</span><span> </span><span>});</span><span>

</span><span>// ✅ Use uniforms for animated properties</span><span>
</span><span>const</span><span> uniformMaterial </span><span>=</span><span> </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>({</span><span>
  color</span><span>:</span><span> </span><span>0xffffff</span><span>,</span><span>
</span><span>});</span><span>

</span><span>// In system update:</span><span>
uniformMaterial</span><span>.</span><span>color</span><span>.</span><span>setHSL</span><span>(</span><span>time </span><span>*</span><span> </span><span>0.001</span><span>,</span><span> </span><span>1</span><span>,</span><span> </span><span>0.5</span><span>);</span><span> </span><span>// Animate color</span>
```

### Texture Optimization

```
<span>// Optimize textures for VR</span><span>
</span><span>const</span><span> texture </span><span>=</span><span> loader</span><span>.</span><span>load</span><span>(</span><span>'/textures/diffuse.jpg'</span><span>);</span><span>

</span><span>// ✅ Use appropriate sizes (power of 2)</span><span>
</span><span>// 512x512, 1024x1024, 2048x2048</span><span>

</span><span>// ✅ Enable mipmaps for distant objects</span><span>
texture</span><span>.</span><span>generateMipmaps </span><span>=</span><span> </span><span>true</span><span>;</span><span>

</span><span>// ✅ Use compressed formats when possible</span><span>
</span><span>// .ktx2, .basis for better performance</span>
```

### LOD (Level of Detail)

```
<span>import</span><span> </span><span>{</span><span> LOD </span><span>}</span><span> </span><span>from</span><span> </span><span>'@iwsdk/core'</span><span>;</span><span>

</span><span>const</span><span> lod </span><span>=</span><span> </span><span>new</span><span> LOD</span><span>();</span><span>

</span><span>// High detail (close)</span><span>
</span><span>const</span><span> highMesh </span><span>=</span><span> </span><span>new</span><span> </span><span>Mesh</span><span>(</span><span>
  </span><span>new</span><span> </span><span>SphereGeometry</span><span>(</span><span>1</span><span>,</span><span> </span><span>32</span><span>,</span><span> </span><span>16</span><span>),</span><span>
  </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>({</span><span> color</span><span>:</span><span> </span><span>0x00ff00</span><span> </span><span>}),</span><span>
</span><span>);</span><span>

</span><span>// Medium detail</span><span>
</span><span>const</span><span> medMesh </span><span>=</span><span> </span><span>new</span><span> </span><span>Mesh</span><span>(</span><span>
  </span><span>new</span><span> </span><span>SphereGeometry</span><span>(</span><span>1</span><span>,</span><span> </span><span>16</span><span>,</span><span> </span><span>8</span><span>),</span><span>
  </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>({</span><span> color</span><span>:</span><span> </span><span>0x00ff00</span><span> </span><span>}),</span><span>
</span><span>);</span><span>

</span><span>// Low detail (far)</span><span>
</span><span>const</span><span> lowMesh </span><span>=</span><span> </span><span>new</span><span> </span><span>Mesh</span><span>(</span><span>
  </span><span>new</span><span> </span><span>SphereGeometry</span><span>(</span><span>1</span><span>,</span><span> </span><span>8</span><span>,</span><span> </span><span>4</span><span>),</span><span>
  </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>({</span><span> color</span><span>:</span><span> </span><span>0x00ff00</span><span> </span><span>}),</span><span>
</span><span>);</span><span>

lod</span><span>.</span><span>addLevel</span><span>(</span><span>highMesh</span><span>,</span><span> </span><span>0</span><span>);</span><span> </span><span>// 0-10 meters</span><span>
lod</span><span>.</span><span>addLevel</span><span>(</span><span>medMesh</span><span>,</span><span> </span><span>10</span><span>);</span><span> </span><span>// 10-50 meters</span><span>
lod</span><span>.</span><span>addLevel</span><span>(</span><span>lowMesh</span><span>,</span><span> </span><span>50</span><span>);</span><span> </span><span>// 50+ meters</span><span>

</span><span>const</span><span> entity </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>(</span><span>lod</span><span>);</span>
```

## Common Patterns for WebXR

### Real-World Sized Objects

```
<span>// Create objects with appropriate VR/AR scale</span><span>
</span><span>const</span><span> geometry </span><span>=</span><span> </span><span>new</span><span> </span><span>BoxGeometry</span><span>(</span><span>0.1</span><span>,</span><span> </span><span>0.1</span><span>,</span><span> </span><span>0.1</span><span>);</span><span> </span><span>// 10cm cube</span><span>
</span><span>const</span><span> material </span><span>=</span><span> </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>({</span><span>
  color</span><span>:</span><span> </span><span>0x4caf50</span><span>,</span><span>
  roughness</span><span>:</span><span> </span><span>0.3</span><span>,</span><span>
  metalness</span><span>:</span><span> </span><span>0.1</span><span>,</span><span>
</span><span>});</span><span>

</span><span>const</span><span> mesh </span><span>=</span><span> </span><span>new</span><span> </span><span>Mesh</span><span>(</span><span>geometry</span><span>,</span><span> material</span><span>);</span><span>
</span><span>const</span><span> entity </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>(</span><span>mesh</span><span>);</span><span>

</span><span>// Position at comfortable interaction height</span><span>
entity</span><span>.</span><span>object3D</span><span>.</span><span>position</span><span>.</span><span>set</span><span>(</span><span>0</span><span>,</span><span> </span><span>1.2</span><span>,</span><span> </span><span>-</span><span>0.5</span><span>);</span>
```

### UI Panels

```
<span>// Use unlit materials for UI elements</span><span>
</span><span>const</span><span> panelMaterial </span><span>=</span><span> </span><span>new</span><span> </span><span>MeshBasicMaterial</span><span>({</span><span>
  color</span><span>:</span><span> </span><span>0xffffff</span><span>,</span><span>
  transparent</span><span>:</span><span> </span><span>true</span><span>,</span><span>
  opacity</span><span>:</span><span> </span><span>0.9</span><span>,</span><span>
</span><span>});</span><span>

</span><span>const</span><span> panelGeometry </span><span>=</span><span> </span><span>new</span><span> </span><span>PlaneGeometry</span><span>(</span><span>0.3</span><span>,</span><span> </span><span>0.2</span><span>);</span><span> </span><span>// 30cm x 20cm</span><span>
</span><span>const</span><span> panel </span><span>=</span><span> </span><span>new</span><span> </span><span>Mesh</span><span>(</span><span>panelGeometry</span><span>,</span><span> panelMaterial</span><span>);</span><span>

</span><span>const</span><span> panelEntity </span><span>=</span><span> world</span><span>.</span><span>createTransformEntity</span><span>(</span><span>panel</span><span>,</span><span> </span><span>{</span><span> persistent</span><span>:</span><span> </span><span>true</span><span> </span><span>});</span>
```

### Particle Effects

```
<span>// Use instanced meshes for particles</span><span>
</span><span>import</span><span> </span><span>{</span><span> </span><span>InstancedMesh</span><span> </span><span>}</span><span> </span><span>from</span><span> </span><span>'@iwsdk/core'</span><span>;</span><span>

</span><span>const</span><span> particleGeometry </span><span>=</span><span> </span><span>new</span><span> </span><span>SphereGeometry</span><span>(</span><span>0.01</span><span>,</span><span> </span><span>8</span><span>,</span><span> </span><span>4</span><span>);</span><span> </span><span>// Small spheres</span><span>
</span><span>const</span><span> particleMaterial </span><span>=</span><span> </span><span>new</span><span> </span><span>MeshBasicMaterial</span><span>({</span><span> color</span><span>:</span><span> </span><span>0xffff00</span><span> </span><span>});</span><span>

</span><span>const</span><span> particles </span><span>=</span><span> </span><span>new</span><span> </span><span>InstancedMesh</span><span>(</span><span>particleGeometry</span><span>,</span><span> particleMaterial</span><span>,</span><span> </span><span>1000</span><span>);</span><span>

</span><span>// Update instances in systems</span><span>
</span><span>const</span><span> matrix </span><span>=</span><span> </span><span>new</span><span> </span><span>Matrix4</span><span>();</span><span>
</span><span>for</span><span> </span><span>(</span><span>let</span><span> i </span><span>=</span><span> </span><span>0</span><span>;</span><span> i </span><span>&lt;</span><span> </span><span>1000</span><span>;</span><span> i</span><span>++)</span><span> </span><span>{</span><span>
  matrix</span><span>.</span><span>setPosition</span><span>(</span><span>
    </span><span>Math</span><span>.</span><span>random</span><span>()</span><span> </span><span>*</span><span> </span><span>10</span><span> </span><span>-</span><span> </span><span>5</span><span>,</span><span>
    </span><span>Math</span><span>.</span><span>random</span><span>()</span><span> </span><span>*</span><span> </span><span>10</span><span>,</span><span>
    </span><span>Math</span><span>.</span><span>random</span><span>()</span><span> </span><span>*</span><span> </span><span>10</span><span> </span><span>-</span><span> </span><span>5</span><span>,</span><span>
  </span><span>);</span><span>
  particles</span><span>.</span><span>setMatrixAt</span><span>(</span><span>i</span><span>,</span><span> matrix</span><span>);</span><span>
</span><span>}</span><span>
particles</span><span>.</span><span>instanceMatrix</span><span>.</span><span>needsUpdate </span><span>=</span><span> </span><span>true</span><span>;</span>
```

## Troubleshooting Common Issues

### Objects Appear Black

```
<span>// ❌ Missing or incorrect normals</span><span>
geometry</span><span>.</span><span>computeVertexNormals</span><span>();</span><span> </span><span>// Fix</span><span>

</span><span>// ❌ No environment lighting</span><span>
world</span><span>.</span><span>scene</span><span>.</span><span>environment </span><span>=</span><span> envMap</span><span>;</span><span> </span><span>// Fix</span>
```

### Textures Look Wrong

```
<span>// ❌ Wrong color space</span><span>
texture</span><span>.</span><span>colorSpace </span><span>=</span><span> </span><span>SRGBColorSpace</span><span>;</span><span> </span><span>// For albedo textures</span><span>
texture</span><span>.</span><span>colorSpace </span><span>=</span><span> </span><span>LinearSRGBColorSpace</span><span>;</span><span> </span><span>// For data textures</span><span>

</span><span>// ❌ Incorrect UV coordinates</span><span>
geometry</span><span>.</span><span>attributes</span><span>.</span><span>uv</span><span>.</span><span>needsUpdate </span><span>=</span><span> </span><span>true</span><span>;</span>
```

### Performance Issues

```
<span>// ❌ Too many draw calls</span><span>
</span><span>// Fix: Use InstancedMesh or merge geometries</span><span>

</span><span>// ❌ High-resolution textures</span><span>
</span><span>// Fix: Resize to appropriate sizes (512, 1024, 2048)</span><span>

</span><span>// ❌ Too many materials</span><span>
</span><span>// Fix: Share materials between objects</span>
```

## Summary

**Key Concepts:**

-   **Mesh = Geometry + Material** - The fundamental building block-   **Use PBR materials** - MeshStandardMaterial for realistic lighting-   **Manage color spaces** - sRGB for colors, LinearSRGB for data-   **Optimize for VR** - Share resources, use appropriate resolutions-   **IWSDK provides lighting** - Environment maps work out of the box-   **Real-world scale** - Size objects appropriately for VR interaction

Understanding these concepts enables you to create visually appealing, performant 3D objects that look natural in WebXR environments.