Input visuals render the user’s controllers or hands and keep them animated from live input. IWSDK separates “adapters” (WebXR + scene wiring) from “implementations” (how the model looks and animates).

## Architecture

-   Adapters (per side):
    -   `XRControllerVisualAdapter`-   `XRHandVisualAdapter`-   Responsibilities:
        -   Connect/disconnect to `XRInputSource`.-   Keep `visual.model` aligned to the current grip space.-   Choose a visual implementation and asset based on input profile.-   Expose `isPrimary` and hook into `XROrigin` spaces.-   Implementations:
    -   `AnimatedController` — animates buttons/axes using the WebXR Input Profile’s visual responses; uses `FlexBatchedMesh` for draw‑call reduction.-   `AnimatedHand` — skinned hand with an outline pass (stencil + back‑face); updates joints from `fillPoses`.-   `AnimatedControllerHand` — a controller‑holding hand that blends toward a “pressed” pose from button values.

## Using visuals

Visuals are created automatically by `XRInputManager` when an input source appears. Add the origin to your scene and call `update` each frame.

```
<span>import</span><span> </span><span>{</span><span> </span><span>XRInputManager</span><span> </span><span>}</span><span> </span><span>from</span><span> </span><span>'@iwsdk/xr-input'</span><span>;</span><span>

</span><span>const</span><span> xrInput </span><span>=</span><span> </span><span>new</span><span> </span><span>XRInputManager</span><span>({</span><span> scene</span><span>,</span><span> camera </span><span>});</span><span>
scene</span><span>.</span><span>add</span><span>(</span><span>xrInput</span><span>.</span><span>xrOrigin</span><span>);</span><span>

renderer</span><span>.</span><span>setAnimationLoop</span><span>((</span><span>t</span><span>)</span><span> </span><span>=&gt;</span><span> </span><span>{</span><span>
  xrInput</span><span>.</span><span>update</span><span>(</span><span>renderer</span><span>.</span><span>xr</span><span>,</span><span> clock</span><span>.</span><span>getDelta</span><span>(),</span><span> t </span><span>/</span><span> </span><span>1000</span><span>);</span><span>
  renderer</span><span>.</span><span>render</span><span>(</span><span>scene</span><span>,</span><span> camera</span><span>);</span><span>
</span><span>});</span>
```

By default, controllers use `AnimatedController` and hands use `AnimatedHand`. Only the “primary” source per side is visible; secondary sources are tracked but hidden.

## Swapping visual implementations

You can switch an adapter to a different implementation class at runtime. This keeps the WebXR wiring and swaps the rendering logic.

```
<span>import</span><span> </span><span>{</span><span> </span><span>AnimatedControllerHand</span><span> </span><span>}</span><span> </span><span>from</span><span> </span><span>'@iwsdk/xr-input'</span><span>;</span><span>

</span><span>// Replace the controller visual with a controller-hand hybrid on the right hand</span><span>
</span><span>const</span><span> rightController </span><span>=</span><span> xrInput</span><span>.</span><span>visualAdapters</span><span>.</span><span>controller</span><span>.</span><span>right</span><span>;</span><span>
rightController</span><span>.</span><span>updateVisualImplementation</span><span>(</span><span>AnimatedControllerHand</span><span>);</span>
```

Implementation classes must follow the `VisualImplementation` interface and usually extend `BaseControllerVisual` or `BaseHandVisual`.

## Customizing asset loading (CDN, cache, etc.)

Adapters fetch assets via an `XRAssetLoader` (default uses `GLTFLoader`). Provide your own to change source or add caching.

```
<span>import</span><span> type </span><span>{</span><span> GLTF </span><span>}</span><span> </span><span>from</span><span> </span><span>'three/examples/jsm/loaders/GLTFLoader.js'</span><span>;</span><span>

</span><span>const</span><span> assetLoader </span><span>=</span><span> </span><span>{</span><span>
  </span><span>async</span><span> loadGLTF</span><span>(</span><span>assetPath</span><span>:</span><span> </span><span>string</span><span>):</span><span> </span><span>Promise</span><span>&lt;</span><span>GLTF</span><span>&gt;</span><span> </span><span>{</span><span>
    </span><span>// Implement your fetch policy here: local cache, versioned CDN, etc.</span><span>
    </span><span>return</span><span> </span><span>await</span><span> </span><span>new</span><span> </span><span>GLTFLoader</span><span>().</span><span>loadAsync</span><span>(</span><span>assetPath</span><span>);</span><span>
  </span><span>},</span><span>
</span><span>};</span><span>

</span><span>const</span><span> xrInput </span><span>=</span><span> </span><span>new</span><span> </span><span>XRInputManager</span><span>({</span><span> scene</span><span>,</span><span> camera</span><span>,</span><span> assetLoader </span><span>});</span>
```

