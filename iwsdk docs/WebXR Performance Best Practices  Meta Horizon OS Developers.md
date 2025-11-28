## Can web-based VR experiences look good and be performant?

Building high-performance VR experiences for Meta Quest headsets is hard work. This is true whether you’re building native VR applications or building them using WebXR. There is a common assumption that VR experiences built on the web have to be slower and less performant than experiences built on native platforms like Unity and Unreal. While there is some truth to this — there is a small amount of additional overhead inherent in running inside a browser — it’s usually the case that slow web-based VR experiences are slow because they haven’t been carefully optimized rather than because they’re running in the browser. The native applications that are available in the Meta Horizon Store have had a significant amount of hard work and attention to detail invested in them to ensure they look great and run smoothly. If you’re willing to put in the work and attention, a web-based experience can be equally fast and beautiful.

## Rendering performance is a complex topic

In what follows, we provide general guidance and recommendations that can help set appropriate expectations for WebXR experiences running on Meta Quest headsets. But at the outset, it’s important to emphasize that these are recommendations and not guarantees. Rendering performance is a complex topic. Seemingly small, subtle differences can have a significant impact on the performance of your application, so the only way to know for sure if these recommendations will apply to your app is to test and measure the improvement. The [Per Frame Cost](https://developers.meta.com/horizon/documentation/unity/po-per-frame-gpu/) describes a rigorous approach to testing performance optimizations in a reproducible manner, which is particularly important when evaluating certain tradeoffs.

## Render opaque objects from front-to-back

Because Meta Quest headsets need to render at very high frame rates to deliver a great experience and because they have high-resolution displays, many VR experiences will end up being fragment bound or fill-rate bound. In other words, they are rendering too many fragments and/or the fragments they are rendering are too expensive. As much as possible, you should strive to only render to each fragment or pixel on the screen exactly once. This usually won’t be possible, but you want to push in this direction as much as you can. Rendering to the same fragments multiple times is often referred to as **overdraw** — a frame with high overdraw is one that renders to the same fragments many times.

One easy way to minimize overdraw in your app is to ensure you’re sorting opaque objects front-to-back relative to the camera’s current position and orientation. Assuming you have depth-testing enabled, the GPU can quickly skip over any pixels that it knows will be occluded by other objects that have already been rendering in the current frame. By sorting front-to-back, you maximize this occlusion and the GPU ends up being able to reject a lot more fragments.

Most popular 3D frameworks on the web have support for this, and some of them render front-to-back by default. Even for those that do, however, there is still opportunity to tweak the sort order explicitly based on what you know of your scene. For example, if you’re rendering the sky as a big sphere that is centered around the viewer’s position, the default front-to-back sorting will likely get confused. The “position” of the sky will probably be very close to the camera’s position, which would cause the sky to render early on, touching every fragment in the frame. Subsequently, all the scenery will draw over those fragments again. Setting the sky’s draw order manually may be necessary to ensure it draws after all the foreground objects have been rendered.

## Use complex materials judiciously

Popular 3D frameworks like ThreeJS and Babylon.js support PBR materials. While these materials should be used judiciously, you can definitely use these in your experience to great effect and still achieve good performance on Meta Quest hardware.

As mentioned above, being careful with front-to-back is critical here. You probably can’t afford to render complex materials to every fragment multiple times per frame.

PBR materials support multiple texture maps, such as diffuse, normal, ambient occlusion, roughness, and so on. The more maps you use, and the higher resolution they are, the more work the GPU has to do. Texture bandwidth (the amount of texels the GPU has to read) can become a bottleneck. Experiment with dropping maps entirely or using lower-resolution maps for some or all of the material’s maps as a way to reduce the cost of these materials.

## Limit the number of real-time lights

The number (and type) of lights in your scene can also have a significant impact on the performance of your scene, particularly if you’re using PBR materials. Each additional light affecting an object means that the shaders for that object need to do additional work. One of the things that makes PBR materials look so realistic is that they use a complex mathematical model to compute the lighting contribution of each light in the scene, so the cost of additional lights can really add up. In general, directional lights (or sun lights) are typically least expensive, followed by point lights, spot lights, and area lights (in order of increasing cost). You typically want to limit yourself to one directional light or one point light if you’re making heavy use of PBR materials.

If your lighting setup is static (i.e., light positions and values are not changing), consider using light probes as an alternative method of illuminating dynamic objects. For fully static setups (i.e., static lighting and static objects), consider baking lighting into lightmaps.

## Be careful with real-time shadows

Real-time shadows are typically implemented by rendering the scene once from the perspective of the light to generate the shadow map, and then rendering the scene again from the position of the viewer and applying the shadow map to the objects in the scene. Drawing the scene to render the shadow map counts against your overall scene budget for draw calls and triangles. Also, if you’re rendering to a high-resolution shadow map, this can contribute to your scene becoming fragment bound because of the number of fragments that need to be shaded in the shadow map. Shadow-casting point lights are particularly problematic because they usually have 6 shadow maps that need to be rendered each frame.

## Compress your textures

[KTX 2.0](https://github.com/KhronosGroup/3D-Formats-Guidelines)/Basis Universal is the recommended approach to texture-compression for WebXR experiences on Meta Quest devices. While this may not result in file sizes that are as small as JPEG or PNG, the in-memory size of the texture will be smaller and the GPU is able to access these textures more efficiently which will decrease the texture bandwidth of your scene.

If you’re new to texture compression in the context of real-time rendering, there is a lot of helpful documentation at the KTX 2.0 link above. In particular, the [Artist Guide](https://github.com/KhronosGroup/3D-Formats-Guidelines/blob/main/KTXArtistGuide.md) is a good reference for understanding the different types of compression provided, their strengths and weaknesses, and which types of compression are most appropriate for different types of texture maps. For example, you’ll want to compress your diffuse map using a different type of compression than what you use for your normal map.

## Be careful with transparent objects and overdraw

Transparent objects are typically rendered back-to-front. This ensures that the transparency looks correct, but also means that a lot of fragments in the scene are rendered to multiple times. Particle effects can be an extreme version of this, because they often result in many large overlapping transparent objects and, as a result, a significant amount of overdraw.

## Avoid rendering empty transparency

If you have 3D objects in your scene that fade out based on app logic, make sure to stop drawing them once they’re completely faded out. Otherwise, even if they’re fully transparent you are likely still going to pay the full cost of rendering them.

## Set your clear color to white or black

The Adreno GPUs on Quest 1 and 2 have a [hardware-level “Fast clear” optimization](https://developer.qualcomm.com/docs/adreno-gpu/developer-guide/gpu/spec_sheets.html) when clearing buffers to black or white. If you’re not depending on the clear color to provide the background of your scene, make sure that you set it to one of those two colors.

## Stagger updates across multiple frames

VR apps need to run at a very high frame rate, but the rate at which you update the objects in your experience don’t necessarily need to update as quickly. In cases where you are CPU bound, you can optimize this by staggering some scene updates across multiple frames. For example, you might only need to update animations 30 times a second even though you’re rendering at 90 frames a second. In this case, grouping the objects in your scene into three sets and only updating animations for one set per frame will reduce the per-frame cost significantly. A similar optimization may be applied to update objects that are further away from the viewer less frequently.