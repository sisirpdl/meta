## Building Your Experience

## Debugging Your Experience

However, you may also want to test your content without having to enter your headset each time. There are two options for this: use the WebXR emulator, or cast your device to desktop using the [Meta Quest Developer Hub](https://developers.meta.com/horizon/documentation/web/browser-mqdh/).

### Using the Immersive Web Emulator

The Immersive Web Emulator allows you to debug your WebXR Experiences on your desktop (using Chrome, Edge and other Chromium-based browsers), without a headset. It can be installed as a browser plugin for [Chrome](https://chrome.google.com/webstore/detail/immersive-web-emulator/cgffilbpcibhmcfbgggfhfolhkfbhmik) or [Edge](https://microsoftedge.microsoft.com/addons/detail/immersive-web-emulator/hhlkbhldhffpeibcfggfndbkfohndamj).

### Other Tools for Testing Immersive Content

WebXR uses WebGL to render content under the hood, and so it’s possible to use various tools for debugging WebGL content to also debug WebXR content (rendered on desktop via the WebXR emulator):

[Spector.js](https://spector.babylonjs.com/) allows you to examine your WebXR scene’s draw calls, and is a useful debugging tool for diagnosing graphical errors. Note that Spector.js only works on desktop browsers, not Browser, and thus should be used with the WebXR emulator.

## Optimizing Your Experience

Performance may be the single most important factor in making a WebXR experience look complete and polished. There are tools and guidelines for identifying and fixing performance bottlenecks described in the [Performance Optimization](https://developers.meta.com/horizon/documentation/web/webxr-perf/) section.

## Publishing Your Experience

A WebXR experience is just a normal web page, so it can be served online like any other site.

Browser also features WebXR experiences on the New Tab Page. If you have created a WebXR experience that you’d want to get featured, see [the submissions guidelines page.](https://developers.meta.com/horizon/documentation/web/browser-new-tab/)

WebXR Submission Form

After following the guidelines and confirming you meet the technical requirements, submit your experience with the [WebXR Submission form](https://fb.me/ntp) to be considered for the New Tab Page.

## Getting More Help

### WebXR Discord

Members of the Browser team are present on the [WebXR Discord community](https://discord.com/invite/Jt5tfaM) and actively monitor the #browser channel.