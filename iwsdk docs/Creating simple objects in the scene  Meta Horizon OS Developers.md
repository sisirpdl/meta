Updated: Sep 20, 2024

Welcome to chapter 1 of our WebXR tutorial! In this chapter, you’ll learn how to create and position simple objects in a 3D scene using Three.js, setting the foundation for more complex interactions.

## `setupScene` function

The `setupScene` function is where you’ll define the objects in your 3D environment. It’s the space where you arrange all the elements that will appear in your scene, leaving frame-by-frame updates for later.

### Meshes, geometries, and materials in Three.js

In Three.js, a **mesh** is the combination of **geometry** (the shape) and **material** (the appearance). Let’s use the floor as an example:

-   **Geometry**: Defines the shape. For the floor, we use `PlaneGeometry` to create a 6x6 unit rectangle:
    
    ```
    <span><span>const</span><span>&nbsp;floorGeometry&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>THREE</span><span>.</span><span>PlaneGeometry</span><span>(</span><span>6</span><span>,&nbsp;</span><span>6</span><span>);</span></span><br><span><span></span></span><br>
    ```
    -   **Material**: Defines how the surface looks. We use `MeshStandardMaterial` with a white color:
    
    ```
    <span><span>const</span><span>&nbsp;floorMaterial&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>THREE</span><span>.</span><span>MeshStandardMaterial</span><span>({color:&nbsp;</span><span>'white'</span><span>});</span></span><br><span><span></span></span><br>
    ```
    -   **Mesh**: Combines the geometry and material:
    
    ```
    <span><span>const</span><span>&nbsp;floor&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>THREE</span><span>.</span><span>Mesh</span><span>(floorGeometry,&nbsp;floorMaterial);</span></span><br><span><span></span></span><br>
    ```
    

Finally, we rotate and add the floor to the scene:

```
<span><span>floor.rotateX(-</span><span>Math</span><span>.</span><span>PI</span><span>&nbsp;/&nbsp;</span><span>2</span><span>);</span></span><br><span><span>scene.add(floor);</span></span><br><span><span></span></span><br>
```

## Task

Now, let’s add a cone, a cube, and a sphere to your `sceneSetup`, each with its own geometry, material, and transformations.

### Adding a cone

```
<span><span>const</span><span>&nbsp;coneGeometry&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>THREE</span><span>.</span><span>ConeGeometry</span><span>(</span><span>0.6</span><span>,&nbsp;</span><span>1.5</span><span>);</span></span><br><span><span>const</span><span>&nbsp;coneMaterial&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>THREE</span><span>.</span><span>MeshStandardMaterial</span><span>({color:&nbsp;</span><span>'purple'</span><span>});</span></span><br><span><span>const</span><span>&nbsp;cone&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>THREE</span><span>.</span><span>Mesh</span><span>(coneGeometry,&nbsp;coneMaterial);</span></span><br><span><span>scene.add(cone);</span></span><br><span><span>cone.position.</span><span>set</span><span>(</span><span>0.4</span><span>,&nbsp;</span><span>0.75</span><span>,&nbsp;-</span><span>1.5</span><span>);</span></span><br><span><span></span></span><br>
```

-   **Geometry**: `ConeGeometry(0.6, 1.5)` creates a cone with a base radius of 0.6 units and a height of 1.5 units.-   **Material**: `MeshStandardMaterial` gives the cone a purple color and realistic lighting.-   **Positioning**: The cone is positioned at `(0.4, 0.75, -1.5)`.

### Adding a cube

```
<span><span>const</span><span>&nbsp;cubeGeometry&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>THREE</span><span>.</span><span>BoxGeometry</span><span>(</span><span>1</span><span>,&nbsp;</span><span>1</span><span>,&nbsp;</span><span>1</span><span>);</span></span><br><span><span>const</span><span>&nbsp;cubeMaterial&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>THREE</span><span>.</span><span>MeshStandardMaterial</span><span>({color:&nbsp;</span><span>'orange'</span><span>});</span></span><br><span><span>const</span><span>&nbsp;cube&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>THREE</span><span>.</span><span>Mesh</span><span>(cubeGeometry,&nbsp;cubeMaterial);</span></span><br><span><span>scene.add(cube);</span></span><br><span><span>cube.position.</span><span>set</span><span>(-</span><span>0.8</span><span>,&nbsp;</span><span>0.5</span><span>,&nbsp;-</span><span>1.5</span><span>);</span></span><br><span><span>cube.rotateY(</span><span>Math</span><span>.</span><span>PI</span><span>&nbsp;/&nbsp;</span><span>4</span><span>);</span></span><br><span><span></span></span><br>
```

-   **Geometry**: `BoxGeometry(1, 1, 1)` creates a 1x1x1 cube.-   **Rotation**: The cube is rotated 45 degrees around the Y-axis using `rotateY(Math.PI / 4)`.

### Adding a sphere

```
<span><span>const</span><span>&nbsp;sphereGeometry&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>THREE</span><span>.</span><span>SphereGeometry</span><span>(</span><span>0.4</span><span>);</span></span><br><span><span>const</span><span>&nbsp;sphereMaterial&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>THREE</span><span>.</span><span>MeshStandardMaterial</span><span>({color:&nbsp;</span><span>'red'</span><span>});</span></span><br><span><span>const</span><span>&nbsp;sphere&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>THREE</span><span>.</span><span>Mesh</span><span>(sphereGeometry,&nbsp;sphereMaterial);</span></span><br><span><span>scene.add(sphere);</span></span><br><span><span>sphere.position.</span><span>set</span><span>(</span><span>0.6</span><span>,&nbsp;</span><span>0.4</span><span>,&nbsp;-</span><span>0.5</span><span>);</span></span><br><span><span>sphere.scale.</span><span>set</span><span>(</span><span>1.2</span><span>,&nbsp;</span><span>1.2</span><span>,&nbsp;</span><span>1.2</span><span>);</span></span><br><span><span></span></span><br>
```

-   **Geometry**: `SphereGeometry(0.4)` creates a sphere with a 0.4-unit radius.-   **Scaling**: The sphere is scaled up by 20% using `scale.set(1.2, 1.2, 1.2)`.

## Summary

In this chapter, you’ve learned how to combine geometry and material to form meshes and how to apply transformations such as positioning, rotation, and scaling to manipulate objects in 3D space. This foundational knowledge will be crucial as we move on to more advanced topics in the following chapters.

Here’s what our scene looks like now:

![Scene with basic objects](https://scontent.frca1-1.fna.fbcdn.net/v/t39.2365-6/460525503_1845676369290348_8535278447846584160_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=d4L3FpBJgUkQ7kNvwHINT2y&_nc_oc=AdmBBcxBtQZKUr5UiwLeOuEmWq3SdULPsqVNSNxEEmHl-u73nXgN17nu1VFmqpyLiEA&_nc_zt=14&_nc_ht=scontent.frca1-1.fna&_nc_gid=4SroUYB3vE70kApNDg5bPg&oh=00_AfjyUPRbIi8eNv6yKbQaO0Vin6W44bAHUWDDk0eiiAEL8w&oe=6943F8F2)