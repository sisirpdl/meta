While primitive shapes are useful for learning, real WebXR applications use external assets like 3D models, textures, and audio files. In this guide, you’ll learn how to load and use external assets efficiently in IWSDK. By the end, you’ll be able to load GLTF models and apply textures to create professional-looking scenes.

## Why external assets matter

External assets transform your WebXR experience from basic geometric shapes to rich, detailed environments:

-   3D Models: Detailed objects created in tools like Blender, Maya, or downloaded from asset stores.-   Textures: Images that provide surface detail, color, and material properties.-   Audio: Sound effects and ambient audio for immersion.-   HDR Images: Environment maps for realistic lighting and reflections.

## IWSDK’s asset manager

IWSDK includes a powerful AssetManager that handles loading, caching, and optimization of external assets. It provides several key benefits:

-   Preloading: Load assets during application initialization for smooth experiences.-   Caching: Avoid reloading the same asset multiple times.-   Loading Priorities: Control whether assets are critical (blocking) or background (non-blocking).-   Static Access: Simple API to retrieve loaded assets anywhere in your code.

### Asset loading priorities

IWSDK supports two loading priorities to optimize performance:

-   Critical: Load before the application starts - blocks `World.create()` until loaded-   Background: Load early but don’t block initialization - prevents runtime loading hiccups

**Choose your loading strategy carefully:**

-   Critical priority: Only for assets essential to your app’s core experience (like main characters, UI elements, core environment pieces). The `World.create()` promise won’t resolve until all critical assets are loaded, so use sparingly.
    -   Background priority: For assets you know you’ll need but that shouldn’t block startup (decorative objects, optional audio, extra textures). These start loading immediately after critical assets finish, so they’re cached and ready when you need them which avoids stutters caused by loading during runtime.
    -   Runtime loading: For user-specific or conditional content that may never be needed. Load these on-demand using `AssetManager.loadGLTF()` or similar methods.
    

## Setting up asset loading

Assets are configured using an `AssetManifest` object that you pass to `World.create()`. Let’s look at how this works in practice.

### Asset manifest structure

In your starter app’s `src/index.ts`, you’ll see this pattern:

```
<span><span>import</span><span>&nbsp;{&nbsp;</span><span>AssetManifest</span><span>,&nbsp;</span><span>AssetType</span><span>,&nbsp;</span><span>World</span><span>&nbsp;}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'@iwsdk/core'</span><span>;</span></span><br><span><span></span></span><br><span><span>const</span><span>&nbsp;assets:&nbsp;</span><span>AssetManifest</span><span>&nbsp;=&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;robot:&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;url:&nbsp;</span><span>'/gltf/robot/robot.gltf'</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;type:&nbsp;</span><span>AssetType</span><span>.</span><span>GLTF</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;priority:&nbsp;</span><span>'critical'</span><span>,</span></span><br><span><span>&nbsp;&nbsp;},</span></span><br><span><span>&nbsp;&nbsp;webxr:&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;url:&nbsp;</span><span>'/textures/webxr.png'</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;type:&nbsp;</span><span>AssetType</span><span>.</span><span>Texture</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;priority:&nbsp;</span><span>'critical'</span><span>,</span></span><br><span><span>&nbsp;&nbsp;},</span></span><br><span><span>&nbsp;&nbsp;chimeSound:&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;url:&nbsp;</span><span>'/audio/chime.mp3'</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;type:&nbsp;</span><span>AssetType</span><span>.</span><span>Audio</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;priority:&nbsp;</span><span>'background'</span><span>,</span></span><br><span><span>&nbsp;&nbsp;},</span></span><br><span><span>};</span></span><br><span><span></span></span><br><span><span>World</span><span>.create(document.getElementById(</span><span>'scene-container'</span><span>),&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;assets,&nbsp;</span><span>//&nbsp;Pass&nbsp;the&nbsp;manifest&nbsp;to&nbsp;World.create</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;...&nbsp;other&nbsp;options</span></span><br><span><span>}).then((world)&nbsp;=&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Assets&nbsp;are&nbsp;now&nbsp;loaded&nbsp;and&nbsp;available&nbsp;via&nbsp;AssetMa</span><span>nager</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

### Supported asset types

IWSDK supports these asset types:

-   `AssetType.GLTF`: 3D models in GLB or GLTF format-   `AssetType.Texture`: Images for materials (JPG, PNG, WebP)-   `AssetType.HDRTexture`: HDR environment maps (HDR format)-   `AssetType.Audio`: Audio files (MP3, WAV, OGG)

**Asset organization**

Place your assets in the `public/` directory of your project. Common subfolder names include:

-   `/gltf/` for 3D models-   `/textures/` for images-   `/audio/` for sound files-   `/hdr/` for environment maps

## Loading and using GLTF models

GLTF (GL Transmission Format) is the standard format for 3D models in WebXR. Here’s how to load and use them:

### Basic GLTF loading

Add your GLTF to the asset manifest, then access it using `AssetManager.getGLTF()`:

```
<span><span>import</span><span>&nbsp;{&nbsp;</span><span>AssetManager</span><span>&nbsp;}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'@iwsdk/core'</span><span>;</span></span><br><span><span></span></span><br><span><span>//&nbsp;In&nbsp;your&nbsp;asset&nbsp;manifest</span></span><br><span><span>const</span><span>&nbsp;assets&nbsp;=&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;myRobot:&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;url:&nbsp;</span><span>'/gltf/robot.glb'</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;type:&nbsp;</span><span>AssetType</span><span>.</span><span>GLTF</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;priority:&nbsp;</span><span>'critical'</span><span>,</span></span><br><span><span>&nbsp;&nbsp;},</span></span><br><span><span>};</span></span><br><span><span></span></span><br><span><span>//&nbsp;After&nbsp;World.create()</span></span><br><span><span>World</span><span>.create(</span><span>/*&nbsp;...&nbsp;*/</span><span>).then((world)&nbsp;=&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Get&nbsp;the&nbsp;loaded&nbsp;GLTF</span></span><br><span><span>&nbsp;&nbsp;</span><span>const</span><span>&nbsp;{&nbsp;scene:&nbsp;robotMesh&nbsp;}&nbsp;=&nbsp;</span><span>AssetManager</span><span>.getGLTF(</span><span>'myRobot'</span><span>);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Position&nbsp;and&nbsp;scale&nbsp;the&nbsp;mesh</span></span><br><span><span>&nbsp;&nbsp;robotMesh.position.</span><span>set</span><span>(</span><span>0</span><span>,&nbsp;</span><span>1</span><span>,&nbsp;-</span><span>3</span><span>);</span></span><br><span><span>&nbsp;&nbsp;robotMesh.scale.setScalar(</span><span>0.5</span><span>);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Create&nbsp;a&nbsp;transform&nbsp;entity&nbsp;from&nbsp;the&nbsp;mesh</span></span><br><span><span>&nbsp;&nbsp;</span><span>const</span><span>&nbsp;robotEntity&nbsp;=&nbsp;world.createTransformEntity(robotMe</span><span>sh);</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

