Updated: Sep 20, 2024

In chapter 2, we’ll explore how to interact with a WebXR scene using VR controllers. By the end of this chapter, you’ll be able to respond to controller inputs and trigger actions within your scene. Specifically, we’ll focus on detecting button presses and using them to spawn a “bullet” from the controller into the scene. In the next chapter, we’ll focus on moving these bullets, but for now, let’s focus on spawning them.

## `onFrame` function

The `onFrame` function is where we handle updates for every frame. It receives two key arguments in addition to the global variables in `setupScene`:

-   **`delta`**: The time since the last frame in seconds. This is useful for making time-based animations or movements.-   **`time`**: The total elapsed time since the app started. This can be used for tracking overall progress or creating time-based effects.

You’ll use `onFrame` to check for controller input and trigger actions based on those inputs.

## Introducing the bullet

To start, we’ll introduce a bullet—a small gray sphere that will be fired from the controller when the trigger button is pressed. We will set it up as a global variable so that we can access it later in our frame loop and event handlers:

```
<span><span>const</span><span>&nbsp;bulletGeometry&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>THREE</span><span>.</span><span>SphereGeometry</span><span>(</span><span>0.02</span><span>);</span></span><br><span><span>const</span><span>&nbsp;bulletMaterial&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>THREE</span><span>.</span><span>MeshStandardMaterial</span><span>({color:&nbsp;</span><span>'gray'</span><span>});</span></span><br><span><span>const</span><span>&nbsp;bulletPrototype&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>THREE</span><span>.</span><span>Mesh</span><span>(bulletGeometry,&nbsp;bulletMaterial);</span></span><br><span><span></span></span><br>
```

### Explanation:

-   **Bullet geometry and material**: The bullet is a small sphere with a radius of `0.02`, using a gray `MeshStandardMaterial`. This gives the bullet its shape and appearance.
    -   **Cloning the bullet**: The `bulletPrototype` is a mesh that we’ll clone each time we want to spawn a new bullet. Cloning is an efficient way to create multiple instances of an object. The cloned objects share the same geometry and material, which saves memory and ensures consistent appearance across all bullets.
    

## Handling controller input

Now, let’s handle the controller input within the `onFrame` function to spawn bullets when the trigger is pressed:

```
<span><span>import</span><span>&nbsp;{</span><span>XR_BUTTONS</span><span>}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'gamepad-wrapper'</span><span>;</span></span><br><span><span></span></span><br><span><span>function</span><span>&nbsp;onFrame(delta,&nbsp;time,&nbsp;{scene,&nbsp;camera,&nbsp;renderer,&nbsp;pl</span><span>ayer,&nbsp;controllers})&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>if</span><span>&nbsp;(controllers.right)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;{gamepad,&nbsp;raySpace}&nbsp;=&nbsp;controllers.right;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>if</span><span>&nbsp;(gamepad.getButtonClick(</span><span>XR_BUTTONS</span><span>.</span><span>TRIGGER</span><span>))&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;bullet&nbsp;=&nbsp;bulletPrototype.clone();</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;scene.add(bullet);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;raySpace.getWorldPosition(bullet.position);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;raySpace.getWorldQuaternion(bullet.quaternio</span><span>n);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;}</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

### Explanation:

-   **Controller detection**: The `if (controllers.right)` check ensures that a right-hand controller is connected and active.
    -   **Button press handling**: We use `gamepad.getButtonClick(XR_BUTTONS.TRIGGER)` to detect when the trigger button is pressed during the current frame on the right controller. This functionality is provided by the `gamepad-wrapper` library, which tracks the state of gamepad buttons frame by frame. This ensures that you can reliably detect events such as single button presses. For more information, you can refer to the gamepad-wrapper [documentation](https://github.com/felixtrz/gamepad-wrapper).
    -   **Spawning the bullet**: When the trigger is pressed, we clone the `bulletPrototype` to create a new bullet and add it to the scene with `scene.add(bullet)`.
    -   **Controller ray space**: The `raySpace` represents the XR controller’s ray-casting direction and position in 3D space. It is a special object managed by Three.js that represents where the user is pointing. In VR, ray spaces are often used to interact with objects in the world by projecting a laser-like ray from the controller. In this case, we use the `raySpace` to determine the origin and direction for spawning bullets, ensuring that they are fired from the controller’s tip and in the right direction.
    -   **Bullet positioning**: The `raySpace.getWorldPosition(bullet.position)` method sets the bullet’s position to the world position of the controller’s ray space. This is necessary because the controller ray space and the bullet do not share the same parent in the scene graph. The bullet’s parent is the `scene`, meaning its position is interpreted as its world position. Therefore, to correctly position the bullet at the controller’s tip, we retrieve the ray space’s world position and apply it directly to the bullet.
    -   **Bullet orientation**: In addition to positioning, we need to correctly orient the bullet. The method `raySpace.getWorldQuaternion(bullet.quaternion)` retrieves the world quaternion (i.e., orientation) of the controller’s ray space and applies it to the bullet. This ensures the bullet is aligned with the controller’s orientation when fired. Without this step, the bullet might spawn in the correct location but at the wrong angle, leading to unintended behavior later when we animate it.
    

## Summary

In this chapter, you’ve learned how to interact with your WebXR scene using a VR controller. We introduced the concept of detecting controller input and used it to spawn bullets into the scene when the trigger button is pressed. This sets the stage for more complex interactions, like moving these bullets, which we’ll cover in the next chapter.

Here’s what our scene looks like after adding the bullet spawning feature:

![Scene with bullet](https://scontent.frca1-1.fna.fbcdn.net/v/t39.2365-6/459997579_1845676332623685_4160867582347085770_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=_-zUO2F6zi4Q7kNvwFqVnS3&_nc_oc=AdlOTZKkBGi4GIfvLqba5A3q1_PMHezPRDmA1RHxJRd5mNGahLHLGYTYhA5JreDo0yg&_nc_zt=14&_nc_ht=scontent.frca1-1.fna&_nc_gid=pWMXZepkhB1Gkw_T7iZrpA&oh=00_AfgKaRhQjXdxN5T6jbBJFvsZjY9djoTtiKso1Us2XMPzuA&oe=6944056C)