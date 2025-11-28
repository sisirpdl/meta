`UIKitDocument` wraps the interpreted UIKit component tree in a `THREE.Group` and exposes DOM‑like query helpers and sizing utilities.

## What It Provides

-   DOM‑like queries:
    -   `getElementById(id)`-   `getElementsByClassName(name)`-   `querySelector(selector)` / `querySelectorAll(selector)`-   Simple selectors supported: `#id`, `.class`, and descendant combinators like `#parent .child`.-   Physical sizing in meters:
    -   `setTargetDimensions(widthMeters, heightMeters)` computes a uniform scale from the component’s intrinsic cm size.-   Keeps aspect ratio stable; ideal for XR where 1 unit = 1 meter.-   Lifecycle:
    -   A `dispose()` method cleans up signals and components.

## Using with IWSDK Systems

-   `PanelUISystem` loads JSON, interprets it, creates `UIKitDocument`, and attaches it to your entity’s `object3D`.-   `ScreenSpaceUISystem` re‑parents the document under the camera with CSS‑like positioning when XR is not presenting.-   Pointer events are forwarded (configurable) so UI elements receive hover/active/focus state.

## Examples

Querying by ID and class:

```
<span>// Access the document from the entity’s PanelDocument component</span><span>
</span><span>const</span><span> doc </span><span>=</span><span> entity</span><span>.</span><span>getValue</span><span>(</span><span>PanelDocument</span><span>,</span><span> </span><span>'document'</span><span>);</span><span> </span><span>// UIKitDocument</span><span>

</span><span>const</span><span> button </span><span>=</span><span> doc</span><span>.</span><span>getElementById</span><span>(</span><span>'start'</span><span>);</span><span>
</span><span>const</span><span> rows </span><span>=</span><span> doc</span><span>.</span><span>getElementsByClassName</span><span>(</span><span>'row'</span><span>);</span><span>

</span><span>// Descendant query</span><span>
</span><span>const</span><span> label </span><span>=</span><span> doc</span><span>.</span><span>querySelector</span><span>(</span><span>'#menu .title'</span><span>);</span>
```

Setting a physical target size (meters):

```
<span>doc</span><span>.</span><span>setTargetDimensions</span><span>(</span><span>1.0</span><span>,</span><span> </span><span>0.6</span><span>);</span><span> </span><span>// ~1m wide panel, height constrained to aspect</span>
```

## How Sizing Works

-   UIKit components report an intrinsic size in centimeters (via their `size` signal).-   `UIKitDocument` converts target meters to a uniform scale:
    -   `uiWidthMeters = intrinsicWidthCm / 100`-   `scale = min(targetWidth / uiWidthMeters, targetHeight / uiHeightMeters)`-   The scale is applied to the `Group` (document), not individual components, preserving internal layout.

## Selectors and Limitations

-   Supported: `#id`, `.class`, descendant combinators (e.g., `#menu .row .button`).-   Not supported: attribute selectors, pseudo‑classes beyond UIKit state (`hover`, `active`, `focus`).-   Performance: cache query results you reuse in systems; avoid repeated deep queries inside per‑frame loops.

## Integrating Interactions

-   Pointer events forwarded by IWSDK will toggle `hover/active/focus` state on elements, which in turn applies conditional styles.-   For custom behavior, subscribe to your ECS input/pointer systems and call methods or set properties on matched components.

```
<span>const</span><span> start </span><span>=</span><span> doc</span><span>.</span><span>getElementById</span><span>(</span><span>'start'</span><span>);</span><span>
</span><span>// Example: toggle a class on app state change</span><span>
</span><span>if</span><span> </span><span>(</span><span>isLocked</span><span>)</span><span> start</span><span>?.</span><span>classList</span><span>.</span><span>add</span><span>(</span><span>'disabled'</span><span>);</span><span>
</span><span>else</span><span> start</span><span>?.</span><span>classList</span><span>.</span><span>remove</span><span>(</span><span>'disabled'</span><span>);</span>
```

## Lifecycle and Cleanup

-   When removing a panel, call `dispose()` (done by `PanelUISystem.cleanupPanel`) to detach listeners and release resources.-   After disposal, references to components are invalid; re‑query after re‑creating the document.

## Debugging Tips

-   Log `doc.toString()` to see element/class counts and computed sizes.-   Use IDs and class names consistently in `.uikitml` so selectors remain stable during iteration.