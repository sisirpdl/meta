Now that your scene looks professional with environment and lighting, you’ll make it interactive. This tutorial shows you how to enable grabbing and locomotion, the two most common interactions in VR.

## How input works in IWSDK

IWSDK provides a comprehensive input system that handles controllers, hands, and various interaction patterns automatically. The input stack includes:

-   Visual representation: Controllers and hands appear automatically.-   Pointer events: Cross-modal interactions that work with controllers and hand tracking.-   Gamepad state: Access to buttons, triggers, and thumbsticks.-   Built-in systems: Grab and locomotion work out of the box.

### Interaction patterns

Different interactions use different input approaches. Grabbing is built using pointer events, which makes it universal, working seamlessly with both controllers and hand tracking. Locomotion uses gamepad input because movement requires more advanced and precise controls like analog thumbsticks for smooth navigation.

To learn more about IWSDK’s input architecture, see [XR Input Concepts](https://developers.meta.com/horizon/documentation/web/iwsdk-concept-xr-input/).

## Enabling built-in systems

Grab and locomotion are built-in systems that you enable via the `features` flag in `World.create()`.

## Enabling grab and locomotion

First, update your `World.create()` call to enable these features:

```
<span><span>//&nbsp;Update&nbsp;your&nbsp;existing&nbsp;World.create()&nbsp;call&nbsp;in&nbsp;src</span><span>/index.ts</span></span><br><span><span>World</span><span>.create(document.getElementById(</span><span>'scene-container'</span><span>),&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;assets,</span></span><br><span><span>&nbsp;&nbsp;xr:&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;sessionMode:&nbsp;</span><span>SessionMode</span><span>.</span><span>ImmersiveVR</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;features:&nbsp;{&nbsp;handTracking:&nbsp;</span><span>true</span><span>&nbsp;},</span></span><br><span><span>&nbsp;&nbsp;},</span></span><br><span><span>&nbsp;&nbsp;features:&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;grabbing:&nbsp;</span><span>true</span><span>,&nbsp;</span><span>//&nbsp;Enable&nbsp;grab&nbsp;system</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;locomotion:&nbsp;</span><span>true</span><span>,&nbsp;</span><span>//&nbsp;Enable&nbsp;locomotion&nbsp;system</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;...&nbsp;other&nbsp;existing&nbsp;features</span></span><br><span><span>&nbsp;&nbsp;},</span></span><br><span><span>}).then((world)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;...&nbsp;your&nbsp;existing&nbsp;setup</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

IWSDK automatically sets up ray pointers, grab pointers, and locomotion controls. Controllers and hands will appear automatically, and the input systems start working immediately.

## Making objects grabbable

With grabbing enabled, you can add grab components to any object. IWSDK provides several grab components including `TwoHandGrabbable` for complex manipulation, but here are the two most commonly used types.

### OneHandGrabbable

For objects you grab and move directly with one hand:

```
<span><span>//&nbsp;Make&nbsp;your&nbsp;existing&nbsp;robot&nbsp;grabbable</span></span><br><span><span>const</span><span>&nbsp;{&nbsp;scene:&nbsp;robotMesh&nbsp;}&nbsp;=&nbsp;</span><span>AssetManager</span><span>.getGLTF(</span><span>'robot'</span><span>);</span></span><br><span><span>robotMesh.position.</span><span>set</span><span>(-</span><span>1.2</span><span>,&nbsp;</span><span>0.95</span><span>,&nbsp;-</span><span>1.8</span><span>);</span></span><br><span><span>robotMesh.scale.setScalar(</span><span>0.5</span><span>);</span></span><br><span><span></span></span><br><span><span>world</span></span><br><span><span>&nbsp;&nbsp;.createTransformEntity(robotMesh)</span></span><br><span><span>&nbsp;&nbsp;.addComponent(</span><span>Interactable</span><span>)&nbsp;</span><span>//&nbsp;Makes&nbsp;it&nbsp;interactive</span></span><br><span><span>&nbsp;&nbsp;.addComponent(</span><span>OneHandGrabbable</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Makes&nbsp;it&nbsp;grabbable&nbsp;with&nbsp;one&nbsp;hand</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;translate:&nbsp;</span><span>true</span><span>,&nbsp;</span><span>//&nbsp;Can&nbsp;move&nbsp;it&nbsp;around</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;rotate:&nbsp;</span><span>true</span><span>,&nbsp;</span><span>//&nbsp;Can&nbsp;rotate&nbsp;it</span></span><br><span><span>&nbsp;&nbsp;});</span></span><br><span><span></span></span><br>
```

### DistanceGrabbable

For objects you can grab, scale, and manipulate from far away:

```
<span><span>//&nbsp;Make&nbsp;the&nbsp;plant&nbsp;grabbable&nbsp;at&nbsp;a&nbsp;distance</span></span><br><span><span>const</span><span>&nbsp;{&nbsp;scene:&nbsp;plantMesh&nbsp;}&nbsp;=&nbsp;</span><span>AssetManager</span><span>.getGLTF(</span><span>'plantSansevieria'</span><span>);</span></span><br><span><span>plantMesh.position.</span><span>set</span><span>(</span><span>1.2</span><span>,&nbsp;</span><span>0.85</span><span>,&nbsp;-</span><span>1.8</span><span>);</span></span><br><span><span></span></span><br><span><span>world</span></span><br><span><span>&nbsp;&nbsp;.createTransformEntity(plantMesh)</span></span><br><span><span>&nbsp;&nbsp;.addComponent(</span><span>Interactable</span><span>)</span></span><br><span><span>&nbsp;&nbsp;.addComponent(</span><span>DistanceGrabbable</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;translate:&nbsp;</span><span>true</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;rotate:&nbsp;</span><span>true</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;scale:&nbsp;</span><span>true</span><span>,&nbsp;</span><span>//&nbsp;Can&nbsp;also&nbsp;resize&nbsp;it</span></span><br><span><span>&nbsp;&nbsp;});</span></span><br><span><span></span></span><br>
```

## Setting up locomotion

With locomotion enabled, you need to tell IWSDK which surfaces can be walked on by adding the `LocomotionEnvironment` component.

```
<span><span>//&nbsp;Make&nbsp;your&nbsp;desk&nbsp;environment&nbsp;walkable</span></span><br><span><span>const</span><span>&nbsp;{&nbsp;scene:&nbsp;envMesh&nbsp;}&nbsp;=&nbsp;</span><span>AssetManager</span><span>.getGLTF(</span><span>'environmentDesk'</span><span>);</span></span><br><span><span>envMesh.rotateY(</span><span>Math</span><span>.</span><span>PI</span><span>);</span></span><br><span><span>envMesh.position.</span><span>set</span><span>(</span><span>0</span><span>,&nbsp;-</span><span>0.1</span><span>,&nbsp;</span><span>0</span><span>);</span></span><br><span><span></span></span><br><span><span>world.createTransformEntity(envMesh).addComponent(</span><span>LocomotionEnvironment</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;type:&nbsp;</span><span>EnvironmentType</span><span>.</span><span>STATIC</span><span>,&nbsp;</span><span>//&nbsp;Static&nbsp;environment&nbsp;for&nbsp;collision</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

### How locomotion works

Once enabled, locomotion works automatically with standard VR controls:

-   Left thumbstick: Walk forward/backward, strafe left/right.-   Right thumbstick: Snap turn (comfortable) or smooth turn.-   Teleportation: Point and click to teleport (if enabled).

The locomotion system handles collision detection, ground snapping, and comfortable movement speeds automatically.

For detailed locomotion configuration and movement types, see [Locomotion Concepts](https://developers.meta.com/horizon/documentation/web/iwsdk-concept-locomotion/).

## Complete interactive setup

Here’s how to add both grab and locomotion to your existing starter app:

```
<span><span>//&nbsp;Update&nbsp;your&nbsp;src/index.ts&nbsp;with&nbsp;these&nbsp;additions:</span></span><br><span><span></span></span><br><span><span>import</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>AssetManager</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>AssetManifest</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>AssetType</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>EnvironmentType</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>Interactable</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>LocomotionEnvironment</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>OneHandGrabbable</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>DistanceGrabbable</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>SessionMode</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>World</span><span>,</span></span><br><span><span>}&nbsp;</span><span>from</span><span>&nbsp;</span><span>"@iwsdk/core"</span><span>;</span></span><br><span><span></span></span><br><span><span>//&nbsp;...&nbsp;existing&nbsp;assets&nbsp;and&nbsp;World.create&nbsp;setup&nbsp;with</span><span>&nbsp;features&nbsp;enabled&nbsp;...</span></span><br><span><span></span></span><br><span><span>World</span><span>.create(</span><span>/*&nbsp;...&nbsp;*/</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;features:&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;grabbing:&nbsp;</span><span>true</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;locomotion:&nbsp;</span><span>true</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;...&nbsp;other&nbsp;features</span></span><br><span><span>&nbsp;&nbsp;},</span></span><br><span><span>}).then((world)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;...&nbsp;existing&nbsp;camera&nbsp;and&nbsp;environment&nbsp;setup&nbsp;...</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Make&nbsp;environment&nbsp;walkable</span></span><br><span><span>&nbsp;&nbsp;</span><span>const</span><span>&nbsp;{&nbsp;scene:&nbsp;envMesh&nbsp;}&nbsp;=&nbsp;</span><span>AssetManager</span><span>.getGLTF(</span><span>"environmentDesk"</span><span>);</span></span><br><span><span>&nbsp;&nbsp;envMesh.rotateY(</span><span>Math</span><span>.</span><span>PI</span><span>);</span></span><br><span><span>&nbsp;&nbsp;envMesh.position.</span><span>set</span><span>(</span><span>0</span><span>,&nbsp;-</span><span>0.1</span><span>,&nbsp;</span><span>0</span><span>);</span></span><br><span><span>&nbsp;&nbsp;world</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;.createTransformEntity(envMesh)</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;.addComponent(</span><span>LocomotionEnvironment</span><span>,&nbsp;{&nbsp;type:&nbsp;</span><span>EnvironmentType</span><span>.</span><span>STATIC</span><span>&nbsp;});</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Make&nbsp;plant&nbsp;grabbable&nbsp;at&nbsp;distance</span></span><br><span><span>&nbsp;&nbsp;</span><span>const</span><span>&nbsp;{&nbsp;scene:&nbsp;plantMesh&nbsp;}&nbsp;=&nbsp;</span><span>AssetManager</span><span>.getGLTF(</span><span>"plantSansevieria"</span><span>);</span></span><br><span><span>&nbsp;&nbsp;plantMesh.position.</span><span>set</span><span>(</span><span>1.2</span><span>,&nbsp;</span><span>0.85</span><span>,&nbsp;-</span><span>1.8</span><span>);</span></span><br><span><span>&nbsp;&nbsp;world</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;.createTransformEntity(plantMesh)</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;.addComponent(</span><span>Interactable</span><span>)</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;.addComponent(</span><span>DistanceGrabbable</span><span>);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Make&nbsp;robot&nbsp;grabbable&nbsp;with&nbsp;one&nbsp;hand</span></span><br><span><span>&nbsp;&nbsp;</span><span>const</span><span>&nbsp;{&nbsp;scene:&nbsp;robotMesh&nbsp;}&nbsp;=&nbsp;</span><span>AssetManager</span><span>.getGLTF(</span><span>"robot"</span><span>);</span></span><br><span><span>&nbsp;&nbsp;robotMesh.position.</span><span>set</span><span>(-</span><span>1.2</span><span>,&nbsp;</span><span>0.95</span><span>,&nbsp;-</span><span>1.8</span><span>);</span></span><br><span><span>&nbsp;&nbsp;robotMesh.scale.setScalar(</span><span>0.5</span><span>);</span></span><br><span><span>&nbsp;&nbsp;world</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;.createTransformEntity(robotMesh)</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;.addComponent(</span><span>Interactable</span><span>)</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;.addComponent(</span><span>OneHandGrabbable</span><span>);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;...&nbsp;rest&nbsp;of&nbsp;your&nbsp;existing&nbsp;setup</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

## Next steps

Your VR scene is now fully interactive. Users can grab objects, move them around, and walk through your environment. In the next tutorial, you’ll learn how to create your own custom systems and components to add unique behaviors to your WebXR experience.

You’ll learn how to:

-   Create custom components to store data.-   Write systems that react to entities with specific components-   Implement custom game logic and behaviors.-   Use queries to find entities efficiently.