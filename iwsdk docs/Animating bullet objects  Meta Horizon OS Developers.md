Updated: Sep 20, 2024

In this chapter, we’ll focus on animating the bullets that we spawned in the previous chapter. Specifically, we’ll make the bullets move forward in the direction the controller is pointing and disappear after a short duration. This involves managing the bullets’ movement, ensuring they don’t remain in the scene indefinitely, and updating their positions each frame.

## Constants for bullet behavior

We begin by defining constants that will control the behavior of the bullets:

```
<span><span>const</span><span>&nbsp;forwardVector&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>THREE</span><span>.</span><span>Vector3</span><span>(</span><span>0</span><span>,&nbsp;</span><span>0</span><span>,&nbsp;-</span><span>1</span><span>);</span></span><br><span><span>const</span><span>&nbsp;bulletSpeed&nbsp;=&nbsp;</span><span>5</span><span>;</span></span><br><span><span>const</span><span>&nbsp;bulletTimeToLive&nbsp;=&nbsp;</span><span>1</span><span>;</span></span><br><span><span></span></span><br>
```

-   **`forwardVector`**: This vector points forward along the negative Z-axis. It represents the default direction in which bullets will move.-   **`bulletSpeed`**: Sets the speed of the bullets, meaning they will travel 5 units per second.-   **`bulletTimeToLive`**: Determines how long each bullet will remain active in the scene (1 second). This ensures bullets that are no longer visible are removed to prevent performance degradation over time.

## Managing active bullets

We use an object to keep track of all active bullets:

-   **`bullets`**: This object stores all active bullets using their unique IDs (`uuid`). This allows us to manage and update each bullet individually during every frame.

## Setting up bullet velocity and lifespan

In our `onFrame` function, when a bullet is fired, we calculate its movement direction and assign it a time-to-live (TTL):

```
<span><span>if</span><span>&nbsp;(controllers.right)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>const</span><span>&nbsp;{gamepad,&nbsp;raySpace}&nbsp;=&nbsp;controllers.right;</span></span><br><span><span>&nbsp;&nbsp;</span><span>if</span><span>&nbsp;(gamepad.getButtonClick(</span><span>XR_BUTTONS</span><span>.</span><span>TRIGGER</span><span>))&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;bullet&nbsp;=&nbsp;bulletPrototype.clone();</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;scene.add(bullet);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;raySpace.getWorldPosition(bullet.position);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;raySpace.getWorldQuaternion(bullet.quaternion)</span><span>;</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;directionVector&nbsp;=&nbsp;forwardVector</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.clone()</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.applyQuaternion(bullet.quaternion);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;bullet.userData&nbsp;=&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;velocity:&nbsp;directionVector.multiplyScalar(bul</span><span>letSpeed),</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;timeToLive:&nbsp;bulletTimeToLive,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;};</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;bullets[bullet.uuid]&nbsp;=&nbsp;bullet;</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

### Explanation:

-   **`globalQuaternion`**: This represents the controller’s orientation in world space. By getting the world quaternion of the controller’s ray space, we capture how the controller is rotated in 3D space.
    -   **`directionVector`**: To determine the direction in which the bullet will move, we take the `forwardVector` and apply the `globalQuaternion` to it. This rotates the forward vector to match the orientation of the controller. This step is crucial because it ensures that bullets are fired in the direction the controller is pointing, regardless of its rotation.
    -   **`userData`**: Three.js provides a built-in `userData` property on all `Object3D` instances, which we can use to store custom information about our objects. Here, we store the bullet’s velocity (its movement direction and speed) and its TTL. This data will be used to update the bullet’s position and ensure it’s removed after its lifespan ends.
    

## Updating bullet positions and lifespan

Each frame, we update the bullets’ positions and reduce their TTL:

```
<span><span>Object</span><span>.values(bullets).forEach(bullet&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>if</span><span>&nbsp;(bullet.userData.timeToLive&nbsp;&lt;&nbsp;</span><span>0</span><span>)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>delete</span><span>&nbsp;bullets[bullet.uuid];</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;scene.remove(bullet);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>return</span><span>;</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>&nbsp;&nbsp;</span><span>const</span><span>&nbsp;deltaVec&nbsp;=&nbsp;bullet.userData.velocity.clone().multi</span><span>plyScalar(delta);</span></span><br><span><span>&nbsp;&nbsp;bullet.position.add(deltaVec);</span></span><br><span><span>&nbsp;&nbsp;bullet.userData.timeToLive&nbsp;-=&nbsp;delta;</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

### Explanation:

-   **Lifespan check**: Each bullet’s TTL decreases over time. Once the TTL drops below zero, the bullet is removed from both the scene and the `bullets` object to free up resources and maintain performance.
    -   **Position update**: The bullet’s position is updated by moving it along its velocity vector, scaled by `delta` (the time since the last frame). This makes the bullet move forward at the correct speed each frame.
    

## Summary

In this chapter, you’ve enhanced your WebXR scene by animating the bullets. Now, when fired, the bullets travel in the direction the controller is pointing and disappear after a set time. This addition introduces dynamic motion into your scene and helps maintain performance by cleaning up bullets after they’re no longer needed.

Here’s what our scene looks like with the bullet animation feature:

![Scene with bullet animation](https://scontent.frca1-1.fna.fbcdn.net/v/t39.2365-6/460468887_1845676349290350_1510704509617502824_n.png?_nc_cat=109&ccb=1-7&_nc_sid=e280be&_nc_ohc=VtCdM7hBGL0Q7kNvwF2j68S&_nc_oc=Adl12sYkxw83r6jkvNUqWn00YvGO8wrkp3ZsRAXzNH8pbZwgC5b4NqJR12dOUiFFAs0&_nc_zt=14&_nc_ht=scontent.frca1-1.fna&_nc_gid=LqXlUN6Of65_mRbsDA3v9Q&oh=00_AfhyBgfkwzA_8TvesJzai3OaYPMzbGpvWnjSieezWhsUQw&oe=6943DAF2)