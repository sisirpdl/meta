OVR Metrics Tool provides a performance HUD that you can use to monitor performance while your app is running. It is highly recommended that you keep this HUD up and running throughout development so that you can easily keep an eye on the framerate of your experience and quickly identify performance problems or regressions.

The tool is highly configurable and provides much more than just HUD functionality. You can read more about it on the [Monitor Performance with OVR Metrics Tool](https://developers.meta.com/horizon/documentation/unity/ts-ovrmetricstool/) page.

## ovrgpuprofiler

`ovrgpuprofiler` is a low-level CLI tool that developers can use to access an assortment of real-time GPU metrics and perform render stage tracing. It is built to access real-time metrics and GPU profiling data in a convenient, low-friction manner. `ovrgpuprofiler` is included with the Meta Quest runtime and lives on the device itself.

This tool provides access to a wide array of performance metrics and can help you identify specific performance bottlenecks as well as let you determine whether an app is vertex or fragment bound.

Here is a simple example to get you started:

`ovrgpuprofiler --realtime=”29,30”`

This will give you a real time view into what percentage of the frame is spent on vertex processing vs. fragment shading.

You can take a render stage trace to get a snapshot of the configuration of various render buffers as follows:

-   If browser is currently running in the headset, enter `adb shell am force-stop com.oculus.browser` from your computer to shut it down.-   Run `adb shell ovrgpuprofiler -e` to enable extended profiling mode.-   Launch browser, load up your app, enter VR, and then run `adb shell ovrgpuprofiler -t` to capture a trace.-   To understand how to read the trace, see [_GPU Profiling with ovrgpuprofiler_](https://developers.meta.com/horizon/documentation/unity/ts-ovrgpuprofiler/). This can be a good way to validate that your rendering pipeline is set up the way you expect.

## Measure an App’s CPU Cost

-   In the headset, open the browser and enter the WebXR experience you want to debug-   Use Chrome from your computer and navigate to `chrome://inspect#devices`-   Click the “trace” link to the right of the “com.oculus.browser” heading-   Click the “Record” button at the top left corner and you’ll see the “Record a new trace...” dialog show up-   Expand the “Edit categories” dropdown-   Manually select the “xr.debug” category to be included-   Click the “Record” button of the dialog-   Then click “Stop”

The resulting trace will have the frame time taken on CPU as well as the Phase Sync period marked:

![WebXR CPU Frame Time](https://scontent.frca1-1.fna.fbcdn.net/v/t39.2365-6/359801656_1318998589030650_1501728563737518546_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=OoiirArLghMQ7kNvwGfd0Md&_nc_oc=AdkQ27qtHMXZLz4gzJknDUt_WmRQg0l9Llhvzp_HXBXxTRzaaBHAU_fR4egIn_sc_Y0&_nc_zt=14&_nc_ht=scontent.frca1-1.fna&_nc_gid=sRRJdi9P9QpcvpjJz465tg&oh=00_AfiSkKAR2df7aDK7z04gh_UqApxcVzIcnhLPR5U6uUKuBg&oe=6943F6DD)

By selecting a time range in the trace tool:

![WebXR CPU Frame Time Select Time Period](https://scontent.frca1-1.fna.fbcdn.net/v/t39.2365-6/359796369_1318998582363984_2040476664314265146_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=HKDJZeI4VmsQ7kNvwGX2dGW&_nc_oc=Adm66VeNXN5IviuI9wsUt3IsO9a9yLPwjQdhYjQVL_qog0qFK76ibEl5aWyZi10WUpM&_nc_zt=14&_nc_ht=scontent.frca1-1.fna&_nc_gid=sRRJdi9P9QpcvpjJz465tg&oh=00_Afg01KP_qiwR83JAx9yoHjJw_hBASVns7fKSadqS8IKZsA&oe=6943EBDB)

You can then see a breakdown of stats on the frame time taken on CPU:

![WebXR CPU Frame Time Stats](https://scontent.frca1-1.fna.fbcdn.net/v/t39.2365-6/359734833_1318998585697317_4169744549419227459_n.png?_nc_cat=108&ccb=1-7&_nc_sid=e280be&_nc_ohc=m3I_pjy21i0Q7kNvwHhJNAd&_nc_oc=Adk9zJtICGX_kLph0yXLWfDHLQr7lP8YWSyqhUkie1jMai5ITyO4u2QuFya8rPj_q9o&_nc_zt=14&_nc_ht=scontent.frca1-1.fna&_nc_gid=sRRJdi9P9QpcvpjJz465tg&oh=00_AfjSNDpV8JXuctsLPCxa-3lprmA8r8cBnaD8ORuJBwUvnA&oe=6943F03A)

## Documentation

Quite a bit of the information in the [Optimization Tools](https://developers.meta.com/horizon/documentation/unity/ts-book-tools/) section is relevant to Browser as well, although it’s largely written in the context of native app development and may not map one-to-one.

A couple of highlights are the following:

-   [Art Direction for All-in-One VR Performance](https://developers.meta.com/horizon/documentation/unity/po-art-direction/) - This page provides guidance on 3D content creation choices and considerations when building applications for Meta Quest headsets.-   [Accurately Measure an App’s Per-Frame GPU Cost](https://developers.meta.com/horizon/documentation/unity/po-per-frame-gpu/) - It’s important to measure any potential optimizations you make to ensure you’re actually getting the desired outcome. This page describes a method for getting repeatable measurements when iterating on specific optimizations.