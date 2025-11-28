## What is the default frame rate?

A WebXR session on the Browser runs by default at 90 frames per second on Meta Quest 2 and 72 frames per second on Meta Quest headsets.

This means that your web pages should draw the page at that frequency. If your page is too slow and can’t maintain the redraw rate, the system compositor has to create the missing frame. To the user this will show up as stuttering animations and black bars at the side of the field of view. See this [TimeWarp blog](https://developers.meta.com/horizon/documentation/native/android/mobile-timewarp-overview/#discussion) to learn more about how the compositor creates these missing frames.

## Why change the default framerate?

If your browser page can’t produce enough data, the system has to produce missing frame which will increase the load. by lowering the frame rate, you will give the page more time to produce a frame. Consequently, the system has to invent fewer missing frames which will decrease system load.

Conversely, if you spent _less_ time than needed on a frame, you could raise the frame rate. Higher frame rates result in more realistic experiences to the user.

## WebXR support

Browser version 16.4 and higher has support for [new WebXR APIs](https://immersive-web.github.io/webxr/#nominal-frame-rate) that let you query and set the current frame rate.

To get the current framerate:

```
<span>function</span><span> onXRAnimationFrame</span><span>(</span><span>time</span><span>,</span><span> xrFrame</span><span>)</span><span> </span><span>{</span><span>
  </span><span>...</span><span>
  </span><span>if</span><span> </span><span>(</span><span> session</span><span>.</span><span>frameRate </span><span>!==</span><span> </span><span>undefined</span><span>)</span><span> </span><span>{</span><span>
    </span><span>let</span><span> currentFrameRate </span><span>=</span><span> session</span><span>.</span><span>frameRate</span><span>;</span><span>
    </span><span>...</span><span>
  </span><span>}</span><span>
</span><span>}</span>
```

To get the list of supported framerates:

```
<span>function</span><span> onXRAnimationFrame</span><span>(</span><span>time</span><span>,</span><span> xrFrame</span><span>)</span><span> </span><span>{</span><span>
  </span><span>...</span><span>
  </span><span>if</span><span> </span><span>(</span><span> session</span><span>.</span><span>supportedFrameRates </span><span>!==</span><span> </span><span>undefined</span><span>)</span><span> </span><span>{</span><span>
    </span><span>let</span><span> framerateList </span><span>=</span><span> session</span><span>.</span><span>supportedFrameRates</span><span>;</span><span>
    </span><span>...</span><span>
  </span><span>}</span><span>
</span><span>}</span>
```

To set a framerate:

```
<span>function</span><span> onXRAnimationFrame</span><span>(</span><span>time</span><span>,</span><span> xrFrame</span><span>)</span><span> </span><span>{</span><span>
  </span><span>...</span><span>
  </span><span>if</span><span> </span><span>(</span><span> session</span><span>.</span><span>supportedFrameRates </span><span>!==</span><span> </span><span>undefined</span><span>)</span><span> </span><span>{</span><span>
    </span><span>let</span><span> framerateList </span><span>=</span><span> session</span><span>.</span><span>supportedFrameRates</span><span>;</span><span>
    session</span><span>.</span><span>updateTargetFrameRate</span><span>(</span><span> framerateList</span><span>[</span><span>0</span><span>]</span><span> </span><span>).</span><span>then</span><span>(</span><span>
        </span><span>`() =&gt; console.log( "frame rate was applied" ) );`</span><span>
    </span><span>...</span><span>
  </span><span>}</span><span>
</span><span>}</span>
```

The WebXR group is working on additional support so you have better control over measuring if the system is overloaded or has headroom for a higher frame rate.

Until then, you could measure the time between frames. If it takes longer than the desired frame time (ie longer then 11ms for a 90Hz framerate), you can assume that you should set a lower rate. You could also detect what headset you’re using and tune your application for that device.