In this tutorial, you’ll learn how to combine visual scene composition with programmatic behavior.

## What you’ll build

By the end of this chapter, you’ll be able to:

-   Set up Meta Spatial Editor for IWSDK integration.-   Create and compose 3D scenes visually with drag-and-drop.-   Add IWSDK components to objects directly in the editor.-   Export scenes that automatically integrate with your IWSDK projects.-   Use hot reload for instant feedback between editor and code.-   Create custom components and use them in the visual editor.

Meta Spatial Editor excels at tasks that are tedious or error-prone in code, while IWSDK’s code-first approach handles logic and dynamic behavior perfectly. Together, they create a powerful hybrid workflow:

Meta Spatial Editor strengths:

-   Visual scene layout: Position objects in 3D space with immediate feedback.-   Component assignment: Add grabbable, physics, and UI components without coding.-   Asset composition: Drag-and-drop 3D model placement and organization.-   Designer collaboration: Non-programmers can contribute to scene creation.

IWSDK code strengths:

-   Custom interactions: Complex behaviors and game logic.-   Dynamic content: Procedural generation and runtime changes.-   Performance optimization: Fine-tuned systems and queries.-   Integration: APIs, databases, and external services.

The result is a workflow where designers handle spatial composition visually while developers focus on behavior and systems.

## Prerequisites

Before starting, make sure you have:

-   A working IWSDK project.-   Node.js 20.19.0+: For running the development server.-   IWSDK project with Meta Spatial Editor integration: Created with `npm create @iwsdk@latest` and chose “Yes” for Meta Spatial Editor integration.

**Note**: If your project wasn’t created with Meta Spatial Editor support, you’ll need to manually add the `@iwsdk/vite-plugin-metaspatial` plugin to your `vite.config.ts`. The easiest approach is to create a new project with the integration enabled.

Download and install Meta Spatial Editor version 9 or higher:

