Now that you can test your WebXR experience, it’s time to learn how to create and manipulate 3D objects. In this guide, you’ll learn the fundamentals of 3D graphics using Three.js within the IWSDK framework. By the end, you’ll be able to create primitive shapes and arrange them in 3D space.

## Three.js fundamentals

IWSDK is built on top of Three.js, the most popular WebGL library for JavaScript. Before diving into IWSDK’s Entity Component System architecture, it’s important to understand the basic Three.js building blocks.

Every 3D object is composed of four essential parts:

-   Geometry: The shape/structure (cube, sphere, plane).-   Material: The surface properties (color, texture, how light interacts).-   Mesh: The combination of geometry + material that creates a renderable object.-   Object3D: The base class that provides position, rotation, and scale properties.

`Object3D` is the base class for all objects in Three.js that can be placed in a 3D scene. `Mesh` extends `Object3D`, adding the ability to render geometry with materials. This means every mesh has position, rotation, and scale properties inherited from `Object3D`.

### Geometry: defining shape

Geometry defines the 3D structure - the vertices, faces, and edges that make up a shape. Here are the essential primitive geometries you’ll use most often:

**BoxGeometry** - For cubes and rectangular shapes:

```
<span><span>new</span><span>&nbsp;</span><span>BoxGeometry</span><span>(</span><span>1</span><span>,&nbsp;</span><span>1</span><span>,&nbsp;</span><span>1</span><span>);&nbsp;</span><span>//&nbsp;Perfect&nbsp;cube</span></span><br><span><span>new</span><span>&nbsp;</span><span>BoxGeometry</span><span>(</span><span>2</span><span>,&nbsp;</span><span>0.5</span><span>,&nbsp;</span><span>1</span><span>);&nbsp;</span><span>//&nbsp;Rectangular&nbsp;box&nbsp;(width,&nbsp;height,&nbsp;depth)</span></span><br><span><span></span></span><br>
```

**SphereGeometry** - For balls and rounded objects:

```
<span><span>new</span><span>&nbsp;</span><span>SphereGeometry</span><span>(</span><span>1</span><span>,&nbsp;</span><span>32</span><span>,&nbsp;</span><span>32</span><span>);&nbsp;</span><span>//&nbsp;Simple&nbsp;sphere&nbsp;(radius,&nbsp;horizontal&nbsp;segments,&nbsp;ver</span><span>tical&nbsp;segments)</span></span><br><span><span>new</span><span>&nbsp;</span><span>SphereGeometry</span><span>(</span><span>1</span><span>,&nbsp;</span><span>16</span><span>,&nbsp;</span><span>16</span><span>);&nbsp;</span><span>//&nbsp;Lower&nbsp;detail&nbsp;for&nbsp;better&nbsp;performance</span></span><br><span><span></span></span><br>
```

**CylinderGeometry** - For tubes, cans, and cones:

```
<span><span>new</span><span>&nbsp;</span><span>CylinderGeometry</span><span>(</span><span>1</span><span>,&nbsp;</span><span>1</span><span>,&nbsp;</span><span>2</span><span>,&nbsp;</span><span>32</span><span>);&nbsp;</span><span>//&nbsp;Cylinder</span></span><br><span><span>new</span><span>&nbsp;</span><span>CylinderGeometry</span><span>(</span><span>0</span><span>,&nbsp;</span><span>1</span><span>,&nbsp;</span><span>2</span><span>,&nbsp;</span><span>32</span><span>);&nbsp;</span><span>//&nbsp;Cone&nbsp;(top&nbsp;radius&nbsp;=&nbsp;0)</span></span><br><span><span></span></span><br>
```

**PlaneGeometry** - For flat surfaces:

```
<span><span>new</span><span>&nbsp;</span><span>PlaneGeometry</span><span>(</span><span>2</span><span>,&nbsp;</span><span>2</span><span>);&nbsp;</span><span>//&nbsp;Square&nbsp;plane</span></span><br><span><span>new</span><span>&nbsp;</span><span>PlaneGeometry</span><span>(</span><span>4</span><span>,&nbsp;</span><span>2</span><span>);&nbsp;</span><span>//&nbsp;Rectangular&nbsp;plane&nbsp;(width,&nbsp;height)</span></span><br><span><span></span></span><br>
```

### Material

Materials determine the appearance of an object. There are two essential materials:

