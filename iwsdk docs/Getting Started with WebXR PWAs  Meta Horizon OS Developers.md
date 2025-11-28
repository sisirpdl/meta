Updated: Mar 27, 2025

Before packaging your WebXR experience as a PWA, test it in the Browser. PWAs use the same rendering engine as Browser, making it easy to identify compatibility or performance issues with minimal effort.

You can find basic information about Browser, including the User Agent string, supported content sizes, and more in our Browser [Getting Started](https://developers.meta.com/horizon/documentation/web/browser-specs/) guide. You can also connect the [Chrome Developer Tools](https://developers.meta.com/horizon/documentation/web/browser-remote-debugging/) from your computer to a Meta Quest device for debugging and performance analysis using the Android Platform Tools.

## Request WebXR Session after page load

WebXR PWAs should behave like native immersive apps in Meta Horizon OS, launching directly into immersive mode right after launch without a 2D landing page. To achieve this, call the [requestSession](https://developer.mozilla.org/en-US/docs/Web/API/XRSystem/requestSession) API right after the page is loaded.

### In THREE.js

Add a `navigator.xr.requestSession` call after the page initialization is finished.

For example, in `init.js`, at the end of the `init` function definition:

```
<span>export</span><span> </span><span>async</span><span> </span><span>function</span><span> init</span><span>(</span><span>setupScene </span><span>=</span><span> </span><span>()</span><span> </span><span>=&gt;</span><span> </span><span>{},</span><span> onFrame </span><span>=</span><span> </span><span>()</span><span> </span><span>=&gt;</span><span> </span><span>{})</span><span> </span><span>{</span><span>
  </span><span>// Other setup code...</span><span>
  </span><span>if</span><span> </span><span>(</span><span>navigator</span><span>.</span><span>xr </span><span>&amp;&amp;</span><span> navigator</span><span>.</span><span>xr</span><span>.</span><span>isSessionSupported</span><span>)</span><span> </span><span>{</span><span>
    navigator</span><span>.</span><span>xr</span><span>.</span><span>isSessionSupported</span><span>(</span><span>'immersive-vr'</span><span>).</span><span>then</span><span>((</span><span>supported</span><span>)</span><span> </span><span>=&gt;</span><span> </span><span>{</span><span>
      </span><span>if</span><span> </span><span>(</span><span>supported </span><span>&amp;&amp;</span><span> navigator</span><span>.</span><span>xr</span><span>.</span><span>requestSession</span><span>)</span><span> </span><span>{</span><span>
        navigator</span><span>.</span><span>xr</span><span>.</span><span>requestSession</span><span>(</span><span>'immersive-vr'</span><span>,</span><span> </span><span>{</span><span>
          optionalFeatures</span><span>:</span><span> </span><span>[</span><span>'REQUIRED_FEATURES'</span><span>],</span><span>
        </span><span>})</span><span>
        </span><span>.</span><span>then</span><span>((</span><span>session</span><span>)</span><span> </span><span>=&gt;</span><span> </span><span>{</span><span>renderer</span><span>.</span><span>xr</span><span>.</span><span>setSession</span><span>(</span><span>session</span><span>);});</span><span>
      </span><span>}</span><span>
    </span><span>});</span><span>
  </span><span>}</span><span>
</span><span>}</span>
```

### In A-Frame

Add an event listener to the HTML file of your landing page.

For example:

```
<span>&lt;script</span><span> </span><span>type</span><span>=</span><span>"text/javascript"</span><span>&gt;</span><span>
    </span><span>const</span><span> scene </span><span>=</span><span> document</span><span>.</span><span>querySelector</span><span>(</span><span>'a-scene'</span><span>);</span><span>
    </span><span>if</span><span> </span><span>(</span><span>scene</span><span>.</span><span>hasLoaded</span><span>)</span><span> </span><span>{</span><span>
        run</span><span>();</span><span>
    </span><span>}</span><span> </span><span>else</span><span> </span><span>{</span><span>
        scene</span><span>.</span><span>addEventListener</span><span>(</span><span>'renderstart'</span><span>,</span><span> run</span><span>);</span><span>
    </span><span>}</span><span>
    </span><span>function</span><span> run</span><span>()</span><span> </span><span>{</span><span>
        scene</span><span>.</span><span>enterVR</span><span>();</span><span>
    </span><span>}</span><span>
</span><span>&lt;/script&gt;</span>
```

## Next Steps

After setting up and hosting your web app manifest, visit the [PWA Packaging](https://developers.meta.com/horizon/documentation/web/pwa-packaging) page to build your installable application.

## Frequently Asked Questions

### What are the user activation requirements for `requestSession` API?

The [XRSystem:requestSession()](https://developer.mozilla.org/en-US/docs/Web/API/XRSystem/requestSession) method requires a user activation as a security check before a WebXR session can be created. This prevents the user from being brought into an immersive WebXR session right after a WebXR page is loaded in the regular browser. In the WebXR PWA scenario, clicking the PWA app icon is considered user action to create a WebXR session for PWAs. It provides the same user experience as other immersive apps in Meta Horizon OS.

### Can I call `requestSession` after the page load only in a PWA?

Yes. Check if the [Digital Goods service](https://wicg.github.io/digital-goods/) is available before calling `requestSession` to make sure you are within a PWA scope.

```
<span>if</span><span> </span><span>(</span><span>window</span><span>.</span><span>getDigitalGoodsService </span><span>!==</span><span> </span><span>undefined</span><span>)</span><span> </span><span>{</span><span>
  </span><span>// Add your requestSession related logic here</span><span>
</span><span>}</span>
```

### How to debug WebXR PWAs on Quest devices?

You can connect the [Chrome Developer Tools](https://developers.meta.com/horizon/documentation/web/browser-remote-debugging/) from your computer to a Meta Quest device for debugging. You will be able to see your website tab being loaded in `chrome://inspect` after your WebXR PWA is launched. Click **inspect** to start debugging that tab in Browser.