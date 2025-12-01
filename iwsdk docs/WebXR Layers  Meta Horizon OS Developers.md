WebXR Layers extend the [timewarp](https://developers.meta.com/horizon/documentation/native/android/mobile-timewarp-overview/) functionality provided by the Meta Horizon platform. In web experiences, these layers:

-   Increase performance-   Higher quality rendering of imagery and text-   Easiest display of immersive video

There are several samples that demonstrate the benefit of using WebXR Layers. You can find these samples in the [WebXR Samples](https://immersive-web.github.io/webxr-samples/layers-samples/) on GitHub.

### Increased Performance

WebXR usually requires you to render at the device refresh rate. With Layers, you only need to submit rendered content when the layer updates. For instance, if you have a skybox that is static, you only render it once and then the OS will take care of the rest. This leaves more headroom to render the dynamic parts of your experience.

### Higher-Quality Images

Because WebXR Layers allow you to render directly to the final buffer, you can avoid double sampling and distortions.

![Fuzzy WebXR Screenshot](https://scontent.frca1-1.fna.fbcdn.net/v/t39.2365-6/205982796_835458024051378_2808395705462983205_n.png?_nc_cat=103&ccb=1-7&_nc_sid=e280be&_nc_ohc=RLKaKOeN1hAQ7kNvwFPxqvA&_nc_oc=Adka-0lOthH_7j8ffHx6swJkZdfhKg9EoTnVEgsDW5nGQHXUjaBW6NPOJOcH0WSzJwU&_nc_zt=14&_nc_ht=scontent.frca1-1.fna&_nc_gid=ELoNg0huzrwMozotpXdwEQ&oh=00_AfhUeDle6l6tQxvX94KMHnLKVzy8Zdg1U9XstKXZpuHoaw&oe=69440AC9) In WebXR

![Sharp WebXR Layer Screenshot](https://scontent.frca1-1.fna.fbcdn.net/v/t39.2365-6/205009978_835458027384711_2828870273151351901_n.png?_nc_cat=109&ccb=1-7&_nc_sid=e280be&_nc_ohc=Kp4Hyx8qpTQQ7kNvwF59cpI&_nc_oc=AdmApwy5W81Iubhn3fFgfHkkqUtFvmquGRE6sdqOJDulNis8oncdIn9OGsVarvppIuU&_nc_zt=14&_nc_ht=scontent.frca1-1.fna&_nc_gid=ELoNg0huzrwMozotpXdwEQ&oh=00_AfhqZ91JTzMaUcGuGsUcFqE5Ku8MnPKpl2d16G-dvVpR4Q&oe=694405CA) In WebXR equirect layer

### Easier Video Playback

With WebXR Media Layers, it becomes much easier to display a video without using third-party frameworks. To set up an immersive session with a media layer, something similar to the following could be used:

```
<span>…</span><span> </span><span>// Create an immersive session with layers support.</span><span>
</span><span>let</span><span> xrMediaFactory </span><span>=</span><span> </span><span>new</span><span> </span><span>XRMediaBinding</span><span>(</span><span>session</span><span>);</span><span>
</span><span>let</span><span> video </span><span>=</span><span> document</span><span>.</span><span>createElement</span><span>(</span><span>'video'</span><span>);</span><span>
video</span><span>.</span><span>src </span><span>=</span><span> </span><span>'...'</span><span>;</span><span> </span><span>// url to your video</span><span>

</span><span>let</span><span> layer </span><span>=</span><span> xrMediaFactory</span><span>.</span><span>createCylinderLayer</span><span>(</span><span>video</span><span>,</span><span>
</span><span>{</span><span>space</span><span>:</span><span> refSpace</span><span>,</span><span> layout</span><span>:</span><span> </span><span>"stereo-top-bottom"</span><span>});</span><span>
session</span><span>.</span><span>updateRenderState</span><span>({</span><span> layers</span><span>:</span><span> </span><span>[</span><span> layer </span><span>]</span><span> </span><span>});</span>
```

The browser will take care of sizing the layer and will draw it in the most optimal way possible, giving you the best quality video with low system overhead.

Note that any video will work, including video that is [cross origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) or streaming. [WebXR Video Sample](https://immersive-web.github.io/webxr-samples/layers-samples/media-layer-sample.html) on GitHub demonstrates how easy it is to play high quality video.

### Emulation for other browsers

Not all browsers support WebXR Layers. To support development on a range of browsers and devices, the WebXR Layers polyfill hosted on the [Immersive Web GitHub](https://github.com/immersive-web/webxr-layers-polyfill) supports emulation of WebXR Layers. This framework emulates the native layers implementation. The documentation on the GitHub page describes how to integrate this into your experience.

## WebXR Layers - Technical Overview

### What are WebXR Layers?

In a traditional WebXR experience, Javascript renders the entire scene to a framebuffer (also called the “eye buffer”) at the refresh rate of the headset. This framebuffer is then sent to the system compositor which then displays it to the user with [Timewarp](https://developers.meta.com/horizon/documentation/native/android/mobile-timewarp-overview/). Timewarp adjusts for minor offsets in head position that happened while the browser was rendering the scene.

In practice, the browser provides the Javascript code a head position based on where the headset is at the expected end of the frame and then renders the scene. When the user’s head position changes unexpectedly, the position of their head at the start of rendering a frame may be significantly different than what is expected. Timewarp adjusts for this discrepancy, providing higher-quality, more comfortable VR. Timewarp also helps if the browser can’t keep up with rendering by inventing new frames. This helps smooth the experience but is generally not desired because the user can still observe that the scene is not smooth.

![WebXR Technical Diagram](https://scontent.frca1-1.fna.fbcdn.net/v/t39.2365-6/204812180_835458017384712_4252961317786526075_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=2Q7nvE0nQdoQ7kNvwHrpfmY&_nc_oc=AdkCan4B5mhSituU6VRePndDJdDGgKz-S5-vo4I-0QFK-DPeq4x3gXZsHJIX1ySFT78&_nc_zt=14&_nc_ht=scontent.frca1-1.fna&_nc_gid=ELoNg0huzrwMozotpXdwEQ&oh=00_Afhl7-GPoeV5hK3zDQGSEJ0qMjxqtR-bvF6nresenMllTQ&oe=6943E387)

In a scene with a skybox, some video, and your interactive content, WebXR will render every single pixel with WebGL for each frame. This causes each pixel of the video and the skybox to be sampled by the browser to create the eye buffer. The eye buffer is then sent to the compositor which will Timewarp it and adjust to compensate for lens distortion. This results in the video and skybox pixels to be sampled twice and displays as a slight blurriness, particularly when the video or skybox content is high resolution.

With WebXR Layers, you draw your skybox or video to a texture which is handled separately from the eye buffer. This texture is then directly processed by the compositor.

For our previous example, you would upload a cubemap once at the start of your scene and from then on, the compositor will take care of drawing the skybox. This increases the quality of the skybox and leaves the browser more headroom to draw the interactive foreground content. Likewise for video, you can associate it with a media layer and a video element. The system will take care of rendering it at the appropriate refresh rate.

![WebXR Layer Technical Diagram](https://scontent.frca1-1.fna.fbcdn.net/v/t39.2365-6/206212239_835458020718045_6210880992345431191_n.png?_nc_cat=103&ccb=1-7&_nc_sid=e280be&_nc_ohc=tIDJWNhcFcwQ7kNvwEVudge&_nc_oc=Adn0uo7K-7iHgrpsOisTjjcFYYoiTs50-Z9zXFM4f2PwqItC46P7nemYbiZIheWIIAM&_nc_zt=14&_nc_ht=scontent.frca1-1.fna&_nc_gid=ELoNg0huzrwMozotpXdwEQ&oh=00_AfjAGcXtdSdv5BvRN50z9YPHaYBGQJst8XJ4ugmNQY0iYw&oe=69440166)

Using Layers, the system compositor will draw your eye buffer with Timewarp as before but it will also directly render and Timewarp your skybox and video. Because the compositor can sample directly from the skybox and video, quality will be preserved since each pixel only needs to be sampled once, saving GPU time. Layers are built on top of [Meta Quest Timewarp layers](https://developers.meta.com/horizon/documentation/unity/unity-ovroverlay/) and the API mirrors that of [OpenXR Composition Layers](https://www.khronos.org/registry/OpenXR/specs/1.0/html/xrspec.html#compositing). See the [Immersive Web Layers Explainer](https://github.com/immersive-web/layers/blob/main/explainer.md) on GitHub if you want a more in-depth explanation of the WebXR Layers API.

WebXR Media Layers use WebGL to draw into regular WebXR Layers. These layers offer a high degree of customization and control, but require a lot of setup, knowledge of shaders, and other complex logic.

To display a video, it may be easier to create a media layer with the size and position you want and associate it with a standard `<video>` element. Now this layer will display the contents of this video. The playback is controlled by calling the [usual methods](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#methods) on the video element. For an example, see the [WebXR Media Layer Sample](https://immersive-web.github.io/webxr-samples/layers-samples/media-layer-sample.html) on GitHub.

### Image Quality

To demonstrate the difference in image quality, see the [Cube Layer Sample](https://immersive-web.github.io/webxr-samples/layers-samples/cube-layer.html) on GitHub and go immersive, you will see an immersive 360 photo. Initially, the photo is displayed with regular WebXR, but if you pull the trigger on the controller, it will switch to using Layers. Note how much sharper the image appears when Layers are used.

The **Higher Quality Images** section above contains screenshots of the differences demonstrated by the sample.

The version that uses layers is sharper and has less distortion, especially at the top and bottom of the scene. This is happening because sampling from the image is only done once. Additionally, the compositor can do a better job reprojecting the image because it knows it’s an equirect.

### Differences in GPU Usage

Measuring the improvements in GPU usage can be done with [ovrgpuprofiler](https://developers.meta.com/horizon/documentation/native/android/ts-ovrgpuprofiler/).

First, put the profiler into “detailed profiling mode” by running ‘ovrgpuprofiler -e’. You can now run a trace with ‘ovrgpuprofiler -t’. (You may need to restart the browser after running with -e, which can be done by ‘adb shell am force-stop com.oculus.browser’.)

This is what the tool reports with `-t` option for the regular WebXR experience:

```
<span>...</span><span> </span><span>|</span><span> </span><span>3.14</span><span> ms </span><span>|</span><span> </span><span>75</span><span> stages </span><span>:</span><span> </span><span>Binning</span><span> </span><span>:</span><span> </span><span>0.085ms</span><span> </span><span>Render</span><span> </span><span>:</span><span> </span><span>1.623ms</span><span> </span><span>StoreColor</span><span> </span><span>:</span><span> </span><span>0.362ms</span><span> </span><span>Blit</span><span> </span><span>:</span><span> </span><span>0.002ms</span><span> </span><span>Preempt</span><span> </span><span>:</span><span> </span><span>0.819ms</span><span>
</span><span>...</span><span> </span><span>|</span><span> </span><span>3.15</span><span> ms </span><span>|</span><span> </span><span>75</span><span> stages </span><span>:</span><span> </span><span>Binning</span><span> </span><span>:</span><span> </span><span>0.084ms</span><span> </span><span>Render</span><span> </span><span>:</span><span> </span><span>1.618ms</span><span> </span><span>StoreColor</span><span> </span><span>:</span><span> </span><span>0.363ms</span><span> </span><span>Blit</span><span> </span><span>:</span><span> </span><span>0.003ms</span><span> </span><span>Preempt</span><span> </span><span>:</span><span> </span><span>0.819ms</span><span>
</span><span>...</span><span> </span><span>|</span><span> </span><span>3.21</span><span> ms </span><span>|</span><span> </span><span>75</span><span> stages </span><span>:</span><span> </span><span>Binning</span><span> </span><span>:</span><span> </span><span>0.085ms</span><span> </span><span>Render</span><span> </span><span>:</span><span> </span><span>1.663ms</span><span> </span><span>StoreColor</span><span> </span><span>:</span><span> </span><span>0.364ms</span><span> </span><span>Blit</span><span> </span><span>:</span><span> </span><span>0.003ms</span><span> </span><span>Preempt</span><span> </span><span>:</span><span> </span><span>0.837ms</span>
```

Each frame is taking around 3.15 milliseconds to render.

This is what the tool reports with `-t` option for the WebXR Layers experience:

```
<span>...</span><span> </span><span>|</span><span> </span><span>0.72</span><span> ms </span><span>|</span><span> </span><span>74</span><span> stages </span><span>:</span><span> </span><span>Binning</span><span> </span><span>:</span><span> </span><span>0.072ms</span><span> </span><span>Render</span><span> </span><span>:</span><span> </span><span>0.266ms</span><span> </span><span>StoreColor</span><span> </span><span>:</span><span> </span><span>0.215ms</span><span> </span><span>Blit</span><span> </span><span>:</span><span> </span><span>0.002ms</span><span>
</span><span>...</span><span> </span><span>|</span><span> </span><span>0.72</span><span> ms </span><span>|</span><span> </span><span>74</span><span> stages </span><span>:</span><span> </span><span>Binning</span><span> </span><span>:</span><span> </span><span>0.072ms</span><span> </span><span>Render</span><span> </span><span>:</span><span> </span><span>0.263ms</span><span> </span><span>StoreColor</span><span> </span><span>:</span><span> </span><span>0.219ms</span><span> </span><span>Blit</span><span> </span><span>:</span><span> </span><span>0.003ms</span><span>
</span><span>...</span><span> </span><span>|</span><span> </span><span>0.72</span><span> ms </span><span>|</span><span> </span><span>74</span><span> stages </span><span>:</span><span> </span><span>Binning</span><span> </span><span>:</span><span> </span><span>0.073ms</span><span> </span><span>Render</span><span> </span><span>:</span><span> </span><span>0.265ms</span><span> </span><span>StoreColor</span><span> </span><span>:</span><span> </span><span>0.221ms</span><span> </span><span>Blit</span><span> </span><span>:</span><span> </span><span>0.003ms</span>
```

-   “Render” is significantly faster because only the controllers are drawn.-   “StoreColor” is also faster because much of the scene is empty so those tiles don’t need to be copied.-   There is no “preempt”. The scene is rendering so fast that it wasn’t interjected by a system compositor event.

The overgpuprofiler tool has support for many other metrics that are explained in the [ovrgpuprofiler guide](https://developers.meta.com/horizon/documentation/unity/ts-ovrgpuprofiler/).

Overall GPU usage between the two modes: Regular WebXR: **GPU % Bus Busy : 50.210** WebXR Layers: **GPU % Bus Busy : 23.904**

So, the same experience now runs at higher quality and at half the GPU usage.