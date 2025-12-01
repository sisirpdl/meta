Updated: Jun 18, 2025

PWAs enable developers to package web apps into Meta Quest applications. Users can download PWAs from the Horizon Store just like any other app.

## How does it work?

For Meta Horizon OS, PWAs are built using [Bubblewrap](https://github.com/meta-quest/bubblewrap), a tool to package your Progressive Web App into an Android App Bundle. With it, you can create an Android application that launches PWAs using “[Trusted Web Activity](https://developer.chrome.com/docs/android/trusted-web-activity)”, a mechanism to access web content from an Android app. Developers also have access to in-app purchase capabilities via the [Digital Goods API](https://wicg.github.io/digital-goods/).

## What type of PWAs are supported?

The Meta Horizon Store currently supports immersive WebXR and 2D PWAs. Support for Hybrid PWAs, which switch between 2D and immersive, will be available later. 2D PWAs leverage web content available today while immersive PWAs are web experiences built using WebXR. WebXR PWAs launch directly into immersive MR/VR and provide a similar experience to native MR/VR applications on the Meta Quest.

## How do I get started?

If you have an existing WebXR experience, you can start testing the website version of it today using Meta Quest’s built-in [web browser](https://developers.meta.com/horizon/documentation/web/), as WebXR PWAs and Quest’s Browser are powered by the same web rendering engine. Remember that PWAs need to adhere to the same [policies](https://developers.meta.com/horizon/policy/) and [Virtual Reality Checks](https://developers.meta.com/horizon/resources/publish-quest-req/) (VRCs) as other apps in the Horizon Store.

The [Getting Started with PWAs](https://developers.meta.com/horizon/documentation/web/pwa-overview-gs/) page lists the preparation work required before you can package your web experience as a PWA.

The [PWA Tools and Packaging](https://developers.meta.com/horizon/documentation/web/pwa-packaging/) page describes the required tooling and detailed steps of how you can create a PWA APK package from your existing URL.

The [Distribute](https://developers.meta.com/horizon/distribute/) section provides the steps for submitting your PWA APK to Meta Horizon Store.

A key VRC to be aware of is the [Quest.Performance.3](https://developers.meta.com/horizon/resources/vrc-quest-performance-3) startup time requirement. WebXR experiences typically load assets before a session begins. However, because WebXR PWAs launch directly into immersive mode, pre-loaded assets count against this requirement. For PWAs, it’s a best practice to load as many assets as possible after the WebXR session initiates.

## How can I learn more about PWAs?

There are plenty of existing resources you can check out right now:

-   [WebXR](https://developers.meta.com/horizon/documentation/web/webxr-overview/) - The WebXR Device API lets you develop immersive VR experiences on the web, and is supported in multiple browsers. Some key resources here include our pages on [Developer Workflow](https://developers.meta.com/horizon/documentation/web/webxr-workflow/) and [Debugging Browser Content](https://developers.meta.com/horizon/documentation/web/browser-remote-debugging/).
    -   [Bubblewrap](https://github.com/meta-quest/bubblewrap) - A Command Line Interface (CLI) that helps developers create a Project for an Android application, launching a PWA using a Trusted Web Activity.
    -   [Android PWA Codelab](https://developers.google.com/codelabs/pwa-in-play#0) - Applied learning for using Bubblewrap to create Android based PWAs.