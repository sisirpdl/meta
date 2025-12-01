The Meta Horizon platform supports high resolution video, useful for immersive video. Browser has an efficient decoding pipeline and is optimized for high quality video playback.

High bitrate and high resolution media can put a load on the device. During high quality playback, only play a single video at a time and keep the complexity of your site to only what is required.

## Codec and Container Support

All Meta Quest devices have hardware support for video decoding.

Browser supports the following container formats:

-   [MP4](https://en.wikipedia.org/wiki/MPEG-4_Part_14) (including [MPEG-DASH](https://en.wikipedia.org/wiki/Dynamic_Adaptive_Streaming_over_HTTP))-   [Ogg](https://en.wikipedia.org/wiki/Ogg)-   [WebM](https://en.wikipedia.org/wiki/WebM)

Browser supports the following codecs:

-   [h.264](https://en.wikipedia.org/wiki/Advanced_Video_Coding)-   [h.265](https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding)-   [vp8](https://en.wikipedia.org/wiki/VP8)-   [vp9](https://en.wikipedia.org/wiki/VP9)-   [AV1](https://en.wikipedia.org/wiki/AV1)

Note that AV1 isn’t hardware decoded on Meta Quest 2 and Meta Quest Pro. Note that vp8 isn’t hardware decoded on Meta Quest 3 and Meta Quest 3S.

For all formats, Browser supports 4K and supports 8K on h.265 and AV1.

While support is documented on this page, we strongly recommend developers to use the [Media Capabilities API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Capabilities_API) to discover what is supported by the Browser in order to avoid relying on UA sniffing or other techniques. This API allows checking if a given format is supported and can be hardware decoded. It can also be used to check if L1 DRM is supported on a specific configuration.

## High-Resolution Video Best Practices

### WebXR Session

[WebXR Media Layers](https://developers.meta.com/horizon/documentation/web/webxr-layers/) are the most efficient way to display immersive video. If possible, design your experience around this API.

WebXR Layers offer a similar efficiency but need to be coded carefully to get to the same level of performance. Cross origin content may not work.

Regular WebXR has higher overhead and may also show some image degradation.

### 2D Webpage

Browser also supports immersive display for video on regular 2D web pages. If a user puts a video in full screen, they can select to reproject it to a custom projection such as spherical 360 or 180 degree equirect. They can also choose between a monoscopic mode or a stereoscopic mode of left-right or top-bottom. For these experiences, these are the maximum sizes that the video is displayed in:

-   Meta Quest: 3840x2160-   Meta Quest 2: 7680x3840

For this workflow, pick a video resolution that is lower or equal to these. For instance, on Quest it wouldn’t make sense to play a 5760x2880 video this way because it will be downscaled to 3840x2160.

During playback of 2D video, the operating system will do its best to match the frame rate of the device to the frame rate of the video to ensure a smooth experience that doesn’t show some frames more than others.