## How profiles pick visuals

-   Controllers: the adapter reads the `XRInputSource.profiles` list and resolves a WebXR Input Profile JSON. From that it gets:
    -   `layout` (per handedness) including component indices and visual response nodes.-   `assetPath` suggestion for GLTF; the adapter constructs `https://cdn.jsdelivr.net/.../<profileId>/<left|right>.glb` unless overridden.-   Hands: a default “generic hand” layout is used; hand joints are updated via `XRFrame.fillPoses`.

Note: The repo prebuild script generates `generated-profiles.ts` so profiles are available at runtime without network requests for JSON.

## Build your own visual

Start from one of the base classes:

```
<span>import</span><span> </span><span>{</span><span> </span><span>Group</span><span>,</span><span> </span><span>MeshStandardMaterial</span><span> </span><span>}</span><span> </span><span>from</span><span> </span><span>'three'</span><span>;</span><span>
</span><span>import</span><span> </span><span>{</span><span> </span><span>BaseControllerVisual</span><span> </span><span>}</span><span> </span><span>from</span><span> </span><span>'@iwsdk/xr-input'</span><span>;</span><span>

</span><span>export</span><span> </span><span>class</span><span> </span><span>MyControllerVisual</span><span> </span><span>extends</span><span> </span><span>BaseControllerVisual</span><span> </span><span>{</span><span>
  init</span><span>()</span><span> </span><span>{</span><span>
    </span><span>// Called once after GLTF is loaded</span><span>
    </span><span>this</span><span>.</span><span>model</span><span>.</span><span>traverse</span><span>((</span><span>n</span><span>)</span><span> </span><span>=&gt;</span><span> </span><span>{</span><span>
      </span><span>// material tweaks, batching, etc.</span><span>
      </span><span>if</span><span> </span><span>((</span><span>n </span><span>as</span><span> any</span><span>).</span><span>isMesh</span><span>)</span><span> </span><span>(</span><span>n </span><span>as</span><span> any</span><span>).</span><span>material </span><span>=</span><span> </span><span>new</span><span> </span><span>MeshStandardMaterial</span><span>();</span><span>
    </span><span>});</span><span>
  </span><span>}</span><span>
  update</span><span>(</span><span>dt</span><span>:</span><span> number</span><span>)</span><span> </span><span>{</span><span>
    </span><span>if</span><span> </span><span>(!</span><span>this</span><span>.</span><span>gamepad </span><span>||</span><span> </span><span>!</span><span>this</span><span>.</span><span>model</span><span>.</span><span>visible</span><span>)</span><span> </span><span>return</span><span>;</span><span>
    </span><span>// Read button/axis values from this.gamepad and animate nodes</span><span>
  </span><span>}</span><span>
</span><span>}</span><span>
</span><span>MyControllerVisual</span><span>.</span><span>assetKeyPrefix </span><span>=</span><span> </span><span>'my-controller'</span><span>;</span>
```

Then instruct an adapter to use it:

```
<span>xrInput</span><span>.</span><span>visualAdapters</span><span>.</span><span>controller</span><span>.</span><span>left</span><span>.</span><span>updateVisualImplementation</span><span>(</span><span>
  </span><span>MyControllerVisual</span><span>,</span><span>
</span><span>);</span>
```

Guidelines:

-   Cache keys: set a unique `assetKeyPrefix` and optionally `assetProfileId`/`assetPath` if you want a custom asset per profile/handedness. The loader caches visuals per `assetKeyPrefix-profileId-handedness`.-   Keep your GLTF skeleton/joint names consistent with layout or your update code.-   For hands, ensure your skinned mesh disables frustum culling and consider an outline pass for legibility.

## Toggling visibility

You can enable/disable visuals without disconnecting the adapter:

```
<span>// Controller visuals off, logic continues to run</span><span>
xrInput</span><span>.</span><span>visualAdapters</span><span>.</span><span>controller</span><span>.</span><span>left</span><span>.</span><span>toggleVisual</span><span>(</span><span>false</span><span>);</span><span>

</span><span>// Hand visuals on</span><span>
xrInput</span><span>.</span><span>visualAdapters</span><span>.</span><span>hand</span><span>.</span><span>left</span><span>.</span><span>toggleVisual</span><span>(</span><span>true</span><span>);</span>
```

## Troubleshooting

-   Seeing the wrong controller model: check the runtime‑reported profile list in devtools (`inputSource.profiles`) and whether your adapter’s `assetProfileId` forces a specific one.-   Models appear but don’t animate: confirm the layout’s `visualResponses` node names exist in your GLTF and that `Gamepad` is present on the input source.-   Hands not moving: some runtimes lack the optional `XRFrame.fillPoses`. Consider a fallback to per‑joint `getJointPose` if targeting those.