RenderDoc is a graphics debugging tool that supports multiple graphics APIs and development platforms. It is used for frame capture and analysis during development. RenderDoc shows how a running application’s engine determined a scene should be rendered on Meta Quest hardware for a single frame. This information can often be used to find optimization opportunities and potential sources of performance issues.

Meta maintains its own fork of RenderDoc. This fork provides access to low-level GPU profiling data from the Quest’s Snapdragon 835 chip and the Quest 2’s Snapdragon XR2 chip, specifically information from its tile renderer.

The RenderDoc for Meta Quest installer for Windows is available on the [Downloads](https://developers.meta.com/horizon/downloads/package/renderdoc-oculus/) page.

This guide walks you through the process of connecting RenderDoc for Meta Quest with Browser to capture and replay a frame.

-   Download and install [RenderDoc Meta Fork](https://developers.meta.com/horizon/downloads/package/renderdoc-oculus/) on your PC.-   In your Quest device, launch the browser and navigate to `chrome://flags`.-   Use the search bar on the page to search for “Image”.-   Toggle the **Android ImageReader** flag to **Disabled**.-   After changing the flags, you’ll see a banner at the bottom of the browser. Click the “Relaunch” button.-   **Extra step if you need to work with Immersive mode:**
    -   Use the search bar to search for “RenderDoc”.-   Toggle the **RenderDoc Immersive Mode Support** flag to **Enabled**.-   Click the “Relaunch” button.

## Connecting RenderDoc to Browser to Capture a Frame

-   On your PC, launch the RenderDoc Meta Fork application.-   In the bottom-left corner of the RenderDoc UI, click **Replay Context: (something)** and select **Meta Quest 2 Profiling Mode**.-   At this point, your Quest device should turn black with 3 white dots. Press the home button on your Quest controller to go back to the Home environment.-   In the RenderDoc **Launch Application** panel, type `com.oculus.browser/.PanelActivity` in the **Executable Path** field, and click the Launch button.-   The browser should launch with RenderDoc connected. Navigate to the page and view you want to capture, and use the RenderDoc app on your computer to capture a frame.

If browser fails to launch, you can still manually attach RenderDoc to the browser:

-   Manually launch the browser in your Quest device. You should see the RenderDoc overlay drawn on top of the browser.-   In the RenderDoc UI, click the **File** menu, then click **Attach to Running Instance**.-   You should see **com.oculus.browser** in the list.-   Select **com.oculus.browser** and click the **Connect to App** button.

After a capture is made, you can capture additional frames or immediately open a frame in Replay Mode.

## Replay Mode

-   You should still be connected to your device. If not, set the Replay Context to Meta Quest headset. In the bottom-left corner of the RenderDoc UI, click **Replay Context: (something)** and select **Meta Quest 2 Profiling Mode**.-   Double-click the capture to view. You are now replaying the capture on the Quest GPU.-   In the **Event Browser** window, you can see each draw call that was made during your frame capture. Clicking each one lets you inspect the state of the entire rendering pipeline at the time of that call.-   The **Texture Viewer** tab shows the frame buffer as you click the various calls.
    -   It may display very darkly. To display with more brightness, toggle the gamma button to the left of the Subresource label that is near the top of the Texture Viewer pane.-   In general, the rendering here is not completely accurate, but it serves as a good guide for what’s going on in each draw call.-   Consider setting the **Overlay** option to **Wireframe Mesh** or **Highlight Draw Call** to identify what object is being rendered.-   Open the **Performance Counter Viewer** tab and press the **Capture Counters** button. There are a variety of metrics here, including a couple of generic ones, and a bunch of Meta specific ones. The Meta specific metrics are described in the [Draw Call Metrics](https://developers.meta.com/horizon/documentation/web/ts-webxr-perf-drawcall/) topic.
    -   Sorting by **GPU Duration** or **Clocks** is a great way to identify the most expensive draw calls in your scene. These timings may not be entirely accurate in terms of the actual duration when rendering the scene every frame, but they are accurate relative to one another. For example, a 1000 microsecond call is about twice as costly as a 500 microsecond call.-   You can map the event identifiers (EIDs) in the Performance Counter Viewer window to the EIDs in the Event Browser.-   The **Pipeline State** tab shows the entire state of the graphics pipeline for whatever draw call is selected in the Event Browser. To view more information about a specific stage, click the different boxes in the pipeline.