Updated: Mar 27, 2025

2D PWAs behave similarly to the website’s appearance in browser, but launch as a standalone app separate from the browser. Below are specific customizations and expectations for 2D PWAs.

## PWA Expectations

## Standalone Launch

PWAs launch as single-instance, standalone applications with their own entry in the Library. By default, there is no tab or navigation bar on the panel, and the website data and cookies are shared between the Browser and the application.

## Link Scope:

Out of scope links will open in the PWA by default unless specified to open in a new tab or window, in which case they will open in the regular browser.

## Theme color

The theme color is used when a user is outside the scope of the main application. The color value will be `theme_color` or `theme_color_dark` depending on the system theme and will only affect the custom tab bar on the panel.

## Multi-origin support

Any site that you would like to remain “in-scope” for the PWA should be specified in the PWA manifest under “additional\_trusted\_origins”. These additional sites must have the digital fingerprint file (`/.well-known/assetlinks.json`) that is hosted on your main website and will be treated the same as the main website.

## Media

## Next Steps

Once you have set up and hosted your web app manifest, check out the [PWA Packaging](https://developers.meta.com/horizon/documentation/web/pwa-packaging) page to build your installable application.