### Why GLTF?

GLTF is currently the only official 3D model format supported by IWSDK. GLTF was chosen because it’s specifically designed for web and real-time 3D applications:

-   Web-optimized: Efficient loading and parsing in browsers.-   Compact: Binary GLB format reduces file sizes significantly.-   Complete: Supports geometry, materials, textures, animations, and lighting in one format.-   Industry standard: Backed by Khronos Group and supported by all major 3D tools.-   WebXR ready: Perfect format for immersive web experiences.

If you’re working with other 3D formats like FBX, OBJ, or 3DS Max files, you can easily convert them to GLTF using free, open-source software like [Blender](https://www.blender.org/). Simply import your model into Blender and export as GLTF or GLB.

**GLTF optimization**

-   Use GLB format for smaller file sizes (binary is more compact than JSON).-   Optimize geometry in your 3D software by removing unnecessary vertices and combining meshes where possible.-   Keep polygon counts reasonable. Aim for game-ready models rather than high-poly renders.

## Working with textures

Textures add surface detail to your 3D objects. Here’s how to load and apply them:

### Basic texture loading

```
<span><span>import</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>MeshBasicMaterial</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>PlaneGeometry</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>Mesh</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>SRGBColorSpace</span><span>,</span></span><br><span><span>}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'@iwsdk/core'</span><span>;</span></span><br><span><span></span></span><br><span><span>//&nbsp;In&nbsp;your&nbsp;asset&nbsp;manifest&nbsp;(already&nbsp;in&nbsp;your&nbsp;starter</span><span>&nbsp;app)</span></span><br><span><span>const</span><span>&nbsp;assets&nbsp;=&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;webxr:&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;url:&nbsp;</span><span>'/textures/webxr.png'</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;type:&nbsp;</span><span>AssetType</span><span>.</span><span>Texture</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;priority:&nbsp;</span><span>'critical'</span><span>,</span></span><br><span><span>&nbsp;&nbsp;},</span></span><br><span><span>};</span></span><br><span><span></span></span><br><span><span>//&nbsp;After&nbsp;World.create()</span></span><br><span><span>World</span><span>.create(</span><span>/*&nbsp;...&nbsp;*/</span><span>).then((world)&nbsp;=&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Get&nbsp;the&nbsp;loaded&nbsp;texture</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Because&nbsp;of&nbsp;the&nbsp;"critical"&nbsp;loading&nbsp;strategy,&nbsp;you</span><span>&nbsp;can&nbsp;be&nbsp;sure&nbsp;it's&nbsp;available&nbsp;here</span></span><br><span><span>&nbsp;&nbsp;</span><span>const</span><span>&nbsp;webxrTexture&nbsp;=&nbsp;</span><span>AssetManager</span><span>.getTexture(</span><span>'webxr'</span><span>);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Set&nbsp;proper&nbsp;color&nbsp;space&nbsp;for&nbsp;the&nbsp;texture</span></span><br><span><span>&nbsp;&nbsp;webxrTexture.colorSpace&nbsp;=&nbsp;</span><span>SRGBColorSpace</span><span>;</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Create&nbsp;a&nbsp;material&nbsp;using&nbsp;the&nbsp;texture</span></span><br><span><span>&nbsp;&nbsp;</span><span>const</span><span>&nbsp;logoMaterial&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>MeshBasicMaterial</span><span>({</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;map:&nbsp;webxrTexture,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;transparent:&nbsp;</span><span>true</span><span>,&nbsp;</span><span>//&nbsp;PNG&nbsp;with&nbsp;transparency</span></span><br><span><span>&nbsp;&nbsp;});</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Create&nbsp;a&nbsp;plane&nbsp;to&nbsp;display&nbsp;the&nbsp;WebXR&nbsp;logo</span></span><br><span><span>&nbsp;&nbsp;</span><span>const</span><span>&nbsp;logoGeometry&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>PlaneGeometry</span><span>(</span><span>1.13</span><span>,&nbsp;</span><span>0.32</span><span>);</span></span><br><span><span>&nbsp;&nbsp;</span><span>const</span><span>&nbsp;logoPlane&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>Mesh</span><span>(logoGeometry,&nbsp;logoMaterial);</span></span><br><span><span>&nbsp;&nbsp;logoPlane.position.</span><span>set</span><span>(</span><span>0</span><span>,&nbsp;</span><span>1.8</span><span>,&nbsp;-</span><span>1.9</span><span>);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Create&nbsp;transform&nbsp;entity</span></span><br><span><span>&nbsp;&nbsp;</span><span>const</span><span>&nbsp;logoEntity&nbsp;=&nbsp;world.createTransformEntity(logoPlan</span><span>e);</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

**Texture optimization**

-   Choose the right format: Use JPG for photos and realistic textures, and PNG for images with transparency.-   Use power-of-2 dimensions: 512×512, 1024×1024, 2048×2048. These load and render more efficiently.-   Keep file sizes reasonable: Large textures can significantly impact loading times and performance.

**Asset availability**

Use `if` checks when accessing assets with ‘background’ priority, as they might still be loading when your code runs. Critical assets are guaranteed to be available.

## Runtime asset loading

You can also load assets dynamically after the app starts:

```
<span><span>//&nbsp;Load&nbsp;an&nbsp;asset&nbsp;at&nbsp;runtime</span></span><br><span><span>AssetManager</span><span>.loadGLTF(</span><span>'/gltf/dynamic-object.glb'</span><span>,&nbsp;</span><span>'dynamicModel'</span><span>)</span></span><br><span><span>&nbsp;&nbsp;.then(()&nbsp;=&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;{&nbsp;scene:&nbsp;dynamicMesh&nbsp;}&nbsp;=&nbsp;</span><span>AssetManager</span><span>.getGLTF(</span><span>'dynamicModel'</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;dynamicMesh.position.</span><span>set</span><span>(</span><span>0</span><span>,&nbsp;</span><span>2</span><span>,&nbsp;-</span><span>3</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;entity&nbsp;=&nbsp;world.createTransformEntity(dynamicMesh)</span><span>;</span></span><br><span><span>&nbsp;&nbsp;})</span></span><br><span><span>&nbsp;&nbsp;.</span><span>catch</span><span>((error)&nbsp;=&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;console.error(</span><span>'Failed&nbsp;to&nbsp;load&nbsp;dynamic&nbsp;asset:'</span><span>,&nbsp;error);</span></span><br><span><span>&nbsp;&nbsp;});</span></span><br><span><span></span></span><br>
```

## Next steps

You now know how to work with external assets to create rich, detailed WebXR experiences. Next, you’ll learn about making your scenes look professional by adding proper environment and lighting.

You’ll learn how to:

-   Use Dome components for beautiful skyboxes and backgrounds-   Set up IBL (Image-Based Lighting) for realistic reflections and ambient lighting-   Configure environment maps and their effects on materials-   Create visually stunning scenes with minimal code changes