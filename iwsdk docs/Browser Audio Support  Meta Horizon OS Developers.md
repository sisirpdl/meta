Updated: Jan 14, 2025

This page outlines audio support for the Browser.

## Dolby audio

In order to determine if Dolby audio is supported you should use the [Media Capabilities API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Capabilities_API).

For example:

```
<span>async</span><span> </span><span>function</span><span> isDolbySupported</span><span>()</span><span> </span><span>{</span><span>
  </span><span>const</span><span> mediaConfig </span><span>=</span><span> </span><span>{</span><span>
    type</span><span>:</span><span> </span><span>'media-source'</span><span>,</span><span>
    audio</span><span>:</span><span> </span><span>{</span><span>
      contentType</span><span>:</span><span> </span><span>'audio/mp4; codecs="ac-3"'</span><span>,</span><span>
      spatialRendering</span><span>:</span><span> </span><span>true</span><span>,</span><span>
    </span><span>}</span><span>
  </span><span>}</span><span>
  </span><span>const</span><span> results </span><span>=</span><span> </span><span>await</span><span> navigator</span><span>.</span><span>mediaCapabilities</span><span>.</span><span>decodingInfo</span><span>(</span><span>mediaConfig</span><span>);</span><span>
  </span><span>return</span><span> results</span><span>.</span><span>supported</span><span>;</span><span>
</span><span>}</span>
```

Supported codecs:

-   AC3-   EAC3

Note the following limitations:

-   AC4 is not supported at this time.-   Encrypted audio is not supported at this time.