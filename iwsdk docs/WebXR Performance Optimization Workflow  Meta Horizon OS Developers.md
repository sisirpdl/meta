Building high-performance WebXR applications for Meta Quest require performance analysis and optimization throughout the development process.

Developing WebXR apps pushes the limits of what the hardware can do, and there are many ways to unintentionally make things slow. Armed with some knowledge and attention to detail, it’s possible to build fast, beautiful, and engaging WebXR experiences.

This topic describes a performance optimization workflow that is useful to all developers.

## How To Measure Smooth Performance

In any interactive VR experience, every frame must complete its CPU and GPU work in a set amount of time, usually measured in milliseconds, to hit a certain frame rate.

-   60 FPS = 16.6 milliseconds per frame-   72 FPS = 13.7 milliseconds per frame-   90 FPS = 11.1 milliseconds per frame

Browser defaults to a refresh rate of 72 FPS on Meta Quest and 90 FPS on Meta Quest 2. The following sections show you how profiling can help you achieve the performance targets necessary to achieve those frame rates by identifying areas for optimization.

If you don’t already have an in-headset frame-time display, the [OVR Metrics Tool](https://developers.meta.com/horizon/documentation/native/android/ts-ovrmetricstool/) provides a Performance HUD that is a good option. You can install it directly from the MQDH app, or you can download it and sideload onto your headset. OVR Metrics Tool can also be installed through \[Meta Quest Developer Hub\](/documentation/native/android/tsts-mqdh. See the MQDH [Performance and Metrics](https://developers.meta.com/horizon/documentation/native/android/tsts-mqdhogs-metrics/) topic for more information.

## Profiling Workflow

When profiling in this workflow, the first goal is to discover if your app is GPU bound or CPU bound.

![WebXR Performance Workflow Diagram](https://scontent.frca1-1.fna.fbcdn.net/v/t39.2365-6/240465144_874954916768355_4050654927593715420_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=0MWLJL-LNikQ7kNvwGMN4Gi&_nc_oc=AdnWnXMH8Kg3MyHHfYkDa8nslUl7614whjtunJoOZAD0St7JKNtZd75HNcyGf3gNGrA&_nc_zt=14&_nc_ht=scontent.frca1-1.fna&_nc_gid=T7qt4aSzNYdNW5Qk-4xYqw&oh=00_Afgzxjoekra0kzWKQbJvwSS8m8a8dGMOtqrGSS01iHPTBg&oe=6943E5DE)

### CPU or GPU Bound

A simple way to determine if an app is CPU or GPU bound is to not render anything. How to accomplish this varies depending on what framework you’re using. Disabling all rendering eliminates the entire cost of the render pipeline, including culling, submitting draw calls, running shaders, and so on.

With rendering disabled, look at your frame times and consider the following:

-   If the app’s framerate is not affected or affected very little when not rendering anything, the app is likely CPU bound.-   If performance improves significantly, the app is likely GPU bound.

### Vertex or Fragment Bound

If you’ve determined that your app is GPU bound, you now need to determine where the GPU bottleneck is. GPU-bound apps usually fall into one of two categories:

-   A vertex-bound app has issues with scene complexity (too much geometry being rendered).-   A fragment-bound app has issues with the number of fragments being rendered, the cost of the fragments being rendered, or possibly both. You’ll sometimes also hear this described as fill rate bound.

Once you’ve determined that your app is GPU bound, you can differentiate between vertex and fragment bound by simply rendering fewer pixels and seeing whether your frame time improves. This can be done by setting the app’s render scale to something small, like 0.01. This will cause many fewer fragments to be rendered while keeping the scene complexity constant.

When you are done testing, look at your results and consider the following:

-   If performance is not affected, the app is likely vertex bound.-   If performance improves, the app is likely fragment bound.

In ThreeJS, you can change the render scale by calling `setFramebufferScaleFactor` on the [WebXRManager](https://threejs.org/docs/index.html?q=webxr#api/en/renderers/webxr/WebXRManager.setFramebufferScaleFactor). In Babylon.js, this can be specified in the WebXRManagedOutputCanvasOptions in the [canvasOptions member](https://doc.babylonjs.com/typedoc/classes/babylon.webxrmanagedoutputcanvasoptions#canvasoptions). In other frameworks, search for a reference to framebufferScaleFactor in the struct passed to the creation of the `XRWebGLLayer`.

## Addressing CPU-Bound Apps

Common causes for an app to be CPU bound include:

-   Complexity of app logic (physics simulation, collision detection, pathfinding, and so on)-   Too many draw calls

An instrumented profiler like [Chrome Tracing](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) can help you track down these performance bottlenecks. Focus on optimizing only the most expensive code paths. Any app logic that takes longer than two milliseconds should be considered for optimization.

Even though draw calls are related to work going to the GPU, they can result in significant CPU cost. Each object rendered requires the app to send information about how to draw the object over to the GPU via the graphics driver. The CPU cost can vary depending on the render state changes (shaders, textures, and so on), but the key point is that draw calls can be CPU intensive. This CPU cost is largely independent of the complexity of the object being rendered. A single triangle is just about the simplest thing you can render. Submitting 1000 individual triangles as unique draw calls would likely cause your app to run at less than 72 frames per second because of CPU cost, even though the Quest GPU can easily render several orders of magnitude more triangles.

Here are some ways to address CPU-bound apps:

-   Start by evaluating the content of your scene. Where possible, merge small meshes into larger chunks and look for any meshes that can be removed from the scene entirely.-   Both [multi-view rendering](https://developers.meta.com/horizon/documentation/web/web-multiview/) and instanced mesh rendering are great options for reducing the number of draw calls necessary to render the objects in the scene.-   Optimize the cost per draw call. For example, try to reduce the number of WebGL calls that must be issued per object by minimizing state changes between draw calls.

## Addressing GPU-Bound Apps

### Vertex Bound

The method used to determine if an app is CPU or GPU bound (disabling all render cameras) means that some CPU-side calculations, like frustum culling, are considered vertex-bound operations. While this is not completely accurate, these operations are often optimized by the same actions that optimize vertex-bound apps. The most common issues for a vertex-bound app are that too many vertices are being rendered or too many draw calls are being issued.

Here are some ways to address CPU-bound apps:

-   If you are rendering highly complex meshes, consider them for simplification. You may also want to look into LOD systems to reduce the complexity of distant objects while retaining geometric detail in nearby objects.-   If you’re making many draw calls, consider batching objects that use the same material into a single call (either through instanced rendering or manually combining these meshes in a 3D editing tool). Additionally, consider whether a more complex visibility culling method such as a portal system or occlusion culling would benefit the app.-   Consider using indexed triangle strips. When rendering indexed triangles strips, the GPU caches and reuses vertices that are referenced by multiple triangles within the same mesh. Every cache hit means less work for the GPU.-   Break apart large models that have a lot of geometry offscreen at any given time, such as a building represented by a single mesh, to enable better frustum culling.-   If using instanced meshes, make sure you’re still performing some kind of frustum culling on them. If you’re already culling groups of instances, cluster them spatially for more efficient culling.

### Fragment Bound

When the app is fragment bound, you must reduce the number of fragments being rendered, the cost of the fragments being rendered, or possibly both.

#### How to Reduce the Number of Fragments

Begin by analyzing the draw order of objects in the scene. [RenderDoc for Oculus](https://developers.meta.com/horizon/documentation/web/webxr-perf-renderdoc/) works great for this. It captures a snapshot of the entire rendering process for a single frame. In that capture, you can see each individual draw call, the order that draw calls are issued, and much more.

By examining the order in which objects are rendered, you can confirm that you’re drawing opaque objects in front-to-back order and maximizing occlusion. Turn on the **Depth Test** overlay to see which fragments are passing the depth test and which are being rejected early.

Another method is to enable Fixed Foveated Rendering (FFR), which draws the peripheral areas of each eye buffer at a lower resolution than the center. Since users usually look at the center of the eye buffer, the reduced resolution at the edges is often not noticeable, and the number of fragments the GPU has to process is significantly reduced.

#### How to Reduce Per-Fragment Cost

Shader cost and complexity can depend on a number of things, although ultimately it comes down to how much work the shader is doing. Some things that contribute to shader complexity include the following:

-   Materials that use physically-based rendering (PBR) are more complex than materials that use simpler shaders. For example: ThreeJS’s MeshStandardMaterial compared to MeshPhongMaterial.-   Each light that affects an object requires the shader to do more work.-   A fragment shader that performs many texture samples can end up being quite expensive.-   Higher-resolution textures, uncompressed textures, and floating-point textures can all result in more expensive shaders, due to the increased memory bandwidth required to read these bigger textures.

All of those things (fancier materials, more lights, bigger textures, and so on) can contribute to your scene looking better. Your aim shouldn’t be to eliminate all of these from the scene, but rather to balance the cost against the visual benefit. For example, you might want to keep PBR materials on the “hero objects” in your scene, but use cheaper materials for things in the background.

When rendering depth-tested opaque objects, the GPU is usually able to skip the expensive pixel computation on pixels it knows will be occluded by objects already rendered into the scene. To maximize the benefit of this, you should sort your opaque objects to maximize this occlusion (e.g., sort front to back) and submit them to the GPU in that order. Frameworks like ThreeJS and Babylon.js do this by default, but it’s often the case that setting the draw order on specific objects can give better results. For example, a sky dome that is always centered on the player may be sorted as if it were near to the user and draw early in the scene and then subsequently be occluded by other objects in the scene. In this case, it would be better to force the sky dome to render after all the rest of the scenery has rendered.

Use the Performance Counter Viewer in [RenderDoc for Oculus](https://developers.meta.com/horizon/documentation/web/webxr-perf-renderdoc/) to see the relative GPU cost of each draw call in the capture. Sort by GPU Duration to easily identify the most expensive objects that you’re rendering and use this to focus optimization efforts. After identifying the objects, here are some optimizations to apply:

-   If using an existing framework with built-in materials, the first option might be to choose a cheaper material type. For example, if you’re using a physically-based rendering material, consider switching to a material that uses a less expensive lighting model.-   Similar logic applies when writing shaders. Try a cheaper lighting model or look for other ways to simplify the fragment shaders. Also consider whether some of the fragment shader computation can be hoisted into the vertex shader.-   Try to reduce the number of lights as much as possible. Each dynamic light adds additional GPU cost for every fragment touched. Consider using static lighting (lightmaps, environment maps, or light probes) as an alternative.-   Compress textures to ETC or ASTC format. While these might not compress as well as JPG in terms of file size, the in-memory representation is more compact and the GPU can render from them more efficiently.-   If a material uses multiple texture maps, see if one or two can be dropped without significantly impacting visual quality. Also see if lower resolution textures can be used for some of those maps.-   If using anisotropic filtering, try switching to bilinear, or at least try dialing down the amount used. Anisotropic filtering can be very expensive, particularly when used on large, uncompressed textures.-   If the shaders are using high precision floating point computations, try switching some to medium precision and see if things are still acceptable.

### Fixed Foveated Rendering

Meta Quest headsets support [Fixed Foveated Rendering](https://developers.meta.com/horizon/documentation/web/webxr-ffr/) (FFR). FFR renders the edges of your eye textures at a lower resolution than the center. The effect lowers the fidelity of the scene in the viewer’s peripheral vision, which reduces the GPU cost because fewer fragments need to be rendered. FFR can significantly improve performance and, depending on the contents of the scene, the impact to visual quality is often nearly imperceptible.

### Framebuffer Scaling

As a last resort, you can consider scaling down the framebuffer resolution (as discussed above). Setting the framebuffer resolution to 0.8 or 0.9 will result in a substantial reduction in fragments that need to be rendered, at the cost of losing some visual sharpness.

## Consider WebXR Layers

In specific situations, WebXR Layers can be an effective tool for optimization for both vertex- and fragment-bound apps. In particular, rendering the background scene of your application into a layer means you only need to re-render it when the background changes. If rendering the background is a major contributor to the vertex and fragment load of your application, this can be a significant performance boost.

## Optimize and Iterate

Use your findings to address the primary issue surfaced during the workflow. Profiling and optimizing is an iterative process. Chances are that isolating and addressing the first issue will not get the app to the performance you desire. It usually takes a few rounds of optimization to get to desired performance. Go through the full workflow again after each optimization pass. If the app was CPU bound before, and that bottleneck has been optimized, the app could end up being fragment bound next.