-   **MeshBasicMaterial**, which produces a simple material with flat colors that don’t respond to lighting, like this example.
    
    ```
    <span><span>import</span><span>&nbsp;{&nbsp;</span><span>MeshBasicMaterial</span><span>&nbsp;}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'three'</span><span>;</span></span><br><span><span></span></span><br><span><span>//&nbsp;Flat&nbsp;colors&nbsp;that&nbsp;don't&nbsp;respond&nbsp;to&nbsp;lighting</span></span><br><span><span>new</span><span>&nbsp;</span><span>MeshBasicMaterial</span><span>({&nbsp;color:&nbsp;</span><span>0xff0000</span><span>&nbsp;});</span></span><br><span><span>new</span><span>&nbsp;</span><span>MeshBasicMaterial</span><span>({&nbsp;color:&nbsp;</span><span>'red'</span><span>&nbsp;});</span></span><br><span><span>new</span><span>&nbsp;</span><span>MeshBasicMaterial</span><span>({&nbsp;color:&nbsp;</span><span>'#ff0000'</span><span>&nbsp;});</span></span><br><span><span></span></span><br>
    ```
    -   **MeshStandardMaterial**, which produces a material that creates realistic lighting, like this example.
    
    ```
    <span><span>import</span><span>&nbsp;{&nbsp;</span><span>MeshStandardMaterial</span><span>&nbsp;}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'three'</span><span>;</span></span><br><span><span></span></span><br><span><span>//&nbsp;Responds&nbsp;to&nbsp;lights&nbsp;in&nbsp;your&nbsp;scene</span></span><br><span><span>new</span><span>&nbsp;</span><span>MeshStandardMaterial</span><span>({</span></span><br><span><span>&nbsp;&nbsp;color:&nbsp;</span><span>0x0066cc</span><span>,</span></span><br><span><span>&nbsp;&nbsp;roughness:&nbsp;</span><span>0.5</span><span>,&nbsp;</span><span>//&nbsp;0&nbsp;=&nbsp;mirror,&nbsp;1&nbsp;=&nbsp;completely&nbsp;rough</span></span><br><span><span>&nbsp;&nbsp;metalness:&nbsp;</span><span>0.2</span><span>,&nbsp;</span><span>//&nbsp;0&nbsp;=&nbsp;non-metal,&nbsp;1&nbsp;=&nbsp;metal</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
    ```
    

### Mesh

A mesh combines geometry and material into a renderable 3D object. This example combines two different geometries and materials to create a red cube and a blue sphere.

```
<span><span>import</span><span>&nbsp;{&nbsp;</span><span>Mesh</span><span>&nbsp;}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'three'</span><span>;</span></span><br><span><span></span></span><br><span><span>//&nbsp;Create&nbsp;a&nbsp;red&nbsp;cube</span></span><br><span><span>const</span><span>&nbsp;cube&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>Mesh</span><span>(cubeGeometry,&nbsp;redMaterial);</span></span><br><span><span></span></span><br><span><span>//&nbsp;Create&nbsp;a&nbsp;blue&nbsp;sphere</span></span><br><span><span>const</span><span>&nbsp;sphere&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>Mesh</span><span>(sphereGeometry,&nbsp;blueMaterial);</span></span><br><span><span></span></span><br>
```

## Creating objects in IWSDK

IWSDK uses an Entity Component System (ECS) architecture pattern. Instead of working with Three.js objects directly, you create entities and add components to them.

**What is ECS?**

ECS will be explained in detail later. For now, think of it as a way to organize your code where:

-   Entities are things in your world (like a cube or player).-   Components are data that describes entities (position, color, behavior).-   Systems are logic that operates on entities with specific components.

### Creating transform entities from meshes

The most straightforward way to add 3D objects to your IWSDK scene is to create a Three.js mesh first, then create a transform entity from it, like this example demonstrates.

```
<span><span>import</span><span>&nbsp;{&nbsp;</span><span>World</span><span>,&nbsp;</span><span>Mesh</span><span>,&nbsp;</span><span>BoxGeometry</span><span>,&nbsp;</span><span>MeshStandardMaterial</span><span>&nbsp;}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'@iwsdk/core'</span><span>;</span></span><br><span><span></span></span><br><span><span>//&nbsp;First&nbsp;create&nbsp;the&nbsp;Three.js&nbsp;mesh</span></span><br><span><span>const</span><span>&nbsp;mesh&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>Mesh</span><span>(</span></span><br><span><span>&nbsp;&nbsp;</span><span>new</span><span>&nbsp;</span><span>BoxGeometry</span><span>(</span><span>1</span><span>,&nbsp;</span><span>1</span><span>,&nbsp;</span><span>1</span><span>),</span></span><br><span><span>&nbsp;&nbsp;</span><span>new</span><span>&nbsp;</span><span>MeshStandardMaterial</span><span>({&nbsp;color:&nbsp;</span><span>0xff6666</span><span>&nbsp;}),</span></span><br><span><span>);</span></span><br><span><span></span></span><br><span><span>//&nbsp;Position&nbsp;the&nbsp;mesh</span></span><br><span><span>mesh.position.</span><span>set</span><span>(</span><span>0</span><span>,&nbsp;</span><span>1</span><span>,&nbsp;-</span><span>2</span><span>);</span></span><br><span><span></span></span><br><span><span>//&nbsp;Create&nbsp;a&nbsp;transform&nbsp;entity&nbsp;from&nbsp;the&nbsp;mesh</span></span><br><span><span>const</span><span>&nbsp;entity&nbsp;=&nbsp;world.createTransformEntity(mesh);</span></span><br><span><span></span></span><br>
```

