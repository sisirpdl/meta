UIKitML lets you author spatial UI with familiar HTML/CSS‑like syntax. The toolchain provides:

-   `parse(text)` → JSON suitable for transport-   `interpret(parseResult)` → live UIKit components in the scene-   `generate(...)` → optional HTML/Style output for tools/round‑trip

## Language Highlights

-   Elements map to UIKit components:
    -   `<container>`, `<text>`, `<image>`, `<video>`, `<svg>`, and `<input>`.-   Classes and IDs:
    -   `class="foo bar"`, `id="menu"`; selectors are available at runtime via `UIKitDocument`.-   Conditional styles:
    -   Pseudo‑like keys: `hover`, `active`, `focus`, and responsive groups: `sm`, `md`, `lg`, `xl`, `2xl`.-   Data attributes:
    -   `data-*` are preserved onto the component’s `userData` (e.g., `data-foo` → `userData.foo`).-   Custom elements:
    -   Unknown tags become `custom` and can be mapped to actual components by providing a “kit” (constructor map) to `interpret`.

## Parsing and JSON

`parse(text, { onError })` returns an object like:

```
<span>{</span><span>
  element</span><span>:</span><span> </span><span>/* ElementJson or string */</span><span>,</span><span> </span><span>// the root element tree</span><span>
  classes</span><span>:</span><span> </span><span>{</span><span> </span><span>[</span><span>className</span><span>]:</span><span> </span><span>{</span><span> origin</span><span>?:</span><span> </span><span>string</span><span>,</span><span> content</span><span>:</span><span> </span><span>Record</span><span>&lt;</span><span>string</span><span>,</span><span> any</span><span>&gt;</span><span> </span><span>}</span><span> </span><span>},</span><span>
  ranges</span><span>:</span><span>  </span><span>{</span><span> </span><span>[</span><span>uid</span><span>]:</span><span> </span><span>{</span><span> start</span><span>:</span><span> </span><span>{</span><span> line</span><span>,</span><span> column </span><span>},</span><span> </span><span>end</span><span>:</span><span> </span><span>{</span><span> line</span><span>,</span><span> column </span><span>}</span><span> </span><span>}</span><span> </span><span>}</span><span>
</span><span>}</span>
```

This JSON is compact and safe to ship as a static file. IWSDK’s Vite plugin writes it to `public/ui/*.json`.

## Interpreting at Runtime

`interpret(parseResult, kit?)` produces a UIKit component tree. IWSDK wraps this in a `UIKitDocument` and attaches it to your entity.

```
<span>import</span><span> </span><span>{</span><span> interpret </span><span>}</span><span> </span><span>from</span><span> </span><span>'@pmndrs/uikitml'</span><span>;</span><span>
</span><span>const</span><span> rootComponent </span><span>=</span><span> interpret</span><span>(</span><span>parseResult</span><span>);</span><span> </span><span>// -&gt; UIKit component</span>
```

## Example

```
<span><span>&lt;</span><span>container</span><span>&nbsp;</span><span>id</span><span>=</span><span>"menu"</span><span>&nbsp;</span><span>class</span><span>=</span><span>"panel"</span><span>&nbsp;</span><span>style</span><span>=</span><span>"padding:&nbsp;12;&nbsp;gap:&nbsp;8"</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;</span><span>&lt;</span><span>text</span><span>&nbsp;</span><span>class</span><span>=</span><span>"title"</span><span>&nbsp;</span><span>style</span><span>=</span><span>"fontSize:&nbsp;24"</span><span>&gt;</span><span>Settings</span><span>&lt;/</span><span>text</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;</span><span>&lt;</span><span>container</span><span>&nbsp;</span><span>class</span><span>=</span><span>"row"</span><span>&nbsp;</span><span>style</span><span>=</span><span>"flexDirection:&nbsp;row;&nbsp;gap:&nbsp;6"</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>&lt;</span><span>text</span><span>&gt;</span><span>Music</span><span>&lt;/</span><span>text</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>&lt;</span><span>input</span><span>&nbsp;</span><span>id</span><span>=</span><span>"music"</span><span>&nbsp;</span><span>/&gt;</span></span><br><span><span>&nbsp;&nbsp;</span><span>&lt;/</span><span>container</span><span>&gt;</span></span><br><span><span>&lt;/</span><span>container</span><span>&gt;</span></span><br><span><span></span></span><br>
```

With a class block:

```
<span><span>.panel</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>backgroundcolor:</span><span>&nbsp;</span><span>rgba(</span><span>0</span><span>,&nbsp;</span><span>0</span><span>,&nbsp;</span><span>0</span><span>,&nbsp;</span><span>0.6</span><span>)</span><span>;</span></span><br><span><span>&nbsp;&nbsp;</span><span>sm:</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>padding</span><span>:&nbsp;</span><span>8</span><span>;</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>}</span></span><br><span><span>.title</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>hover:</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>color</span><span>:&nbsp;</span><span>#fff</span><span>;</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

-   Inline `style` vs class blocks:
    -   Inline `style` is merged with class styles; conditionals under `style` (e.g., `hover`, `sm`) are supported and serialized separately.-   `<style>` blocks in UIKitML:
    -   The parser extracts `.class` and `#id` rules from `<style>` tags and merges them into `classes` with `origin` metadata.-   Property names are camelCase (e.g., `backgroundColor`, `fontSize`) to align with JavaScript style objects.-   Strings vs numbers:
    -   Numeric values are in UIKit units (cm). Colors accept CSS‑like strings (e.g., `#fff`, `rgba(...)`).

## Conditional Precedence

-   Base styles apply first, then conditional groups are layered at runtime:
    -   Order of application: base → responsive group (`sm..2xl`) → interactive (`hover`, `focus`, `active`).-   Use class composition to avoid deep inline conditionals when multiple states combine.

## Custom Components with a Kit

You can map unknown tags to custom UIKit components using a kit:

```
<span>import</span><span> </span><span>{</span><span> interpret </span><span>}</span><span> </span><span>from</span><span> </span><span>'@pmndrs/uikitml'</span><span>;</span><span>
</span><span>import</span><span> </span><span>{</span><span> </span><span>Component</span><span> </span><span>}</span><span> </span><span>from</span><span> </span><span>'@pmndrs/uikit'</span><span>;</span><span>

</span><span>class</span><span> </span><span>Gauge</span><span> </span><span>extends</span><span> </span><span>Component</span><span> </span><span>{</span><span>
  </span><span>/* ... */</span><span>
</span><span>}</span><span>

</span><span>const</span><span> kit </span><span>=</span><span> </span><span>{</span><span> gauge</span><span>:</span><span> </span><span>Gauge</span><span> </span><span>};</span><span> </span><span>// tag &lt;gauge&gt; maps to Gauge</span><span>
</span><span>const</span><span> root </span><span>=</span><span> interpret</span><span>(</span><span>parseResult</span><span>,</span><span> kit</span><span>);</span>
```

Unknown tags without a kit entry fall back to `Container` and store `userData.customElement` for inspection.

-   `ranges` link elements to source lines/columns (useful for editor overlays and inspector panels).-   The parser injects `data-uid` attributes for stable identification during authoring; the generator strips them for clean output if you round‑trip.-   The Vite plugin will log parse errors with filenames and minimal context; turn on `verbose: true` for more detail.

## Best Practices

-   Prefer classes for reusable styling; use IDs for unique elements you’ll query at runtime.-   Keep media references (`src`) relative to your public assets; the interpreter preserves them into UIKit properties.-   Avoid overly deep nesting; flat, flex‑oriented hierarchies layout faster and are easier to animate.