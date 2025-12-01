Updated: Apr 2, 2025

This guide describes how to configure a website to be packaged as a PWA.

When setting up a PWA (applies to both 2D and immersive), you need to host a few different files on your website to make it PWA-compatible. **Note: Your website hosting must have an SSL certificate installed (https://) to create a PWA app.**

## Create Your Web App Manifest

All PWAs need a [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) file. If your website already has one, or if it’s already set up as a PWA for other platforms, please review the steps below for Meta Quest specific manifest fields.

The following steps describe how to create a Web App Manifest:

-   Create a file named “`manifest.webmanifest`”, and copy the following contents to the file:
    
    ```
    <span>{</span><span>
      </span><span>"short_name"</span><span>:</span><span> </span><span>"PWA Name"</span><span>,</span><span>
      </span><span>"name"</span><span>:</span><span> </span><span>"Full name of your PWA"</span><span>,</span><span>
      </span><span>"icons"</span><span>:</span><span> </span><span>[</span><span>
     </span><span>{</span><span>
       </span><span>"src"</span><span>:</span><span> </span><span>"/images/icons-192.png"</span><span>,</span><span>
       </span><span>"type"</span><span>:</span><span> </span><span>"image/png"</span><span>,</span><span>
       </span><span>"sizes"</span><span>:</span><span> </span><span>"192x192"</span><span>
     </span><span>},</span><span>
     </span><span>{</span><span>
       </span><span>"src"</span><span>:</span><span> </span><span>"/images/icons-512.png"</span><span>,</span><span>
       </span><span>"type"</span><span>:</span><span> </span><span>"image/png"</span><span>,</span><span>
       </span><span>"sizes"</span><span>:</span><span> </span><span>"512x512"</span><span>
     </span><span>}</span><span>
      </span><span>],</span><span>
      </span><span>"start_url"</span><span>:</span><span> </span><span>"https://domain.com/startpage/"</span><span>,</span><span>
      </span><span>"scope"</span><span>:</span><span> </span><span>"https://domain.com/"</span><span>,</span><span>
    </span><span>}</span>
    ```
    
    Store this file somewhere on your website.
    -   Populate the manifest using the following supported Web App Manifest fields:

| Name | Required / Optional | Description |
| --- | --- | --- |
| 
[`name`](https://developer.mozilla.org/en-US/docs/Web/Manifest/name)



 | 

Required

 | 

The name of your PWA. Currently, only left-to-right languages are supported for the name.

 |
| 

[`short_name`](https://developer.mozilla.org/en-US/docs/Web/Manifest/short_name)



 | 

Optional

 | 

A shorter version of the app name, if needed. This can be a maximum of 12 characters.

 |
| 

[`start_url`](https://developer.mozilla.org/en-US/docs/Web/Manifest/start_url)



 | 

Optional

 | 

You can specify a starting URL to load. If not provided, this will be derived from the `web-manifest-url`. The start page for your PWA should directly access your app’s main functionality or a login screen leading to it. Avoid using a marketing or info page. **At least one of the `start_url` and `web-manifest-url` must be provided** (both cannot be missing).

 |
| 

[`scope`](https://developer.mozilla.org/en-US/docs/Web/Manifest/scope)



 | 

Optional

 | 

This field allows you to specify what URL or paths should be considered as part of your app. It’s not required and you don’t need to put a value unless you have specific requirements, such as excluding portions of your website from your PWA. If not provided, this will be derived from the `start_url` field or the `web-manifest-url` parameter (whichever is provided, see information on those fields).

 |
| 

[`icons`](https://developer.mozilla.org/en-US/docs/Web/Manifest/icons)



 | 

Optional

 | 

It is used to specify one or more image files that define the icons to represent your web application. The icon image will be used by the UI bar in Meta Horizon OS and on the splash screen when the app launches.

 |
| 

[`theme_color`](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/theme_color)



 | 

Optional

 | 

Specify the theme color for your application. This color will only be visible when you are outside the [scope](https://developers.meta.com/horizon/documentation/web/pwa-overview-gs#scope-and-scope-extensions) of your application on the [Custom Tab Bar](https://developer.chrome.com/docs/android/custom-tabs), and will be used with the ‘Light’ system theme. The default value for this is `#FFFFFF`.

 |
| 

[`theme_color_dark`](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/theme_color)



 | 

Optional

 | 

Specify the theme color for your application. This color will only be visible when you are outside the [scope](https://developers.meta.com/horizon/documentation/web/pwa-overview-gs#scope-and-scope-extensions) of your application on the [Custom Tab Bar](https://developer.chrome.com/docs/android/custom-tabs), and will be used with the ‘Dark’ system theme. The default value for this is `#000000`.

 |
| 

[`additional_trusted_origins`](https://developer.chrome.com/docs/android/trusted-web-activity/multi-origin)



 | 

Optional

 | 

Specify additional origins to be considered as “in-scope” for the application. You will also need to [add additional asset-links to the other origins](https://developers.meta.com/horizon/documentation/web/pwa-2d-support#multi-origin-support). The format of this field should be: `“additional_trusted_origins”: [“www.origin_a.xyz”,”www.origin_b.xyz”]`

 |

All other fields are not currently supported and are ignored.

## Scope and Scope Extensions

PWA Scope determines what URLs are treated as “part of the web app” and which are not. Out-of-scope links within WebXR PWAs will be opened in the regular browser. In 2D PWAs, the link will open in the same or a new window based on the link target -- if target=\_blank, a regular browser instance will be opened. Otherwise, the link will open in a custom tabs instance in the same panel. This is often used for cases where a user needs to briefly navigate to an external site, such as an OAuth or other external login page.

## Browser-specific information

If you want to have different behaviors depending on the device, you can find basic information about Browser, including the User Agent string, supported content sizes, and more in our Browser [Getting Started](https://developers.meta.com/horizon/documentation/web/browser-specs/) guide. You can also connect the [Chrome Developer Tools](https://developers.meta.com/horizon/documentation/web/browser-remote-debugging/) from your computer to a Meta Quest device for debugging and performance analysis using the Android Platform Tools.

## Next Steps

Now that you have set up your app manifest, you can modify the website behavior based on the type of PWA you plan to make.

For WebXR developers, check out the [WebXR PWA](https://developers.meta.com/horizon/documentation/web/pwa-webxr) page for details on launching directly into an immersive experience.

For 2D website developers, the [2D PWA](https://developers.meta.com/horizon/documentation/web/pwa-2d-support) page has more information on 2D website specific functionality.

If your website is ready to package you can continue to [PWA Packaging](https://developers.meta.com/horizon/documentation/web/pwa-packaging).

## Frequently Asked Questions

### How to debug PWAs on Quest devices?

You can connect the [Chrome Developer Tools](https://developers.meta.com/horizon/documentation/web/browser-remote-debugging/) from your computer to a Meta Quest device for debugging. You will be able to see your website tab being loaded in `chrome://inspect` after your PWA is launched. Click **inspect** to start debugging that tab in Browser.