This approach:

-   Creates a standard Three.js mesh with geometry and material.-   Sets the initial position, rotation, or scale on the mesh.-   Creates an IWSDK entity with a Transform component that manages the mesh.

### Positioning, rotating, and scaling objects

You can manipulate objects by setting properties on the Three.js mesh both before and after creating the entity. After creating an entity, you access the mesh through the `entity.object3D` property as shown in this example.

```
<span><span>//&nbsp;BEFORE&nbsp;creating&nbsp;entity&nbsp;-&nbsp;manipulate&nbsp;the&nbsp;mesh&nbsp;di</span><span>rectly</span></span><br><span><span>mesh.position.</span><span>set</span><span>(</span><span>2</span><span>,&nbsp;</span><span>0</span><span>,&nbsp;-</span><span>3</span><span>);&nbsp;</span><span>//&nbsp;2&nbsp;units&nbsp;right,&nbsp;0&nbsp;up,&nbsp;3&nbsp;units&nbsp;away</span></span><br><span><span>mesh.rotation.y&nbsp;=&nbsp;</span><span>Math</span><span>.</span><span>PI</span><span>&nbsp;/&nbsp;</span><span>2</span><span>;&nbsp;</span><span>//&nbsp;90&nbsp;degrees&nbsp;around&nbsp;Y-axis</span></span><br><span><span>mesh.scale.</span><span>set</span><span>(</span><span>2</span><span>,&nbsp;</span><span>2</span><span>,&nbsp;</span><span>2</span><span>);&nbsp;</span><span>//&nbsp;Double&nbsp;size&nbsp;in&nbsp;all&nbsp;dimensions</span></span><br><span><span></span></span><br><span><span>const</span><span>&nbsp;entity&nbsp;=&nbsp;world.createTransformEntity(mesh);</span></span><br><span><span></span></span><br><span><span>//&nbsp;AFTER&nbsp;creating&nbsp;entity&nbsp;-&nbsp;manipulate&nbsp;via&nbsp;entity.o</span><span>bject3D</span></span><br><span><span>entity.object3D.position.x&nbsp;=&nbsp;</span><span>1</span><span>;&nbsp;</span><span>//&nbsp;Move&nbsp;1&nbsp;unit&nbsp;to&nbsp;the&nbsp;right</span></span><br><span><span>entity.object3D.position.y&nbsp;=&nbsp;</span><span>2</span><span>;&nbsp;</span><span>//&nbsp;Move&nbsp;2&nbsp;units&nbsp;up</span></span><br><span><span>entity.object3D.position.z&nbsp;=&nbsp;-</span><span>5</span><span>;&nbsp;</span><span>//&nbsp;Move&nbsp;5&nbsp;units&nbsp;away&nbsp;from&nbsp;viewer</span></span><br><span><span></span></span><br><span><span>//&nbsp;You&nbsp;can&nbsp;also&nbsp;use&nbsp;quaternion&nbsp;for&nbsp;more&nbsp;precise&nbsp;ro</span><span>tation&nbsp;control</span></span><br><span><span>entity.object3D.quaternion.setFromEuler(</span><span>new</span><span>&nbsp;</span><span>Euler</span><span>(</span><span>0</span><span>,&nbsp;</span><span>Math</span><span>.</span><span>PI</span><span>,&nbsp;</span><span>0</span><span>));</span></span><br><span><span></span></span><br><span><span>//&nbsp;Scale&nbsp;individual&nbsp;axes</span></span><br><span><span>entity.object3D.scale.</span><span>set</span><span>(</span><span>1</span><span>,&nbsp;</span><span>0.5</span><span>,&nbsp;</span><span>1</span><span>);&nbsp;</span><span>//&nbsp;Half&nbsp;height,&nbsp;normal&nbsp;width/depth</span></span><br><span><span></span></span><br>
```

**Coordinate System & Rotation**

**Position coordinates:**

-   **X-axis**: Left (-) to Right (+)-   **Y-axis**: Down (-) to Up (+)-   **Z-axis**: Into screen (+) to Out of screen (-)

