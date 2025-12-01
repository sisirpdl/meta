This chapter teaches you how to create immersive spatial user interfaces using [pmndrs/uikit](https://pmndrs.github.io/uikit/docs/), specifically uikitml – IWSDK’s spatial UI system.

## What You’ll Learn

By the end of this chapter, you’ll be able to:

-   Understand spatial UI design principles-   Create UI layouts using UIKitML markup-   Position and scale interfaces in 3D space-   Handle user interactions with spatial UI elements-   Implement common UI patterns for WebXR

## Spatial UI Principles

Great spatial interfaces follow these principles:

-   **World-scale**: UI elements have a physical presence in 3D space-   **Natural interaction**: Use pointing, grabbing, and gestures-   **Readable at distance**: Text and icons scale appropriately-   **Contextual placement**: UI appears near relevant objects-   **Comfortable viewing**: Positioned to avoid neck strain

## Introduction to Building Spatial User Interfaces in IWSDK

The unavailability of HTML in WebXR has been a big challenge for developers, since manually placing user interface elements is very cumbersome. That’s why IWSDK uses [pmndrs/uikit](https://pmndrs.github.io/uikit/docs/), a GPU-accelerated UI rendering system that provides an API aligned with HTML and CSS, allowing developers to feel right at home. To make UI authoring even more natural, IWSDK uses the [uikitml](https://github.com/pmndrs/uikitml) language, which allows developers to write user interfaces using an HTML-like syntax, including features such as CSS classes. This integration allows IWSDK developers to reuse their HTML knowledge to quickly build high-performance, GPU-accelerated user interfaces for WebXR. Furthermore, IWSDK makes use of the pre-built component collections offered by the uikit project: the Default Kit (based on shadcn) and the Horizon Kit (based on the Reality Labs Design System).

### Key Features

-   **Declarative markup**: Describe UI structure, not implementation-   **3D layout system**: Flexbox-like layouts in 3D space-   **Component Kits**: Pre-built buttons, panels, sliders, etc.-   **Event system**: Handle clicks, hovers, and other interactions-   **Theming support**: Consistent styling across your application

### Basic Syntax

UIKitML uses HTML-style markup with CSS properties for styling and layouting:

```
<span><span>&lt;!--&nbsp;Basic&nbsp;panel&nbsp;with&nbsp;text&nbsp;--&gt;</span></span><br><span><span>&lt;</span><span>div</span><span>&nbsp;</span><span>class</span><span>=</span><span>"panel"</span><span>&nbsp;</span><span>style</span><span>=</span><span>"width:&nbsp;400;&nbsp;height:300;&nbsp;background-color:&nbsp;#2a2a2a</span><span>"</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;</span><span>&lt;</span><span>text</span><span>&nbsp;</span><span>style</span><span>=</span><span>"fontSize:24px;&nbsp;color:&nbsp;white"</span><span>&gt;</span><span>Hello&nbsp;WebXR!</span><span>&lt;/</span><span>text</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;</span><span>&lt;</span><span>button</span><span>&gt;</span><span>Click&nbsp;Me</span><span>&lt;/</span><span>button</span><span>&gt;</span></span><br><span><span>&lt;/</span><span>panel</span><span>&gt;</span></span><br><span><span></span></span><br>
```

## Setting Up UIKitML with IWSDK

### Vite Plugin Configuration

IWSDK includes a Vite plugin that compiles UIKitML files:

```
<span><span>//&nbsp;vite.config.js</span></span><br><span><span>import</span><span>&nbsp;{&nbsp;defineConfig&nbsp;}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'vite'</span><span>;</span></span><br><span><span>import</span><span>&nbsp;{&nbsp;uikitml&nbsp;}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'@iwsdk/vite-plugin-uikitml'</span><span>;</span></span><br><span><span></span></span><br><span><span>export</span><span>&nbsp;</span><span>default</span><span>&nbsp;defineConfig({</span></span><br><span><span>&nbsp;&nbsp;plugins:&nbsp;[</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;uikitml({</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;File&nbsp;extensions&nbsp;to&nbsp;process</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;include:&nbsp;[</span><span>'**/*.uikitml'</span><span>],</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Hot&nbsp;reload&nbsp;during&nbsp;development</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hotReload:&nbsp;</span><span>true</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;}),</span></span><br><span><span>&nbsp;&nbsp;],</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

### Creating Your First UIKitML File

Create `src/ui/main-menu.uikitml` and insert the following content, which uses the Panel, Button, ButtonIcon, and LoginIcon components from the Horizon Kit to design a panel with a button:

```
<span><span>&lt;</span><span>style</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;</span><span>.panel-root</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>padding:</span><span>&nbsp;</span><span>16px</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>flex-direction:</span><span>&nbsp;</span><span>column</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>width:</span><span>&nbsp;</span><span>344px</span><span>;</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>&lt;/</span><span>style</span><span>&gt;</span></span><br><span><span>&lt;</span><span>Panel</span><span>&nbsp;</span><span>class</span><span>=</span><span>"panel-root"</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;</span><span>&lt;</span><span>Button</span><span>&nbsp;</span><span>id</span><span>=</span><span>"xr-button"</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>&lt;</span><span>ButtonIcon</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>&lt;</span><span>LoginIcon</span><span>&gt;&lt;/</span><span>LoginIcon</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>&lt;/</span><span>ButtonIcon</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;Enter&nbsp;XR</span></span><br><span><span>&nbsp;&nbsp;</span><span>&lt;/</span><span>Button</span><span>&gt;</span></span><br><span><span>&lt;/</span><span>Panel</span><span>&gt;</span></span><br><span><span></span></span><br>
```

### Loading UI in Your Application

We can add our `panelWithButton` uikitml user interface to our IWSDK scene using the `PanelUI` and `PanelDocument` components:

```
<span><span>export</span><span>&nbsp;</span><span>class</span><span>&nbsp;</span><span>PanelSystem</span><span>&nbsp;</span><span>extends</span><span>&nbsp;createSystem({</span></span><br><span><span>&nbsp;&nbsp;panelWithButton:&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;required:&nbsp;[</span><span>PanelUI</span><span>,&nbsp;</span><span>PanelDocument</span><span>],</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;where:&nbsp;[eq(</span><span>PanelUI</span><span>,&nbsp;</span><span>"config"</span><span>,&nbsp;</span><span>"/ui/main-menu.json"</span><span>)],</span></span><br><span><span>&nbsp;&nbsp;},</span></span><br><span><span>})&nbsp;{}</span></span><br><span><span></span></span><br>
```

### Adding Component Kits to Your Spatial User Interface

If you’d like to use a different or additional component kit for your uikitml file, you can configure the kits in the `spatialUI` feature list when creating a `World`:

```
<span><span>import</span><span>&nbsp;*&nbsp;</span><span>as</span><span>&nbsp;horizonKit&nbsp;</span><span>from</span><span>&nbsp;</span><span>"@pmndrs/uikit-horizon"</span><span>;</span></span><br><span><span></span></span><br><span><span>World</span><span>.create(document.getElementById(</span><span>"scene-container"</span><span>),&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;...</span></span><br><span><span>&nbsp;&nbsp;features:&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;...</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;spatialUI:&nbsp;{&nbsp;kits:&nbsp;[horizonKit]&nbsp;},</span></span><br><span><span>&nbsp;&nbsp;},</span></span><br><span><span>})</span></span><br><span><span></span></span><br>
```

## Overview of Properties and Features Available for Building Spatial User Interfaces

When authoring a User Interface with IWSDK, developers can use almost all the features they know and love from HTML. The following section shows all the available element types and styling methods for designing Spatial User Interfaces.

### Element Types

#### Container Elements

Most HTML elements become containers that can hold children and text.

```
<span><span>&lt;</span><span>div</span><span>&gt;</span><span>Layout&nbsp;container</span><span>&lt;/</span><span>div</span><span>&gt;</span></span><br><span><span>&lt;</span><span>p</span><span>&gt;</span><span>Paragraph&nbsp;text</span><span>&lt;/</span><span>p</span><span>&gt;</span></span><br><span><span>&lt;</span><span>h1</span><span>&gt;</span><span>Main&nbsp;heading</span><span>&lt;/</span><span>h1</span><span>&gt;</span></span><br><span><span>&lt;</span><span>button</span><span>&gt;</span><span>Click&nbsp;me</span><span>&lt;/</span><span>button</span><span>&gt;</span></span><br><span><span>&lt;</span><span>ul</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;</span><span>&lt;</span><span>li</span><span>&gt;</span><span>List&nbsp;item</span><span>&lt;/</span><span>li</span><span>&gt;</span></span><br><span><span>&lt;/</span><span>ul</span><span>&gt;</span></span><br><span><span></span></span><br>
```

#### Image Elements

Display bitmap images in your 3D UI.

```
<span><span>&lt;</span><span>img</span><span>&nbsp;</span><span>src</span><span>=</span><span>"photo.jpg"</span><span>&nbsp;</span><span>alt</span><span>=</span><span>"Description"</span><span>&nbsp;</span><span>/&gt;</span></span><br><span><span>&lt;</span><span>img</span><span>&nbsp;</span><span>src</span><span>=</span><span>"icon.png"</span><span>&nbsp;</span><span>class</span><span>=</span><span>"avatar"</span><span>&nbsp;</span><span>/&gt;</span></span><br><span><span>&lt;</span><span>img</span><span>&nbsp;</span><span>src</span><span>=</span><span>"icon.svg"</span><span>&nbsp;</span><span>/&gt;</span></span><br><span><span></span></span><br>
```

**Required:**`src` attribute

#### Inline SVG Elements

Embed SVG markup directly in your UI.

```
<span><span>&lt;</span><span>svg</span><span>&nbsp;</span><span>viewBox</span><span>=</span><span>"0&nbsp;0&nbsp;100&nbsp;100"</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;</span><span>&lt;</span><span>circle</span><span>&nbsp;</span><span>cx</span><span>=</span><span>"50"</span><span>&nbsp;</span><span>cy</span><span>=</span><span>"50"</span><span>&nbsp;</span><span>r</span><span>=</span><span>"40"</span><span>&nbsp;</span><span>fill</span><span>=</span><span>"blue"</span><span>/&gt;</span></span><br><span><span>&nbsp;&nbsp;</span><span>&lt;</span><span>rect</span><span>&nbsp;</span><span>x</span><span>=</span><span>"10"</span><span>&nbsp;</span><span>y</span><span>=</span><span>"10"</span><span>&nbsp;</span><span>width</span><span>=</span><span>"30"</span><span>&nbsp;</span><span>height</span><span>=</span><span>"30"</span><span>&nbsp;</span><span>fill</span><span>=</span><span>"red"</span><span>/&gt;</span></span><br><span><span>&lt;/</span><span>svg</span><span>&gt;</span></span><br><span><span></span></span><br>
```

**Content:** Raw SVG markup is preserved and rendered

#### Video Elements

Display video content with standard HTML5 video attributes.

```
<span><span>&lt;</span><span>video</span><span>&nbsp;</span><span>src</span><span>=</span><span>"movie.mp4"</span><span>&nbsp;</span><span>controls</span><span>&nbsp;</span><span>autoplay</span><span>&nbsp;</span><span>/&gt;</span></span><br><span><span>&lt;</span><span>video</span><span>&nbsp;</span><span>src</span><span>=</span><span>"demo.webm"</span><span>&nbsp;</span><span>loop</span><span>&nbsp;</span><span>muted</span><span>&nbsp;</span><span>/&gt;</span></span><br><span><span></span></span><br>
```

**Required:**`src` attribute **Supports:** All standard HTML5 video attributes

#### Input Elements

Create interactive input fields for user data.

```
<span><span>&lt;</span><span>input</span><span>&nbsp;</span><span>type</span><span>=</span><span>"text"</span><span>&nbsp;</span><span>placeholder</span><span>=</span><span>"Enter&nbsp;your&nbsp;name"</span><span>&nbsp;</span><span>/&gt;</span></span><br><span><span>&lt;</span><span>input</span><span>&nbsp;</span><span>type</span><span>=</span><span>"email"</span><span>&nbsp;</span><span>value</span><span>=</span><span>"user@example.com"</span><span>&nbsp;</span><span>/&gt;</span></span><br><span><span>&lt;</span><span>textarea</span><span>&nbsp;</span><span>placeholder</span><span>=</span><span>"Multi-line&nbsp;text&nbsp;input"</span><span>&gt;</span><span>Default&nbsp;content</span><span>&lt;/</span><span>textarea</span><span>&gt;</span></span><br><span><span></span></span><br>
```

#### Component Kits

In addition to these elements, developers can also use the installed kits.

```
<span><span>&lt;</span><span>Button</span><span>&nbsp;</span><span>id</span><span>=</span><span>"xr-button"</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;</span><span>&lt;</span><span>ButtonIcon</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>&lt;</span><span>LoginIcon</span><span>&gt;&lt;/</span><span>LoginIcon</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;</span><span>&lt;/</span><span>ButtonIcon</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;Enter&nbsp;XR</span></span><br><span><span>&lt;/</span><span>Button</span><span>&gt;</span></span><br><span><span></span></span><br>
```

## Styling System

### Inline Styles

Use familiar CSS properties with kebab-casing directly on elements:

```
<span><span>&lt;</span><span>div</span><span>&nbsp;</span><span>style</span><span>=</span><span>"background-color:&nbsp;blue;&nbsp;padding:&nbsp;20px;&nbsp;border-rad</span><span>ius:&nbsp;8px;"</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;Styled&nbsp;container</span></span><br><span><span>&lt;/</span><span>div</span><span>&gt;</span></span><br><span><span></span></span><br>
```

### CSS Classes

Define reusable styles with full pseudo-selector support using the `<style>` tag:

```
<span><span>&lt;</span><span>style</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;</span><span>.button</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>background-color:</span><span>&nbsp;</span><span>#3b82f6</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>color:</span><span>&nbsp;</span><span>white</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>padding:</span><span>&nbsp;</span><span>12px</span><span>&nbsp;</span><span>24px</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>border-radius:</span><span>&nbsp;</span><span>6px</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>cursor:</span><span>&nbsp;</span><span>pointer</span><span>;</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>&nbsp;&nbsp;</span></span><br><span><span>&nbsp;&nbsp;</span><span>.button:hover</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>background-color:</span><span>&nbsp;</span><span>#2563eb</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>transform:</span><span>&nbsp;</span><span>scale(</span><span>1.05</span><span>)</span><span>;</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>&nbsp;&nbsp;</span></span><br><span><span>&nbsp;&nbsp;</span><span>.button:active</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>background-color:</span><span>&nbsp;</span><span>#1d4ed8</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>transform:</span><span>&nbsp;</span><span>scale(</span><span>0.95</span><span>)</span><span>;</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>&nbsp;&nbsp;</span></span><br><span><span>&nbsp;&nbsp;</span><span>/*&nbsp;Responsive&nbsp;styles&nbsp;*/</span></span><br><span><span>&nbsp;&nbsp;</span><span>.button:sm</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>padding:</span><span>&nbsp;</span><span>8px</span><span>&nbsp;</span><span>16px</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>font-size:</span><span>&nbsp;</span><span>14px</span><span>;</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>&nbsp;&nbsp;</span></span><br><span><span>&nbsp;&nbsp;</span><span>.button:lg</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>padding:</span><span>&nbsp;</span><span>16px</span><span>&nbsp;</span><span>32px</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>font-size:</span><span>&nbsp;</span><span>18px</span><span>;</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>&lt;/</span><span>style</span><span>&gt;</span></span><br><span><span></span></span><br><span><span>&lt;</span><span>button</span><span>&nbsp;</span><span>class</span><span>=</span><span>"button"</span><span>&gt;</span><span>Interactive&nbsp;Button</span><span>&lt;/</span><span>button</span><span>&gt;</span></span><br><span><span></span></span><br>
```

**Supported selectors:**

-   **States:**`:hover`, `:active`, `:focus`-   **Responsive:**`:sm`, `:md`, `:lg`, `:xl`, `:2xl`

### ID-Based Styling

Style specific elements using ID selectors:

```
<span><span>&lt;</span><span>style</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;</span><span>#header</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>background-color:</span><span>&nbsp;</span><span>#ff6b6b</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>padding:</span><span>&nbsp;</span><span>20px</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>text-align:</span><span>&nbsp;</span><span>center</span><span>;</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>&nbsp;&nbsp;</span></span><br><span><span>&nbsp;&nbsp;</span><span>#header:hover</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>opacity:</span><span>&nbsp;</span><span>0.9</span><span>;</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>&lt;/</span><span>style</span><span>&gt;</span></span><br><span><span></span></span><br><span><span>&lt;</span><span>div</span><span>&nbsp;</span><span>id</span><span>=</span><span>"header"</span><span>&gt;</span></span><br><span><span>&nbsp;&nbsp;</span><span>&lt;</span><span>h1</span><span>&gt;</span><span>Welcome&nbsp;to&nbsp;uikitml</span><span>&lt;/</span><span>h1</span><span>&gt;</span></span><br><span><span>&lt;/</span><span>div</span><span>&gt;</span></span><br><span><span></span></span><br>
```

## Handling User Interactions

UIKitML provides an event system for handling user interactions:

```
<span><span>export</span><span>&nbsp;</span><span>class</span><span>&nbsp;</span><span>PanelSystem</span><span>&nbsp;</span><span>extends</span><span>&nbsp;createSystem({</span></span><br><span><span>&nbsp;&nbsp;welcomePanel:&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;required:&nbsp;[</span><span>PanelUI</span><span>,&nbsp;</span><span>PanelDocument</span><span>],</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;where:&nbsp;[eq(</span><span>PanelUI</span><span>,&nbsp;</span><span>"config"</span><span>,&nbsp;</span><span>"/ui/main-menu.json"</span><span>)],</span></span><br><span><span>&nbsp;&nbsp;},</span></span><br><span><span>})&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;init()&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.queries.welcomePanel.subscribe(</span><span>"qualify"</span><span>,&nbsp;(entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;document&nbsp;=&nbsp;</span><span>PanelDocument</span><span>.data.document[</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;entity.index</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]&nbsp;</span><span>as</span><span>&nbsp;</span><span>UIKitDocument</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>if</span><span>&nbsp;(!document)&nbsp;</span><span>return</span><span>;</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;xrButton&nbsp;=&nbsp;document.getElementById(</span><span>"xr-button"</span><span>)&nbsp;</span><span>as</span><span>&nbsp;</span><span>UIKit</span><span>.</span><span>Text</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;xrButton.addEventListener(</span><span>"click"</span><span>,&nbsp;()&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;TODO:&nbsp;add&nbsp;your&nbsp;interactivity&nbsp;here</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

## Troubleshooting

### UI Not Appearing

**UI document loads but nothing shows?**

-   Check that the position is in front of the player-   Verify the scale is appropriate (try 0.001 for pixel-based layouts)-   Ensure UISystem is registered with the world-   Ensure your elements have a color different then their background

### Interaction Issues

**Clicks not working?**

-   Verify event listeners are attached to the UI element-   Check if anything is blocking the UI

### Layout Issues

**Elements not positioning correctly?**

-   Check `flexDirection` and alignment properties-   Verify the parent container has appropriate dimensions-   Use the UIKitML VSCode extension to understand the size and position of individual elements by hovering over them