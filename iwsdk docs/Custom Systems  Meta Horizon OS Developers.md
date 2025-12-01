Your starter app already includes a perfect example of custom ECS code: the robot that faces the player and plays sounds when clicked. This tutorial teaches you how to create custom systems and components by examining this existing implementation and understanding the fundamental ECS patterns you’ll use in your own WebXR applications.

## Creating a component

Components are data containers that you attach to entities. IWSDK uses `createComponent` to define component types with typed schemas.

### Component schema types

IWSDK supports these data types for component schemas:

| Type | Description |
| --- | --- |
| 
`Types.Int8`, `Types.Int16`

 | 

Integer numbers

 |
| 

`Types.Float32`, `Types.Float64`

 | 

Floating point numbers

 |
| 

`Types.Boolean`

 | 

true/false values

 |
| 

`Types.String`

 | 

Text strings

 |
| 

`Types.Vec2`

 | 

2D vectors \[x, y\]

 |
| 

`Types.Vec3`

 | 

3D vectors \[x, y, z\]

 |
| 

`Types.Vec4`

 | 

4D vectors \[x, y, z, w\]

 |
| 

`Types.Color`

 | 

RGBA colors \[r, g, b, a\]

 |
| 

`Types.Entity`

 | 

References to other entities

 |
| 

`Types.Object`

 | 

Any JavaScript object

 |
| 

`Types.Enum`

 | 

String values from a defined set

 |

### Component examples

Tag Component (no data, just tags entities):

```
<span><span>import</span><span>&nbsp;{&nbsp;createComponent&nbsp;}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'@iwsdk/core'</span><span>;</span></span><br><span><span></span></span><br><span><span>export</span><span>&nbsp;</span><span>const</span><span>&nbsp;</span><span>Robot</span><span>&nbsp;=&nbsp;createComponent(</span><span>'Robot'</span><span>,&nbsp;{});</span></span><br><span><span></span></span><br>
```

Data Component (stores actual information):

```
<span><span>import</span><span>&nbsp;{&nbsp;createComponent,&nbsp;</span><span>Types</span><span>&nbsp;}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'@iwsdk/core'</span><span>;</span></span><br><span><span></span></span><br><span><span>export</span><span>&nbsp;</span><span>const</span><span>&nbsp;</span><span>Health</span><span>&nbsp;=&nbsp;createComponent(</span><span>'Health'</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;current:&nbsp;{&nbsp;</span><span>type</span><span>:&nbsp;</span><span>Types</span><span>.</span><span>Float32</span><span>,&nbsp;</span><span>default</span><span>:&nbsp;</span><span>100</span><span>&nbsp;},</span></span><br><span><span>&nbsp;&nbsp;max:&nbsp;{&nbsp;</span><span>type</span><span>:&nbsp;</span><span>Types</span><span>.</span><span>Float32</span><span>,&nbsp;</span><span>default</span><span>:&nbsp;</span><span>100</span><span>&nbsp;},</span></span><br><span><span>&nbsp;&nbsp;regenerating:&nbsp;{&nbsp;</span><span>type</span><span>:&nbsp;</span><span>Types</span><span>.</span><span>Boolean</span><span>,&nbsp;</span><span>default</span><span>:&nbsp;</span><span>false</span><span>&nbsp;},</span></span><br><span><span>});</span></span><br><span><span></span></span><br><span><span>export</span><span>&nbsp;</span><span>const</span><span>&nbsp;</span><span>Position</span><span>&nbsp;=&nbsp;createComponent(</span><span>'Position'</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;velocity:&nbsp;{&nbsp;</span><span>type</span><span>:&nbsp;</span><span>Types</span><span>.</span><span>Vec3</span><span>,&nbsp;</span><span>default</span><span>:&nbsp;[</span><span>0</span><span>,&nbsp;</span><span>0</span><span>,&nbsp;</span><span>0</span><span>]&nbsp;},</span></span><br><span><span>&nbsp;&nbsp;target:&nbsp;{&nbsp;</span><span>type</span><span>:&nbsp;</span><span>Types</span><span>.</span><span>Vec3</span><span>,&nbsp;</span><span>default</span><span>:&nbsp;[</span><span>0</span><span>,&nbsp;</span><span>0</span><span>,&nbsp;</span><span>0</span><span>]&nbsp;},</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

## Creating a system

Systems contain the logic that operates on entities with specific components. They define queries to find relevant entities and run logic each frame.

### System structure

```
<span><span>import</span><span>&nbsp;{&nbsp;createSystem,&nbsp;eq,&nbsp;</span><span>Types</span><span>&nbsp;}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'@iwsdk/core'</span><span>;</span></span><br><span><span></span></span><br><span><span>export</span><span>&nbsp;</span><span>class</span><span>&nbsp;</span><span>MySystem</span><span>&nbsp;</span><span>extends</span><span>&nbsp;createSystem(</span></span><br><span><span>&nbsp;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Regular&nbsp;query&nbsp;-&nbsp;entities&nbsp;with&nbsp;specific&nbsp;componen</span><span>ts</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;myQuery:&nbsp;{&nbsp;required:&nbsp;[</span><span>ComponentA</span><span>,&nbsp;</span><span>ComponentB</span><span>]&nbsp;},</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Query&nbsp;with&nbsp;exclusion&nbsp;-&nbsp;has&nbsp;ComponentA&nbsp;but&nbsp;NOT&nbsp;C</span><span>omponentC</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;specialQuery:&nbsp;{&nbsp;required:&nbsp;[</span><span>ComponentA</span><span>],&nbsp;excluded:&nbsp;[</span><span>ComponentC</span><span>]&nbsp;},</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Query&nbsp;with&nbsp;value&nbsp;predicate&nbsp;-&nbsp;matches&nbsp;specific&nbsp;c</span><span>omponent&nbsp;values</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;configQuery:&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;required:&nbsp;[</span><span>PanelUI</span><span>,&nbsp;</span><span>PanelDocument</span><span>],</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;where:&nbsp;[eq(</span><span>PanelUI</span><span>,&nbsp;</span><span>'config'</span><span>,&nbsp;</span><span>'/ui/welcome.json'</span><span>)],</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;},</span></span><br><span><span>&nbsp;&nbsp;},</span></span><br><span><span>&nbsp;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Optional&nbsp;config&nbsp;schema&nbsp;-&nbsp;system-level&nbsp;configura</span><span>tion</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;speed:&nbsp;{&nbsp;</span><span>type</span><span>:&nbsp;</span><span>Types</span><span>.</span><span>Float32</span><span>,&nbsp;</span><span>default</span><span>:&nbsp;</span><span>1.0</span><span>&nbsp;},</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;enabled:&nbsp;{&nbsp;</span><span>type</span><span>:&nbsp;</span><span>Types</span><span>.</span><span>Boolean</span><span>,&nbsp;</span><span>default</span><span>:&nbsp;</span><span>true</span><span>&nbsp;},</span></span><br><span><span>&nbsp;&nbsp;},</span></span><br><span><span>)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;System&nbsp;implementation</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

