Fixed Foveated Rendering (FFR) is a rendering technique where the periphery of the eye buffers is rendered at a lower resolution in order to save rendering cost. This is particularly beneficial in situations where an app is fragment-shader bound. [The Unity FFR guide](https://developers.meta.com/horizon/documentation/unity/unity-fixed-foveated-rendering/#understanding-different-degrees-of-foveation) provides more information about what fixed foveated rendering is (although it explains it in the context of Unity).

In Browser, you can configure this at the start of a WebXR session or you can set it and adjust it dynamically at runtime.

## To set FFR at startup

To configure your app to take advantage of FFR, you specify an option in the “optionalFeatures” array that is passed into XRSystem.requestSession. Specifically, you should specify one of ‘high-fixed-foveation-level’, ‘medium-fixed-foveation-level’, or ‘low-fixed-foveation-level’. These map to the high, medium, and low-foveation options described in the Unity doc linked above.

```
<span>const</span><span> sessionInit </span><span>=</span><span> </span><span>{</span><span>
    requiredFeatures</span><span>:</span><span> </span><span>[</span><span>
        </span><span>'local-floor'</span><span>,</span><span>
    </span><span>],</span><span>
    optionalFeatures</span><span>:</span><span> </span><span>[</span><span>
        </span><span>'high-fixed-foveation-level'</span><span>,</span><span>
   </span><span>]};</span><span>
xr</span><span>.</span><span>requestSession</span><span>(</span><span> </span><span>'immersive-vr'</span><span>,</span><span> sessionInit </span><span>).</span><span>then</span><span>(...)</span>
```

While this can be a significant performance improvement, in some cases foveation can cause noticeable degradation in visual quality. In particular, high-contrast or text-heavy scenes may make the foveation artifacts more obvious. Care should be taken to evaluate the impact on visual quality for your particular use case.

## To set and adjust FFR dynamically

As an alternative, you can set the `fixedFoveation` attribute on [`XRWebGLLayer`](https://immersive-web.github.io/webxr/#dom-xrwebgllayer-fixedfoveation). This allows you to set a value between 0 and 1 that Browser will map to the available foveation level.

## Verify that it is working

In many cases, the effect of FFR is often nearly imperceptible. To confirm that you have it configured correctly, launch your app, go into immersive mode, and then run the following command in the adb shell:

The output will look something like this:

```
<span>Surface</span><span> </span><span>0</span><span> </span><span>|</span><span> </span><span>2880x1584</span><span> </span><span>|</span><span> color </span><span>32bit</span><span>,</span><span> depth </span><span>24bit</span><span>,</span><span> stencil </span><span>8</span><span> bit</span><span>,</span><span>
MSAA </span><span>4</span><span> </span><span>|</span><span> </span><span>135</span><span> </span><span>192x176</span><span> bins </span><span>|</span><span> </span><span>10.94</span><span> ms </span><span>|</span><span> </span><span>164</span><span> stages </span><span>:</span><span> </span><span>Binning</span><span> </span><span>:</span><span> </span><span>0.406ms</span><span>
</span><span>Render</span><span> </span><span>:</span><span> </span><span>7.481ms</span><span> </span><span>StoreColor</span><span> </span><span>:</span><span> </span><span>1.022ms</span><span> </span><span>Blit</span><span> </span><span>:</span><span> </span><span>0.057ms</span><span> </span><span>Preempt</span><span> </span><span>:</span><span> </span><span>1.394ms</span>
```

The number of stages listed (“164 stages” in the example above) gives you a clue. The precise number will vary based on a number of factors in your app, but the number should be lower if FFR is enabled than if it is not. Higher levels of FFR should result in a smaller number of stages than lower levels do.

## Why it might not be working

If your app is fragment-shader bound but you’re not seeing the benefit of FFR, there are two common causes that you should check:

-   **Rendering the scene to an intermediate buffer and then post-processing that into the final frame.** FFR only applies when rendering to the final frame buffer, so if you’re rendering to an intermediate buffer, you won’t see a meaningful performance improvement.-   **Switching render-targets throughout the frame.** If you render part of your scene to the eye buffer, then switch render targets (for example, to render a shadow map), and then switch back to the eye buffer and finish rendering your scene this will cause FFR (and MSAA) to not work. You should instead render to any other render targets first and then switch to the final eye buffer and render your entire scene.