-   Mac: [Meta Spatial Editor for Mac](https://developers.meta.com/horizon/downloads/package/meta-spatial-editor-for-mac)-   Windows: [Meta Spatial Editor for Windows](https://developers.meta.com/horizon/downloads/package/meta-spatial-editor-for-windows)

## Getting started with visual scene composition

Let’s start by opening an existing Meta Spatial Editor project and understanding how it integrates with IWSDK.

### Starting your development server

First, ensure your IWSDK development server is running:

```
<span>cd your</span><span>-</span><span>iwsdk</span><span>-</span><span>project  </span><span># Navigate to your project</span><span>
npm run dev            </span><span># Start the development server</span>
```

Keep this running throughout the tutorial since it’s essential for hot reload functionality.

### Opening your first spatial project

When you created your IWSDK project with Meta Spatial Editor integration, a `metaspatial/` folder was automatically created with a starter project.

-   Launch Meta Spatial Editor.-   Open the `Main.metaspatial` file in your project’s `metaspatial/` directory.
    
    You should see a basic scene with some example objects.
    

### Understanding the Interface

The Meta Spatial Editor provides the essential tools for scene composition, including a 3D viewport for editing, composition panel for organizing objects, properties panel for configuration, and asset library for available resources.

### Basic Navigation

Learn these essential navigation controls:

-   Left mouse + drag: Rotate camera around the scene.-   Middle mouse + drag: Pan the camera view.-   Mouse wheel: Zoom in/out.-   W/A/S/D or arrow keys: Walk the viewport camera.-   Left click: Select objects.

## Building Your First Scene

Let’s create a simple interactive scene to understand the core workflow.

### Adding Objects to Your Scene

You can add objects in several ways:

Method 1: Drag and drop assets

-   From the Asset Library, drag a GLTF model directly into the 3D viewport.-   The object appears both in the scene and in the Composition panel hierarchy.

Method 2: Create empty nodes

-   Click the gizmo + plus icon in the Composition panel.-   This creates an empty node that can serve as a parent group for organizing objects.

### Organizing Scene Hierarchy

Good scene organization makes your project maintainable:

-   Create parent groups for logical organization (e.g., “Furniture”, “Lighting”, “Interactive Objects”).-   Drag child objects onto parent nodes in the Composition panel to establish relationships.-   Name objects descriptively - this helps when writing code that references them.

### Positioning and Transforming Objects

Use the visual gizmos to position objects precisely:

-   Select an object in the viewport or Composition panel.-   Use the visual gizmos to adjust transforms, materials, and other properties.

> 💡 Precision Controls
> 
> Hold Shift while dragging for finer control, or use the Properties panel to enter exact numeric values for transforms.

### Adding IWSDK Components Visually

This is where Meta Spatial Editor really shines - you can add IWSDK components without writing any code:

-   Select an object you want to make interactive.-   In the Properties panel, find the “Immersive Web SDK Components” section.-   Click the + button to add a component.-   Choose a component like “Interactable” or “OneHandGrabbable”.-   Configure properties in the component’s settings.

For grabbable objects, you need both components:

-   Interactable: Makes the object respond to pointer events-   OneHandGrabbable or DistanceGrabbable: Defines grab behavior

## Hot Reload Integration

When you save your spatial project, your IWSDK app automatically updates.

### How Hot Reload Works

-   Meta Spatial Editor: Saves your project (Cmd/Ctrl+S).-   Vite Plugin: Detects the change and regenerates GLXF export.-   IWSDK Runtime: Automatically reloads the updated scene.-   Your App: Updates instantly in browser or headset.

### Testing the Integration

Let’s verify everything is working. Note that hot reload only works when your IWSDK development server is running. If you stop the server, you’ll need to restart it to re-enable hot reload.

-   Add a grabbable object in Meta Spatial Editor (follow the steps above).-   Save the project (Cmd/Ctrl+S).-   Check your IWSDK app (browser or headset) - the object should now be grabbable.-   Try grabbing it with controllers or hand tracking.

## Creating Custom Components

While built-in components cover common use cases, you can create custom components for unique behaviors.

### Step 1: Define Your Component in Code

Create a new file in your `src/` directory (e.g., `src/spinner.js`):

```
<span><span>import</span><span>&nbsp;{&nbsp;createComponent,&nbsp;createSystem&nbsp;}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'@iwsdk/core'</span><span>;</span></span><br><span><span></span></span><br><span><span>//&nbsp;Define&nbsp;a&nbsp;component&nbsp;with&nbsp;configurable&nbsp;properties</span></span><br><span><span>export</span><span>&nbsp;</span><span>const</span><span>&nbsp;</span><span>Spinner</span><span>&nbsp;=&nbsp;createComponent(</span><span>'Spinner'</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;speed:&nbsp;{&nbsp;type:&nbsp;</span><span>'float'</span><span>,&nbsp;</span><span>default</span><span>:&nbsp;</span><span>1.0</span><span>&nbsp;},</span></span><br><span><span>&nbsp;&nbsp;axis:&nbsp;{&nbsp;type:&nbsp;</span><span>'enum'</span><span>,&nbsp;values:&nbsp;[</span><span>'X'</span><span>,&nbsp;</span><span>'Y'</span><span>,&nbsp;</span><span>'Z'</span><span>],&nbsp;</span><span>default</span><span>:&nbsp;</span><span>'Y'</span><span>&nbsp;}</span></span><br><span><span>});</span></span><br><span><span></span></span><br><span><span>//&nbsp;Create&nbsp;a&nbsp;system&nbsp;that&nbsp;processes&nbsp;Spinner&nbsp;componen</span><span>ts</span></span><br><span><span>export</span><span>&nbsp;</span><span>class</span><span>&nbsp;</span><span>SpinSystem</span><span>&nbsp;</span><span>extends</span><span>&nbsp;createSystem({</span></span><br><span><span>&nbsp;&nbsp;spinners:&nbsp;{&nbsp;required:&nbsp;[</span><span>Spinner</span><span>]&nbsp;},</span></span><br><span><span>})&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;update(delta)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.queries.spinners.entities.forEach((entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;speed&nbsp;=&nbsp;entity.getValue(</span><span>Spinner</span><span>,&nbsp;</span><span>'speed'</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;axis&nbsp;=&nbsp;entity.getValue(</span><span>Spinner</span><span>,&nbsp;</span><span>'axis'</span><span>);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Rotate&nbsp;the&nbsp;object&nbsp;based&nbsp;on&nbsp;the&nbsp;axis&nbsp;setting</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>if</span><span>&nbsp;(axis&nbsp;===&nbsp;</span><span>'Y'</span><span>)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;entity.object3D.rotateY(delta&nbsp;*&nbsp;speed);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;</span><span>else</span><span>&nbsp;</span><span>if</span><span>&nbsp;(axis&nbsp;===&nbsp;</span><span>'X'</span><span>)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;entity.object3D.rotateX(delta&nbsp;*&nbsp;speed);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;</span><span>else</span><span>&nbsp;</span><span>if</span><span>&nbsp;(axis&nbsp;===&nbsp;</span><span>'Z'</span><span>)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;entity.object3D.rotateZ(delta&nbsp;*&nbsp;speed);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

### Step 2: Register Your System

In your main `src/index.ts`, import and register the system:

```
<span><span>import</span><span>&nbsp;{&nbsp;</span><span>SpinSystem</span><span>&nbsp;}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'./spinner.js'</span><span>;</span></span><br><span><span></span></span><br><span><span>//&nbsp;After&nbsp;World.create()</span></span><br><span><span>World</span><span>.create(</span><span>/*&nbsp;...&nbsp;*/</span><span>).then((world)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Register&nbsp;your&nbsp;custom&nbsp;system</span></span><br><span><span>&nbsp;&nbsp;world.registerSystem(</span><span>SpinSystem</span><span>);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;...&nbsp;rest&nbsp;of&nbsp;your&nbsp;setup</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

-   Select an object you want to spin.-   In the Properties panel, click **+** next to “Immersive Web SDK Components”.-   Click the **Reload** button in the component dropdown to refresh available components.-   Choose **Spinner** from the list.-   Configure properties: Set speed to _2.0_, axis to **Y**.-   Save the project.

### Step 4: Test Your Custom Behavior

Check your app - the object should now be spinning according to your settings!

## Advanced Integration: 2D UI Panels

Meta Spatial Editor can also handle spatial UI panels, integrating with IWSDK’s UIKitML system.

### Creating a UI Panel

-   Create your UIKitML file in your project’s `ui/` directory.-   In Meta Spatial Editor, click **Add 2D Panel** or use the menu: **Nodes** > **New** > **2D Panel**.-   Select the new Panel node in the **Composition** panel.-   Position and size the panel in 3D space using transform gizmos.-   In the **Properties** panel, set the **Panel ID** to match your UIKitML filename.-   Save the project.
    
    The 2D UI will automatically appear in your IWSDK app at the specified position and size.
    

**Note**: If the panel’s aspect ratio doesn’t match your UIKitML definition, IWSDK will fit the content as best as possible and leave unused areas transparent.

## Best practices and workflow tips

-   Use Meta Spatial Editor for: Spatial layout, asset placement, visual component assignment, lighting setup.-   Use IWSDK code for: Game logic, dynamic behavior, performance optimization, API integration.

### Version control strategy

Track both your IWSDK project and your metaspatial project in source control.

### Team collaboration

-   Designers/Artists: Work primarily in Meta Spatial Editor for layouts and visual composition.-   Developers: Focus on IWSDK code for systems and behavior.-   Both: Communicate about component interfaces and naming conventions.

## Best practices and tips

-   Use the editor for layout, Not logic: Keep business logic in code; use the editor for spatial layout and component assignment.-   Version Control: Track both your IWSDK project and your metaspatial project in source control.-   Collaborate: Designers can iterate on scenes without blocking developers, and vice versa.