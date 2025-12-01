Updated: Jun 24, 2025

This topic provides the basics for developing content for Browser. If you have an experience you would like to feature on the New Tab Page, use the submission process described on [New Tab Page Guidelines and Submission](https://developers.meta.com/horizon/documentation/web/browser-new-tab/) to submit for consideration.

## User-Agent String

This UA string should not be used for feature detection.

An example user-agent (UA) string for Browser is:

```
<span>Mozilla</span><span>/</span><span>5.0</span><span> </span><span>(</span><span>X11</span><span>;</span><span> </span><span>Linux</span><span> x86_64</span><span>;</span><span> </span><span>Quest</span><span> </span><span>3</span><span>)</span><span>
</span><span>AppleWebKit</span><span>/</span><span>537.36</span><span> </span><span>(</span><span>KHTML</span><span>,</span><span> like </span><span>Gecko</span><span>)</span><span>
</span><span>OculusBrowser</span><span>/</span><span>39.2</span><span>.</span><span>0.0</span><span>.</span><span>56.754450099</span><span>
</span><span>Chrome</span><span>/</span><span>136.0</span><span>.</span><span>7103.177</span><span>
VR
</span><span>Safari</span><span>/</span><span>537.36</span>
```

The “device token” of the UA string depends on the device model:

| Device | Device Token |
| --- | --- |
| 
Meta Quest

 | 

“Quest”

 |
| 

Meta Quest 2

 | 

“Quest 2”

 |
| 

Meta Quest Pro

 | 

“Quest Pro”

 |
| 

Meta Quest 3

 | 

“Quest 3”

 |
| 

Meta Quest 3S

 | 

“Quest 3”

 |
| 

Meta Quest 3S Xbox Edition

 | 

“Quest 3”

 |

Browser allows users to switch into mobile mode, in which case the “VR” token above becomes “Mobile VR”.

**Note: The Browser and Chromium version numbers may be newer than stated above.**

## Refresh Rate

For Meta Quest 2, Browser renders both 2D web page content and WebXR at a 90Hz refresh rate. On Quest, Browser uses a 72Hz refresh rate. When watching fullscreen media, Browser optimizes the device refresh rate based on the frame rate of the video.

## Browser Window Size

For 2D websites, users can resize the width of the content anywhere from 500px to 2000px, with a default width of 1280px. The height can be resized from 495px to 1070px, with a default of 670px.

| Panel Size | Width | Height |
| --- | --- | --- |
| 
Default

 | 

1280px

 | 

670px

 |
| 

Minimum

 | 

500px

 | 

495px

 |
| 

Maximum

 | 

2000px

 | 

1070px

 |

## Desktop & Mobile Mode

Browser supports both mobile and desktop browsing modes, with desktop as the default. In mobile mode, the Mobile token appears in the UA string and the meta viewport tag is supported. In desktop mode, there is no Mobile token in the UA string and any meta viewport tags are ignored. Developers should test in both modes to ensure compatibility. WebXR content should be made available based on feature detection rather than UA string sniffing.

## Debug Your Experiences

Browser supports using the Google Chrome (or other Chromium-compatible browsers) developer tools to debug sites on your Meta Quest device. This lets you access all of your familiar tools including the console, timeline, profiler, DOM viewer, etc. You’ll also be able to see a visual snapshot of what’s on screen in the headset right from your computer screen.

To get set up, you’ll need to enable Developer Mode on your headset and connect it to your computer using the Android Platform Tools. See [Debugging Your Content](https://developers.meta.com/horizon/documentation/web/browser-remote-debugging/) for how to get set up. Once set up and connected, your tabs from Browser will appear in the Remote Devices panel of the dev tools. Click Inspect to start debugging a tab in Browser.