**Rotation:** Three.js uses radians. To convert degrees to radians: `radians = degrees * (Math.PI / 180)`. Common conversions: 90° = π/2, 180° = π, 270° = 3π/2, 360° = 2π.

## Building your first scene

Let’s add some simple 3D objects to your starter app. You’ll modify your existing `src/index.ts` (or `src/index.js`) file to include new primitive objects.

-   Add the Three.js imports you’ll need at the top of your file.
    
    ```
    <span><span>&nbsp;</span><span>import</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;...&nbsp;existing&nbsp;imports</span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>Mesh</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>BoxGeometry</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>SphereGeometry</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>PlaneGeometry</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>MeshStandardMaterial</span><span>,</span></span><br><span><span>&nbsp;}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'@iwsdk/core'</span><span>;</span></span><br><span><span></span></span><br>
    ```
    -   In the `World.create().then((world) ={` section, add your primitive objects after the existing asset loading code but before the `world.registerSystem()` calls. This ensures your objects are created after the world is properly initialized but before any systems that might need to interact with them start running.
    
    ```
    <span><span>&nbsp;</span><span>World</span><span>.create(</span><span>/*&nbsp;...&nbsp;existing&nbsp;options&nbsp;*/</span><span>).then((world)&nbsp;={</span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;...&nbsp;existing&nbsp;camera&nbsp;setup&nbsp;and&nbsp;asset&nbsp;loading&nbsp;cod</span><span>e</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Add&nbsp;your&nbsp;primitive&nbsp;objects&nbsp;here:</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Create&nbsp;a&nbsp;red&nbsp;cube</span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;cubeGeometry&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>BoxGeometry</span><span>(</span><span>1</span><span>,&nbsp;</span><span>1</span><span>,&nbsp;</span><span>1</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;redMaterial&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>MeshStandardMaterial</span><span>({&nbsp;color:&nbsp;</span><span>0xff3333</span><span>&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;cube&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>Mesh</span><span>(cubeGeometry,&nbsp;redMaterial);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;cube.position.</span><span>set</span><span>(-</span><span>1</span><span>,&nbsp;</span><span>0</span><span>,&nbsp;-</span><span>2</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;cubeEntity&nbsp;=&nbsp;world.createTransformEntity(cube);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Create&nbsp;a&nbsp;green&nbsp;sphere</span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;sphereGeometry&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>SphereGeometry</span><span>(</span><span>0.5</span><span>,&nbsp;</span><span>32</span><span>,&nbsp;</span><span>32</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;greenMaterial&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>MeshStandardMaterial</span><span>({&nbsp;color:&nbsp;</span><span>0x33ff33</span><span>&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;sphere&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>Mesh</span><span>(sphereGeometry,&nbsp;greenMaterial);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;sphere.position.</span><span>set</span><span>(</span><span>1</span><span>,&nbsp;</span><span>0</span><span>,&nbsp;-</span><span>2</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;sphereEntity&nbsp;=&nbsp;world.createTransformEntity(sphere</span><span>);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Create&nbsp;a&nbsp;blue&nbsp;floor&nbsp;plane</span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;floorGeometry&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>PlaneGeometry</span><span>(</span><span>4</span><span>,&nbsp;</span><span>4</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;blueMaterial&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>MeshStandardMaterial</span><span>({&nbsp;color:&nbsp;</span><span>0x3333ff</span><span>&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;floor&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>Mesh</span><span>(floorGeometry,&nbsp;blueMaterial);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;floor.position.</span><span>set</span><span>(</span><span>0</span><span>,&nbsp;-</span><span>1</span><span>,&nbsp;-</span><span>2</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;floor.rotation.x&nbsp;=&nbsp;-</span><span>Math</span><span>.</span><span>PI</span><span>&nbsp;/&nbsp;</span><span>2</span><span>;&nbsp;</span><span>//&nbsp;Rotate&nbsp;to&nbsp;be&nbsp;horizontal</span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;floorEntity&nbsp;=&nbsp;world.createTransformEntity(floor);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;...&nbsp;rest&nbsp;of&nbsp;existing&nbsp;code&nbsp;(systems&nbsp;registration</span><span>,&nbsp;etc.)</span></span><br><span><span>&nbsp;});</span></span><br><span><span></span></span><br>
    ```
    

## Next steps

You should now understand the fundamentals of creating and positioning 3D objects in IWSDK. You’ve learned how Three.js geometry, materials, and meshes work, and how to integrate them into IWSDK’s Entity Component System using transform entities.

Next, you’ll learn how to work with external assets like 3D models and textures, which will allow you to create much more sophisticated and visually appealing scenes.