### Accessing queries and config

Queries are accessible via `this.queries.queryName.entities` (which returns a Set) and support reactive subscriptions:

```
<span><span>//&nbsp;Access&nbsp;entities&nbsp;in&nbsp;update()&nbsp;or&nbsp;init()</span></span><br><span><span>this</span><span>.queries.myQuery.entities.forEach((entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Process&nbsp;each&nbsp;entity</span></span><br><span><span>});</span></span><br><span><span></span></span><br><span><span>//&nbsp;React&nbsp;to&nbsp;entities&nbsp;entering/leaving&nbsp;queries</span></span><br><span><span>this</span><span>.queries.welcomePanel.subscribe(</span><span>'qualify'</span><span>,&nbsp;(entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Called&nbsp;when&nbsp;entity&nbsp;newly&nbsp;matches&nbsp;query</span></span><br><span><span>});</span></span><br><span><span></span></span><br><span><span>this</span><span>.queries.welcomePanel.subscribe(</span><span>'disqualify'</span><span>,&nbsp;(entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Called&nbsp;when&nbsp;entity&nbsp;stops&nbsp;matching&nbsp;query</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

Config values are converted to signals accessible via `this.config.propertyName.value`:

```
<span><span>//&nbsp;Access&nbsp;config&nbsp;values</span></span><br><span><span>const</span><span>&nbsp;currentSpeed&nbsp;=&nbsp;</span><span>this</span><span>.config.speed.value;</span></span><br><span><span>const</span><span>&nbsp;isEnabled&nbsp;=&nbsp;</span><span>this</span><span>.config.enabled.value;</span></span><br><span><span></span></span><br><span><span>//&nbsp;React&nbsp;to&nbsp;config&nbsp;changes</span></span><br><span><span>this</span><span>.config.speed.subscribe((value)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;React&nbsp;to&nbsp;speed&nbsp;changes</span></span><br><span><span>&nbsp;&nbsp;console.log(</span><span>'Speed&nbsp;changed&nbsp;to:'</span><span>,&nbsp;value);</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

### System lifecycle methods

`init()`: Called once when the system is registered with the world.

