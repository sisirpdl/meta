Space Warp is a [draft addition to the WebXR Layers spec](https://immersive-web.github.io/layers/#spacewarp) that allows the XR Compositor to do more frame extrapolation and reprojection. The XR Compositor does this by using app-provided motion vector and depth data. As a result of the synthesized frames, the browser can let web apps run at a reduced frame rate while still providing a smooth experience. With a reduced frame rate, web apps have more compute budget to render scenes.

## WebXR Space Warp Requirements

-   Browser version 24.2 or later-   Any framework used must support [XRProjectionLayer](https://www.w3.org/TR/webxrlayers-1/#xrprojectionlayertype) from the [WebXR Layers spec](https://developers.meta.com/horizon/documentation/web/webxr-layers/)-   The app must provide motion vector and depth buffer data for objects in the scene

### WebXR Space Warp Limitations

-   Space Warp doesn’t work with translucent objects in the scene. For more information, see the section on transparency rendering in the [native OpenXR Application SpaceWarp Developer Guide](https://developers.meta.com/horizon/documentation/native/android/mobile-asw/#transparency-rendering). It’s possible to use additional [WebXR Layers](https://developers.meta.com/horizon/documentation/web/webxr-layers/) to handle transparency if it works for your particular use case.-   Controller input latency is higher than normal because of the reduced frame rate.

## Set Up and Use WebXR Space Warp

WebXR Space Warp is an experimental feature based on a [draft spec](https://immersive-web.github.io/layers/#spacewarp) and must be enabled through `chrome://flags` before use on Browser. Follow these steps to enable the feature:

-   Using Browser, enter “chrome://flags” into the address bar.-   Search for “WebXR Space Warp” and change it from **Default** to **Enabled**.-   Relaunch the browser when prompted.

You can run the `proj-spacewarp.html` WebXR draft sample [here](https://dannysu.github.io/webxr-samples/layers-samples/proj-spacewarp.html). Use the controller trigger to toggle Space Warp, the grip squeeze action to toggle delta pose, and the joystick to rotate the view.

You can find the implementation in the [`proj-spacewarp.html` code](https://github.com/dannysu/webxr-samples/blob/main/layers-samples/proj-spacewarp.html). Look for places that mention “SpaceWarp”.

The following are the major considerations to note when implementing WebXR Space Warp:

-   You must enable the `EXT_color_buffer_half_float` extension for GL\_RGBA16F support. The motion vector texture is created in this format.-   When calling `requestSession()`, the app must request the “layers” and “space-warp” features.-   When creating the `XRProjectionLayer`, the “textureType” needs to be “texture-array”. Space Warp is currently only supported when using a texture array.-   You must do a render pass to fill in the motion vector texture and depth buffer. These `WebGLTextures` are provided by `XRWebGLSubImage`. Retrieve them through the “motionVectorTexture” and “depthStencilTexture” properties and attach the textures to the framebuffer.-   The motion vector texture size is smaller than the normal color texture, so adjust the viewport for your renderer accordingly when rendering to the motion vector and depth buffer. See the [XRWebGLSubImage](https://immersive-web.github.io/layers/#xrwebglsubimagetype) section of the spec for properties to obtain the size of the motion vector.

When rendering the motion vector and depth buffer in the sample, the `cube-sea.js` node is updated to have the [vertex shader](https://github.com/dannysu/webxr-samples/blob/main/js/render/nodes/cube-sea.js#L89-L121) and [fragment shader](https://github.com/dannysu/webxr-samples/blob/main/js/render/nodes/cube-sea.js#L140-L156) specific for WebXR Space Warp. The sample also uses multiview and the shaders reflect that. The sample renderer passes the previous projection matrices, view matrices, and model matrix to the shaders as uniforms. These are used by the vertex shader to compute the motion vector. The fragment shader then fills the motion vector values as the pixel values. For your own renderer, determine the motion vector data and render that to the motion vector and depth buffer.

If the player’s pose in the world can change, you also need to calculate the delta pose and set it on the XRProjectionLayer. The [calculation](https://github.com/dannysu/webxr-samples/blob/main/layers-samples/proj-spacewarp.html#L420-L429) is shown in the sample code.

## Test and Debug WebXR Space Warp

There are several options to test and debug WebXR Space Warp.

-   Run `adb logcat -s VrApi` and monitor the output while WebXR Space Warp is enabled. If the FPS is outputting values that are half the frame rate, then the feature is functioning properly.-   To verify whether your motion vector and depth buffer are rendered correctly, you can use RenderDoc Meta Fork to inspect the resulting texture. See documentation on how to [Use RenderDoc with Browser](https://developers.meta.com/horizon/documentation/web/webxr-perf-renderdoc/).
    -   There should be no anti-aliasing applied to the motion vector because it returns values that don’t make sense.-   Background `clearColor` can be left alone because the system uses the depth buffer value to determine whether it’s not the actual motion vector value.-   Read the [Troubleshooting](https://developers.meta.com/horizon/documentation/native/android/mobile-asw/#troubleshooting) section of the native OpenXR Application SpaceWarp documentation for further information.

## See Also

-   [Native OpenXR Application SpaceWarp Developer Guide](https://developers.meta.com/horizon/documentation/native/android/mobile-asw/)-   [Introduction to Meta Quest’s Application SpaceWarp Technology](https://developers.meta.com/horizon/blog/introducing-application-spacewarp/)-   [WebXR `proj-spacewarp.html` Draft Sample Using Space Warp](https://dannysu.github.io/webxr-samples/layers-samples/proj-spacewarp.html)
    -   [Source Code for Draft Sample](https://github.com/dannysu/webxr-samples/blob/main/layers-samples/proj-spacewarp.html)