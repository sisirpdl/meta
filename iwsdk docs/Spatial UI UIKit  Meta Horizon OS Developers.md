UIKit is a native 3D UI runtime built on Three.js with Yoga (Flexbox) layout. It targets XR‑grade performance and predictable, web‑like layout semantics.

## Core Ideas

-   Web‑aligned layout: Yoga implements Flexbox. Properties map closely to CSS (e.g., `flexDirection`, `gap`, `padding`).-   Crisp text: MSDF text rendering with instancing for thousands of glyphs efficiently.-   Batching and instancing: Panels and glyphs are grouped to minimize draw calls.-   Event‑ready components: Works with pointer events (hover/active/focus conditionals).

## Units and Sizing

-   UIKit component intrinsic sizes are in centimeters (cm).-   IWSDK’s `UIKitDocument` takes target width/height in meters and computes a uniform scale so your UI fits the desired physical size in XR.

## Key Components

-   `Container` — generic layout node (flex)-   `Text` — MSDF text with wrapping-   `Image` / `Video` / `Svg` — media and vector content-   `Input` / `Textarea` — basic UI controls

## Performance Characteristics

-   Panels are instanced; materials and meshes are reused where possible.-   Glyphs are batched; updates run in the main animation loop with minimal allocations.-   Transparent sorting should be set to a stable painter order for readability. IWSDK’s `PanelUISystem` configures `reversePainterSortStable` for you.

## Using UIKit Directly (Three.js)

Most IWSDK apps won’t use UIKit directly; they will use UIKitML + SDK systems. For reference, raw UIKit usage looks like:

```
<span>import</span><span> </span><span>{</span><span> </span><span>Root</span><span>,</span><span> </span><span>Container</span><span>,</span><span> </span><span>Text</span><span>,</span><span> reversePainterSortStable </span><span>}</span><span> </span><span>from</span><span> </span><span>'@pmndrs/uikit'</span><span>;</span><span>

</span><span>const</span><span> root </span><span>=</span><span> </span><span>new</span><span> </span><span>Root</span><span>(</span><span>camera</span><span>,</span><span> renderer</span><span>,</span><span> </span><span>{</span><span>
  width</span><span>:</span><span> </span><span>1000</span><span>,</span><span>
  height</span><span>:</span><span> </span><span>500</span><span>,</span><span>
  padding</span><span>:</span><span> </span><span>10</span><span>,</span><span>
</span><span>});</span><span>
scene</span><span>.</span><span>add</span><span>(</span><span>root</span><span>);</span><span>

</span><span>const</span><span> panel </span><span>=</span><span> </span><span>new</span><span> </span><span>Container</span><span>({</span><span> flexDirection</span><span>:</span><span> </span><span>'row'</span><span>,</span><span> gap</span><span>:</span><span> </span><span>8</span><span> </span><span>});</span><span>
panel</span><span>.</span><span>add</span><span>(</span><span>new</span><span> </span><span>Text</span><span>({</span><span> text</span><span>:</span><span> </span><span>'Hello XR'</span><span> </span><span>}));</span><span>
root</span><span>.</span><span>add</span><span>(</span><span>panel</span><span>);</span><span>

renderer</span><span>.</span><span>setTransparentSort</span><span>(</span><span>reversePainterSortStable</span><span>);</span><span>
renderer</span><span>.</span><span>setAnimationLoop</span><span>((</span><span>t</span><span>)</span><span> </span><span>=&gt;</span><span> root</span><span>.</span><span>update</span><span>(</span><span>t</span><span>));</span>
```

## In IWSDK

-   You typically don’t construct `Root` yourself.-   Author UI in `.uikitml`; the SDK interprets it into UIKit components at runtime, wraps it in a `UIKitDocument`, and manages size and placement.-   Pointer events are bridged automatically (configurable).

## Layout Mapping (CSS → Yoga)

-   Common properties supported in styles:
    -   `flexDirection`, `justifyContent`, `alignItems`, `gap`, `padding`, `margin`, `flexGrow`, `flexShrink`, `flexBasis`, `width`, `height`, `minWidth`, `minHeight`, `maxWidth`, `maxHeight`.-   Measurement:
    -   Numbers map to UIKit units (cm). For world‑space results in meters, use `UIKitDocument.setTargetDimensions(...)`.-   Conditional variants:
    -   UIKit supports conditional style groups (`hover`, `active`, `focus`, `sm..2xl`) that toggle based on state and media hints.

## Text System Details

-   MSDF text preserves edge sharpness across scales and distances.-   Wrapping options: word‑wrap and break‑all wrappers are available.-   Font management: use `@pmndrs/msdfonts`; glyphs are instanced for performance.

## Interactivity Model

-   Elements track state: `hover`, `active`, `focus` influence styles declaratively.-   Pointer events are delivered via IWSDK’s input bridge; you can also subscribe to component signals if needed.-   Best practice: keep visual state in UI styles; run gameplay logic in ECS systems responding to events.

-   Panels support local clipping for nested scroll regions.-   Layering is handled via a stable painter’s algorithm (`reversePainterSortStable`).-   For overlapping translucent UI, prefer fewer material variants and consistent z‑ordering to reduce flicker risk.

## Theming and Class Lists

-   Components expose a `classList`. Toggle classes to switch visual states or themes at runtime.

```
<span>const</span><span> doc </span><span>=</span><span> entity</span><span>.</span><span>getValue</span><span>(</span><span>PanelDocument</span><span>,</span><span> </span><span>'document'</span><span>);</span><span>
</span><span>const</span><span> card </span><span>=</span><span> doc</span><span>?.</span><span>querySelector</span><span>(</span><span>'.card'</span><span>);</span><span>
card</span><span>?.</span><span>classList</span><span>.</span><span>add</span><span>(</span><span>'selected'</span><span>);</span>
```

## Performance Tips

-   Avoid per‑frame allocation in event handlers; reuse objects and precompute selectors.-   Keep image/video resolutions reasonable for intended panel size.-   Prefer style/class changes over rebuilding component subtrees.