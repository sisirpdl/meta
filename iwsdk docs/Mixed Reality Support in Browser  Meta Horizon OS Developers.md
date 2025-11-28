As announced at Meta Connect 2022, Browser has added support for WebXR mixed reality services on Meta Quest 2 and Meta Quest Pro headsets.

The following WebXR specifications are now supported in Browser:

-   [WebXR Augmented Reality Module (Passthrough)](https://immersive-web.github.io/webxr-ar-module/)-   [WebXR Plane Detection Module](https://immersive-web.github.io/real-world-geometry/plane-detection.html)-   [WebXR Anchors Module](https://immersive-web.github.io/anchors/)

## Passthrough Mode

Passthrough provides a real-time and perceptually comfortable 3D visualization of the physical world in the Meta Quest headsets. Previously, there was no way to show the real world to the user using WebXR.

Passthrough is in color on the Meta Quest Pro and grayscale on Meta Quest 2.

To use passthrough, use the new [`"immersive-ar"`](https://immersive-web.github.io/webxr-ar-module/#xrsessionmode-enum) mode when you request the WebXR session:

```
<span>navigator</span><span>.</span><span>xr</span><span>.</span><span>requestSession</span><span>(</span><span>"immersive-ar"</span><span>).</span><span>then</span><span>((</span><span>session</span><span>)</span><span> </span><span>=&gt;</span><span> </span><span>{</span><span>
  xrSession </span><span>=</span><span> session</span><span>;</span><span>
</span><span>});</span>
```

You can detect if passthrough is supported in the browser as shown here:

```
<span>navigator</span><span>.</span><span>xr</span><span>.</span><span>isSessionSupported</span><span>(</span><span>'immersive-ar'</span><span>).</span><span>then</span><span>((</span><span>supported</span><span>)</span><span> </span><span>=&gt;</span><span> </span><span>{</span><span>
  </span><span>if</span><span> </span><span>(!</span><span>supported</span><span>)</span><span> </span><span>{</span><span> </span><span>return</span><span>;</span><span> </span><span>}</span><span>
  </span><span>// 'immersive-ar' sessions are supported.</span><span>
  </span><span>// Page should advertise AR support to the user.</span><span>
</span><span>}</span>
```

You must draw your content on a transparent background, otherwise the passthrough environment won’t be visible. For example, do not clear with an opaque color.

There is no way to get to the pixels of the passthrough content, but it is possible to interact with it using transparent pixels.

You can experience a basic passthrough example [here](https://immersive-web.github.io/webxr-samples/immersive-ar-session.html).

Here is a video example of passthrough:

## Plane Detection

In addition to defining your working space in boundary, you can also go to **Settings** > **Boundary** > **Mixed Reality** to define room settings, such as your desk, couches, and so on.

These objects are then exposed by the browser as planes that are flat shapes with a world position.

To enable this feature, you must pass the [`"plane-detection"`](https://immersive-web.github.io/real-world-geometry/plane-detection.html#anchor-feature-descriptor) feature descriptor when requesting the session:

```
<span>
</span><span>const</span><span> session </span><span>=</span><span> </span><span>await</span><span> navigator</span><span>.</span><span>xr</span><span>.</span><span>requestSession</span><span>(</span><span>"immersive-ar"</span><span>,</span><span> </span><span>{</span><span>
  requiredFeatures</span><span>:</span><span> </span><span>[</span><span>"plane-detection"</span><span>]</span><span>
</span><span>});</span>
```

The browser then requests access to space setup information from the user and, if granted, presents it to the session.

When this feature is enabled, the XRSession will contain a new array [`“detectedPlanes”`](https://immersive-web.github.io/real-world-geometry/plane-detection.html#dom-xrframe-detectedplanes) containing [`XRPlanes`](https://immersive-web.github.io/real-world-geometry/plane-detection.html#plane). Each `XRPlane` contains a world position and a polygon. For now, these polygons are always horizontal or vertical rectangles on Meta Quest headsets. You can use these polygons to do hit testing, interaction with VR objects, occlusion, and so on.

Because few people run guardian’s space setup, a new helper function called `“initiateRoomCapture”` has been added on the XRSession. This helper function will trigger guardian’s space setup from an immersive session. It is recommended that you call this function when you are sure that there are no planes in the `“detectedPlanes”` array. This `“detectedPlanes”` array is not populated immediately, so wait 2 to 3 seconds after session creation before making that decision. This function can only be called once per session.

You can experience a basic plane detection example [here](https://cabanier.github.io/webxr-samples-1/proposals/plane-detection.html).

Here is a video example of plane detection:

## Persistent Anchors

Anchors allow you to define locations in the real world. Once defined, an anchor remains in the same space, regardless of where the device’s origin is. This allows you to place virtual objects in the real world or set a common origin for a scene.

Meta Quest headsets also support _persistent_ anchors. These allow you to save and restore these positions across immersive sessions.

Non-persistent anchors are created by calling [`“createAnchor”`](https://immersive-web.github.io/anchors/#anchor-creation) with a position and an `XRSpace`. This returns an object that has an API to get its world position. This position will always be the same in the real world, even if the headset’s origin is reset, such as by holding down the ![Meta Quest button](https://scontent.frca1-1.fna.fbcdn.net/v/t39.2365-6/422620308_1430619587868549_2938149980961746918_n.png?_nc_cat=108&ccb=1-7&_nc_sid=e280be&_nc_ohc=RFsJbBa5ASUQ7kNvwG95xQX&_nc_oc=Adljq7Um8TuFWZmn_Dh4e8aVhdCmyfeKmdtYs1QGPdiIGnOx_iM5ISXs7qYPLVqcg1Q&_nc_zt=14&_nc_ht=scontent.frca1-1.fna&_nc_gid=o4Wj8-jaKWcPasDCfloo4g&oh=00_AfglKovPZoQMgApemeAGyEml_mMfYZOgUXhGjLarVtwF2w&oe=6943FB5C) button on the controller.

To create a persistent anchor, call [`“requestPersistentHandle”`](https://immersive-web.github.io/anchors/#dom-xranchor-requestpersistenthandle) on an anchor object. The resulting string can be stored by the site. To restore an anchor, such as when the site is reloaded, the site can call [`“restorePersistentAnchor”`](https://immersive-web.github.io/anchors/#dom-xrsession-restorepersistentanchor) which returns an anchor object at the same position.

A site can currently only create 8 persistent anchors at a time. Anchors are also not persistent if your session is running in private mode. This means that if you save an anchor in private mode and close and reopen private mode, the persistent anchor can no longer be restored. Clearing the site’s history will also delete the persistent anchors.

You can experience a basic persistent anchors example [here](https://cabanier.github.io/webxr-samples-1/anchors.html).

Here is a video example of persistent anchors: