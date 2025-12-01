By default, Browser 7.0 and later supports [WebXR](https://immersive-web.github.io/webxr/), the latest standard for fully immersive (6DOF) VR web experiences. WebXR is the evolution of WebVR API, which although not a standard, was adopted by many browsers. WebVR is no longer supported as of Browser 9.0.

This article describes how to migrate existing content written for WebVR to the WebXR API.

## HTTPS is Required

The standard for WebXR requires that the API is only available to sites loaded over a secure connection (HTTPS). For production use, you will need to use a secure origin to support WebXR. If you don’t already support HTTPS, you can get started using [Let’s Encrypt](https://letsencrypt.org/). For development purposes, Browser allows WebXR on localhost servers without a secure connection or SSL certificate.

## Using Frameworks

For most developers, updating from WebVR to WebXR is a simple matter of updating to the latest versions of the framework you use. Popular VR frameworks like A-Frame, Babylon.js, and THREE.js all support WebXR. See below for the minimum versions needed as well as where to get them:

React 360 currently does not support WebXR. As a result, it is not currently supported in Browser. If you’re using React 360, we recommend considering moving to A-Frame. To get started, see this tutorial on [using 360 media in A-Frame](https://aframe.io/docs/1.0.0/guides/building-a-360-image-gallery.html).

## Supporting Legacy WebVR Browsers

Due to automatic updates, nearly all Browser users are on a version that supports WebXR. However, if you need to support browsers that only have WebVR, then you can use the [WebXR polyfill](https://github.com/immersive-web/webxr-polyfill) which allows you to code to WebXR but have it run on WebVR enabled browsers.

## Migrating Custom WebVR Code