```
<span><span>init()&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Initialize&nbsp;reusable&nbsp;objects&nbsp;for&nbsp;performance</span></span><br><span><span>&nbsp;&nbsp;</span><span>this</span><span>.tempVector&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>Vector3</span><span>();</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Set&nbsp;up&nbsp;reactive&nbsp;subscriptions</span></span><br><span><span>&nbsp;&nbsp;</span><span>this</span><span>.queries.myQuery.subscribe(</span><span>'qualify'</span><span>,&nbsp;(entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Called&nbsp;when&nbsp;an&nbsp;entity&nbsp;newly&nbsp;matches&nbsp;the&nbsp;query</span></span><br><span><span>&nbsp;&nbsp;});</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>this</span><span>.queries.myQuery.subscribe(</span><span>'disqualify'</span><span>,&nbsp;(entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Called&nbsp;when&nbsp;an&nbsp;entity&nbsp;stops&nbsp;matching&nbsp;the&nbsp;query</span></span><br><span><span>&nbsp;&nbsp;});</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

`update(delta: number, time: number)`: Called every frame.

```
<span><span>update(delta,&nbsp;time)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;delta:&nbsp;Time&nbsp;since&nbsp;last&nbsp;frame&nbsp;(in&nbsp;seconds)&nbsp;-&nbsp;use</span><span>&nbsp;for&nbsp;frame-rate&nbsp;independent&nbsp;movement</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;time:&nbsp;Total&nbsp;elapsed&nbsp;time&nbsp;since&nbsp;start&nbsp;(in&nbsp;second</span><span>s)&nbsp;-&nbsp;use&nbsp;for&nbsp;animations&nbsp;and&nbsp;timing</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>this</span><span>.queries.myQuery.entities.forEach((entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Run&nbsp;logic&nbsp;on&nbsp;each&nbsp;matching&nbsp;entity</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;position&nbsp;=&nbsp;entity.getComponent(</span><span>Position</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;position.velocity[</span><span>0</span><span>]&nbsp;*=&nbsp;delta;&nbsp;</span><span>//&nbsp;Frame-rate&nbsp;independent&nbsp;movement</span></span><br><span><span>&nbsp;&nbsp;});</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

`destroy()`: Called when the system is unregistered.

```
<span><span>destroy()&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Clean&nbsp;up&nbsp;resources,&nbsp;remove&nbsp;event&nbsp;listeners,&nbsp;etc</span><span>.</span></span><br><span><span>&nbsp;&nbsp;</span><span>this</span><span>.tempVector&nbsp;=&nbsp;</span><span>null</span><span>;</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

### System properties

-   `this.queries`: Access to defined queries and their entities.-   `this.config`: Access to system configuration values.-   `this.world`: Reference to the ECS world.-   `this.player`: Reference to XR player/camera rig (see [XR Origin](https://developers.meta.com/horizon/documentation/web/iwsdk-concept-xr-input-origin/) for more details).-   `this.camera`: Reference to the camera.-   `isPaused`: Whether the system is currently paused.

## Registering with world

After creating components and systems, you register them with the world to make them active:

```
<span><span>//&nbsp;Register&nbsp;components&nbsp;first</span></span><br><span><span>world</span></span><br><span><span>&nbsp;&nbsp;.registerComponent(</span><span>Robot</span><span>)</span></span><br><span><span>&nbsp;&nbsp;.registerComponent(</span><span>Health</span><span>)</span></span><br><span><span>&nbsp;&nbsp;.registerComponent(</span><span>Position</span><span>);</span></span><br><span><span></span></span><br><span><span>//&nbsp;Then&nbsp;register&nbsp;systems</span></span><br><span><span>world.registerSystem(</span><span>RobotSystem</span><span>).registerSystem(</span><span>HealthSystem</span><span>,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;priority:&nbsp;-</span><span>1</span><span>,&nbsp;</span><span>//&nbsp;Higher&nbsp;priority&nbsp;systems&nbsp;run&nbsp;first&nbsp;(negative&nbsp;=&nbsp;h</span><span>igher&nbsp;priority)</span></span><br><span><span>&nbsp;&nbsp;configData:&nbsp;{&nbsp;speed:&nbsp;</span><span>2.0</span><span>&nbsp;},&nbsp;</span><span>//&nbsp;Override&nbsp;default&nbsp;config&nbsp;values</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

### System Priorities

Systems run in priority order each frame. Lower numbers run first. Values smaller than 0 are reserved for IWSDK systems and are prioritized for a reason, so generally you should choose numbers larger than 0 for your custom systems.

## The robot example

Now let’s examine how the robot system in your starter app implements these concepts:

```
<span><span>import</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>AudioUtils</span><span>,</span></span><br><span><span>&nbsp;&nbsp;createComponent,</span></span><br><span><span>&nbsp;&nbsp;createSystem,</span></span><br><span><span>&nbsp;&nbsp;</span><span>Pressed</span><span>,</span></span><br><span><span>&nbsp;&nbsp;</span><span>Vector3</span><span>,</span></span><br><span><span>}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'@iwsdk/core'</span><span>;</span></span><br><span><span></span></span><br><span><span>//&nbsp;1.&nbsp;Creating&nbsp;a&nbsp;tag&nbsp;component&nbsp;-&nbsp;no&nbsp;data,&nbsp;just&nbsp;tag</span><span>s&nbsp;entities&nbsp;as&nbsp;robots</span></span><br><span><span>export</span><span>&nbsp;</span><span>const</span><span>&nbsp;</span><span>Robot</span><span>&nbsp;=&nbsp;createComponent(</span><span>'Robot'</span><span>,&nbsp;{});</span></span><br><span><span></span></span><br><span><span>//&nbsp;2.&nbsp;Creating&nbsp;a&nbsp;system&nbsp;with&nbsp;two&nbsp;queries</span></span><br><span><span>export</span><span>&nbsp;</span><span>class</span><span>&nbsp;</span><span>RobotSystem</span><span>&nbsp;</span><span>extends</span><span>&nbsp;createSystem({</span></span><br><span><span>&nbsp;&nbsp;robot:&nbsp;{&nbsp;required:&nbsp;[</span><span>Robot</span><span>]&nbsp;},&nbsp;</span><span>//&nbsp;All&nbsp;robot&nbsp;entities</span></span><br><span><span>&nbsp;&nbsp;robotClicked:&nbsp;{&nbsp;required:&nbsp;[</span><span>Robot</span><span>,&nbsp;</span><span>Pressed</span><span>]&nbsp;},&nbsp;</span><span>//&nbsp;Only&nbsp;clicked&nbsp;robots</span></span><br><span><span>})&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>private</span><span>&nbsp;lookAtTarget;</span></span><br><span><span>&nbsp;&nbsp;</span><span>private</span><span>&nbsp;vec3;</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;3.&nbsp;init()&nbsp;-&nbsp;called&nbsp;when&nbsp;system&nbsp;is&nbsp;registered</span></span><br><span><span>&nbsp;&nbsp;init()&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Performance:&nbsp;Create&nbsp;reusable&nbsp;objects&nbsp;once</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.lookAtTarget&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>Vector3</span><span>();</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.vec3&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>Vector3</span><span>();</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Audio&nbsp;integration:&nbsp;Subscribe&nbsp;to&nbsp;click&nbsp;events</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.queries.robotClicked.subscribe(</span><span>'qualify'</span><span>,&nbsp;(entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>AudioUtils</span><span>.play(entity);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;4.&nbsp;update()&nbsp;-&nbsp;called&nbsp;every&nbsp;frame</span></span><br><span><span>&nbsp;&nbsp;update()&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Process&nbsp;all&nbsp;robot&nbsp;entities</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.queries.robot.entities.forEach((entity)&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Get&nbsp;player&nbsp;head&nbsp;position</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.player.head.getWorldPosition(</span><span>this</span><span>.lookAtTarget);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Get&nbsp;robot's&nbsp;Three.js&nbsp;object&nbsp;and&nbsp;position</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;spinnerObject&nbsp;=&nbsp;entity.object3D;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;spinnerObject.getWorldPosition(</span><span>this</span><span>.vec3);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Keep&nbsp;robots&nbsp;level&nbsp;(don't&nbsp;tilt&nbsp;up/down)</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>this</span><span>.lookAtTarget.y&nbsp;=&nbsp;</span><span>this</span><span>.vec3.y;</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Make&nbsp;robot&nbsp;face&nbsp;player</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;spinnerObject.lookAt(</span><span>this</span><span>.lookAtTarget);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

### Mapping back to the concepts

-   Component: `Robot` is a tag component (empty schema) that tags entities.-   Queries: Two queries handle different entity states (all robots vs clicked robots).-   Registration: System gets registered in `index.ts` with `world.registerSystem(RobotSystem)`.-   Lifecycle: `init()` sets up resources and subscriptions, `update()` runs the behavior.-   Audio Integration: Uses `AudioUtils.play(entity)` with the entity’s `AudioSource` component.

### Key patterns demonstrated

-   Performance optimization: Reusable Vector3 objects in `init()`.-   Direct Three.js access: `entity.object3D` bridges ECS data with rendering.-   Event-driven behavior: `subscribe('qualify', ...)` for reactive audio.-   Frame-rate independent: No delta usage needed here since `lookAt()` sets absolute rotation.

## What’s next

Now that you understand how IWSDK’s ECS architecture works by examining real code, you’ll learn how to build and publish your WebXR application so others can experience what you’ve created.