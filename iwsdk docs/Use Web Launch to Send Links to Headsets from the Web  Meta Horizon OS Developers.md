Web Launch allows developers to let users send a website URL to their Meta Quest headset directly from a site on their computer or phone, or save the URL for later. This URL opens in the headset on Browser.

### Web Launch Requirements

The target URL must use HTTPS and be URL encoded.

Here are examples of a URL using HTTPS:

-   Correct URL: https://www.meta.com-   Incorrect URL: www.meta.com

The target URL must be appended to the end of https://www.oculus.com/open\_url/?url= using UTF-8 encoding for the special characters. Here’s a code sample and some examples of appending a URL to the endpoint using URL encoding:

Code sample:

```
<span>let</span><span> sendToQuestUrl </span><span>=</span><span> </span><span>new</span><span> URL</span><span>(</span><span>"https://oculus.com/open_url/"</span><span>)</span><span>
    sendToQuestUrl</span><span>.</span><span>searchParams</span><span>.</span><span>set</span><span>(</span><span>"url"</span><span>,</span><span> linkUrl</span><span>)</span><span>`</span>
```

-   Correct URL: https://www.oculus.com/open\_url/?url=https%3A%2F%2Fwww.meta.com-   Incorrect URL : https://www.oculus.com/open\_url/?url=https://www.meta.com-   This is done so users know what devices a link supports and for brand guideline purposes

It is also strongly recommended to use Meta Quest branding on the button or call site where this call is triggered.

## Web Launch Usage

To integrate this into your site, implement the Web Launch endpoint below:

```
<span>https</span><span>:</span><span>//www.oculus.com/open_url/?url=&lt;url_to_open_in_headset&gt;</span>
```

Here’s an example of how to integrate the endpoint in HTML:

```
<span> </span><span>&lt;a</span><span> </span><span>href</span><span>=</span><span>"https://www.oculus.com/open_url/?url=https%3A%2F%2Fwww.meta.com"</span><span>&gt;</span><span>Open Meta.com on your Meta Quest headset</span><span>&lt;/a&gt;</span>
```

Here’s how to do it with JavaScript:

```
<span>function</span><span> sendLinkToQuest </span><span>(</span><span>linkUrl</span><span>)</span><span> </span><span>{</span><span>
  </span><span>let</span><span> sendToQuestUrl </span><span>=</span><span> </span><span>new</span><span> URL</span><span>(</span><span>"https://oculus.com/open_url/"</span><span>);</span><span>
  sendToQuestUrl</span><span>.</span><span>searchParams</span><span>.</span><span>set</span><span>(</span><span>"url"</span><span>,</span><span> linkUrl</span><span>);</span><span>
  window</span><span>.</span><span>location</span><span>.</span><span>href </span><span>=</span><span> sendToQuestUrl</span><span>;</span><span>
</span><span>}</span><span>

sendLinkToQuest</span><span>(</span><span>"https://www.meta.com"</span><span>);</span>
```