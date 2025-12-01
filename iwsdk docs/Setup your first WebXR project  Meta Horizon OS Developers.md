In this guide, you’ll learn how to programmatially create your first WebXR project from scratch. By the end of this setup, you’ll have a working IWSDK project with all dependencies installed and a development server running.

## What you’ll build

Throughout this getting started guide, you’ll progressively build an interactive WebXR experience that includes:

-   3D objects and environments-   Interactive grabbable elements-   Player movement and navigation-   Spatial user interfaces-   Professional lighting and effects

## Before you begin

Before you begin, make sure you have:

-   [Node.js](https://nodejs.org/) (version 20.19.0 or higher)-   A modern web browser (Chrome, Edge, Firefox, or Safari)-   Basic familiarity with command line/terminal-   Basic knowledge of JavaScript/TypeScript (this guide covers the WebXR and 3D parts)

The following is optional but highly recommended:

-   A WebXR-compatible headset (Meta Quest, HTC Vive, etc.) for testing your experience immersively. While not strictly required thanks to IWER (the WebXR emulator), having a physical headset provides the best testing experience.

## Creating your first project

The interactive project generator is the fastest way to get started. Open your terminal and run:

This command will download and run the latest version of the project creation tool, which will guide you through setting up your project with the right configuration for your needs.

## Understanding the setup questions

The create tool will ask you several questions to customize your project. The exact questions depend on your choices, so let’s walk through the complete flow.

**Note**: Some questions are only asked for VR or AR experiences, which are called out clearly.

### Project name

This will be the name of your project folder and will also be used in your `package.json`. If you’re just following along with this tutorial, you can use the default `iwsdk-app` or a descriptive name like `my-first-xr-app`.

### Language choice

```
<span>Which</span><span> language </span><span>do</span><span> you want to </span><span>use</span><span>?</span><span>
</span><span>❯</span><span> </span><span>TypeScript</span><span>
  </span><span>JavaScript</span>
```

-   TypeScript: Provides type safety, better IDE support, and catches errors at development time. Recommended for most projects.-   JavaScript: Simpler setup, no compilation step, good for quick prototypes.

TypeScript is recommended for this tutorial as it provides better development experience and catches common mistakes early.

### Experience type

```
<span>What</span><span> type of experience are you building</span><span>?</span><span>
</span><span>❯</span><span> </span><span>Virtual</span><span> </span><span>Reality</span><span>
  </span><span>Augmented</span><span> </span><span>Reality</span>
```

-   **Virtual Reality**: Creates a fully immersive virtual environment. Users will be completely immersed in your 3D world.-   **Augmented Reality**: Overlays digital content onto the real world. Users can see virtual objects in their physical space.

For this tutorial, **VR** is recommended as it provides a more straightforward introduction to 3D concepts and spatial interactions.

### WebXR features

Next, you’ll be asked about various WebXR features. Each feature has three options:

-   **No**: Don’t include this feature-   **Optional**: Include the feature but make it work if not available-   **Required**: Require this feature (experience won’t work without it)

#### For VR experiences:

-   **Enable Hand Tracking?** - Allows users to use their hands instead of controllers-   **Enable WebXR Layers?** - Advanced rendering optimization for better performance

#### For AR experiences (additional options):

-   **Enable Hand Tracking?** - Same as VR-   **Enable Anchors?** - Persistent positioning of objects in real world-   **Enable Hit Test?** - Detecting surfaces in the real world-   **Enable Plane Detection?** - Finding flat surfaces like floors, walls, tables-   **Enable Mesh Detection?** - Detailed 3D understanding of real-world geometry-   **Enable WebXR Layers?** - Same as VR

For this tutorial, the default choices work well. You can always change these later.

### Core features

#### Locomotion (VR only)

Locomotion allows users to move around in your virtual world using controllers.

-   **Yes**: Include movement systems (teleport, smooth movement, turning)-   **No**: Users stay in one place (good for seated experiences)

If you choose Yes, you’ll get a follow-up question:

```
<span>Deploy</span><span> locomotion engine on a </span><span>Worker</span><span>?</span><span> </span><span>(</span><span>recommended </span><span>for</span><span> performance</span><span>)</span><span>
</span><span>❯</span><span> </span><span>Yes</span><span> </span><span>(</span><span>recommended</span><span>)</span><span>
  </span><span>No</span>
```

Workers run locomotion calculations on a separate thread for better performance. Choose **Yes** unless you have specific reasons not to.

#### Scene understanding (AR only)

```
<span>Enable</span><span> </span><span>Scene</span><span> </span><span>Understanding</span><span> </span><span>(</span><span>planes</span><span>/</span><span>meshes</span><span>/</span><span>anchors</span><span>)?</span><span> </span><span>(</span><span>Y</span><span>/</span><span>n</span><span>)</span>
```

Scene Understanding helps your AR app understand the real world around it.

-   **Yes**: Include systems for detecting surfaces, objects, and spatial anchors-   **No**: Basic AR without advanced world understanding

#### Grabbing (both VR and AR)

```
<span>Enable</span><span> grabbing </span><span>(</span><span>one</span><span>/</span><span>two</span><span>-</span><span>hand</span><span>,</span><span> distance</span><span>)?</span><span> </span><span>(</span><span>Y</span><span>/</span><span>n</span><span>)</span>
```

Grabbing lets users pick up and manipulate objects in your experience.

-   **Yes**: Include one-handed, two-handed, and distance grabbing systems-   **No**: Objects can’t be grabbed or moved by users

Recommended: **Yes** for interactive experiences.

#### Physics simulation

```
<span>Enable</span><span> physics simulation </span><span>(</span><span>Havok</span><span>)?</span><span> </span><span>(</span><span>y</span><span>/</span><span>N</span><span>)</span>
```

Physics simulation adds realistic object behavior (gravity, collisions, etc.).

-   **Yes**: Objects fall, bounce, and collide realistically-   **No**: Simpler behavior, better performance

Default is **No** because physics adds complexity. You can enable it later if needed.

```
<span>Enable</span><span> </span><span>Meta</span><span> </span><span>Spatial</span><span> </span><span>Editor</span><span> integration</span><span>?</span><span>
</span><span>❯</span><span> </span><span>No</span><span> </span><span>(</span><span>Can</span><span> change later</span><span>)</span><span>
  </span><span>Yes</span><span> </span><span>(</span><span>Additional</span><span> software required</span><span>)</span>
```

Choose **No** for this tutorial. This keeps your setup simple and lets you learn IWSDK’s core concepts through code. You’ll create and position 3D objects entirely through code, which gives you complete control and is perfect for learning the fundamentals.

If you’re interested in visual scene composition tools later, you can explore [Meta Spatial Editor](https://developers.meta.com/horizon/documentation/web/iwsdk-guide-spatial-editor/) after completing the main tutorial.

### Development setup

#### Git repository

```
<span>Set</span><span> up a </span><span>Git</span><span> repository</span><span>?</span><span> </span><span>(</span><span>Y</span><span>/</span><span>n</span><span>)</span>
```

Recommended: **Yes**. This initializes a Git repository for version control.

#### Install dependencies

```
<span>Install</span><span> dependencies now</span><span>?</span><span> </span><span>(</span><span>The</span><span> command to start the dev server will be printed</span><span>.)</span><span> </span><span>(</span><span>Y</span><span>/</span><span>n</span><span>)</span>
```

Recommended: **Yes**. This runs `npm install` automatically and shows you the command to start the dev server.

## Project structure overview

Once the project is created, you’ll see a structure like this:

```
<span>my</span><span>-</span><span>iwsdk</span><span>-</span><span>app</span><span>/</span><span>
</span><span>├──</span><span> src</span><span>/</span><span>
</span><span>│</span><span>   </span><span>├──</span><span> index</span><span>.</span><span>ts         </span><span># Application entry point and world setup</span><span>
</span><span>│</span><span>   </span><span>├──</span><span> robot</span><span>.</span><span>ts         </span><span># Example custom component and system</span><span>
</span><span>│</span><span>   </span><span>└──</span><span> panel</span><span>.</span><span>ts         </span><span># UI panel interaction system</span><span>
</span><span>├──</span><span> ui</span><span>/</span><span>
</span><span>│</span><span>   </span><span>└──</span><span> welcome</span><span>.</span><span>uikitml  </span><span># Spatial UI markup (compiled to public/ui/)</span><span>
</span><span>├──</span><span> </span><span>public</span><span>/</span><span>
</span><span>│</span><span>   </span><span>├──</span><span> audio</span><span>/</span><span>           </span><span># Audio files (.mp3, .wav, etc.)</span><span>
</span><span>│</span><span>   </span><span>│</span><span>   </span><span>└──</span><span> chime</span><span>.</span><span>mp3
</span><span>│</span><span>   </span><span>├──</span><span> gltf</span><span>/</span><span>            </span><span># 3D models and textures</span><span>
</span><span>│</span><span>   </span><span>│</span><span>   </span><span>├──</span><span> environmentDesk</span><span>/</span><span>
</span><span>│</span><span>   </span><span>│</span><span>   </span><span>├──</span><span> plantSansevieria</span><span>/</span><span>
</span><span>│</span><span>   </span><span>│</span><span>   </span><span>└──</span><span> robot</span><span>/</span><span>
</span><span>│</span><span>   </span><span>├──</span><span> textures</span><span>/</span><span>        </span><span># Standalone texture files</span><span>
</span><span>│</span><span>   </span><span>└──</span><span> ui</span><span>/</span><span>              </span><span># Compiled UI files (auto-generated)</span><span>
</span><span>├──</span><span> </span><span>package</span><span>.</span><span>json         </span><span># Dependencies and scripts</span><span>
</span><span>├──</span><span> tsconfig</span><span>.</span><span>json        </span><span># TypeScript configuration</span><span>
</span><span>├──</span><span> vite</span><span>.</span><span>config</span><span>.</span><span>ts       </span><span># Build configuration with IWSDK plugins</span><span>
</span><span>└──</span><span> index</span><span>.</span><span>html           </span><span># HTML entry point</span>
```

### Key files explained

-   **`src/index.ts`**: This is where your application starts. It creates the ECS world, loads assets, spawns entities, and registers systems - everything happens here.-   **`src/robot.ts`** & **`src/panel.ts`**: Example custom components and systems showing how to create interactive behaviors.-   **`ui/welcome.uikitml`**: Spatial UI markup that gets compiled to JSON during build for the 3D interface panel. Learn more about UIKitML in [Spatial UI with UIKitML](https://developers.meta.com/horizon/documentation/web/iwsdk-guide-spatial-ui/).-   **`public/gltf/`**: Organized folder structure for 3D models, with each model in its own subfolder alongside its textures.-   **`public/audio/`**: Audio files used for sound effects and spatial audio.-   **`vite.config.ts`**: Build configuration that includes IWSDK-specific plugins for WebXR emulation, UI compilation, and asset optimization.

## What’s next

You now have a complete IWSDK project with all dependencies installed and a clear understanding of the project structure.

Next, you’ll launch your development server and learn how to test your WebXR experience both in a physical headset and using the built-in emulator on your computer.