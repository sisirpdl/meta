Now that you have a working IWSDK project, it’s time to launch it and see it in action. This guide covers how to run your development server and test your WebXR experience using both browser emulation and a physical VR headset.

## Running your project

First, let’s navigate to your project and get the development server started.

### Navigate to your project

In the terminal, navigate to the project folder you specified in the **Project Name** section of [Setup your first WebXR project](https://developers.meta.com/horizon/documentation/web/iwsdk-guide-project-setup):

```
<span>cd </span><span>my</span><span>-</span><span>iwsdk</span><span>-</span><span>app  </span><span># Replace with your actual project name</span>
```

### Install dependencies if needed

If you chose **No** when asked to install dependencies during project creation, install them now:

This will install all the necessary packages.

### Launch the development server

Start your development server:

You should see output similar to:

```
<span>  VITE v7</span><span>.</span><span>1.4</span><span>  ready </span><span>in</span><span> </span><span>1234</span><span> ms

  </span><span>➜</span><span>  </span><span>Local</span><span>:</span><span>   https</span><span>:</span><span>//localhost:8081/</span><span>
  </span><span>➜</span><span>  </span><span>Network</span><span>:</span><span> https</span><span>:</span><span>//192.168.1.100:8081/</span><span>
  </span><span>➜</span><span>  press h </span><span>+</span><span> enter to show help</span>
```

**Note**: HTTPS is required. The URL uses **HTTPS** (not HTTP). This is required for WebXR to work - browsers only allow WebXR on secure origins. Vite automatically generates a self-signed certificate for local development.

Your development server is now running and ready for testing.

## Testing your project

Now that your development server is running, you can test your WebXR experience in two ways: with a physical headset for the full immersive experience, or on your desktop using IWER emulation.

### Option 1: Testing with a physical headset

If you have access to a VR headset, this provides the best testing experience for your WebXR application.

#### Recommended headset

We recommend using a [Meta Quest 3](https://www.meta.com/quest/quest-3/) or [Quest 3S](https://www.meta.com/quest/quest-3s/) for development, as this tutorial is designed with these devices in mind. Other devices like the **Meta Quest 2** or **Pico 4** should also work well.

The Meta Quest series has excellent WebXR support built into the headset’s browser.

You can access the local development server from your XR headset using one of two methods: through your computer’s IP address or by using ADB with port forwarding.

#### Method 1: Access through IP address (recommended)

On most home networks, you can access the local server directly. Your headset must be connected to the same Wi-Fi network as your computer.

-   Put on your headset and navigate to the browser app.-   Find your computer’s IP address in the Vite dev server output (look for the value of **Network**).
    -   Example output: `➜ Network: https://192.168.1.100:8081/`-   Enter the development URL in your headset’s browser: `https://192.168.1.100:8081`-   Accept the certificate warning (this is normal for local development with self-signed certificates).-   Click **Enter XR** when the page loads.

#### Method 2: Access through ADB port forwarding (fallback)

If accessing through IP address doesn’t work due to network restrictions or firewall settings (which are common on corporate networks), use ADB (Android Debug Bridge) with port forwarding.

-   Connect your headset to your computer with a USB cable.-   Enable developer mode on your headset (check your device’s documentation for instructions).-   Set up port forwarding.
    -   Open Chrome on your computer and navigate to `chrome://inspect/#devices`.
        
        Your headset should appear under **Remote Target**.
        -   Click **Port forwarding...** in Chrome DevTools.-   Add a rule to forward port `8081` from your computer to your headset.-   Access the local server on your headset by entering `https://localhost:8081` in the browser.-   Accept the certificate warning.-   Once the page loads, click **Enter XR**.

Here’s what your WebXR experience looks like when running on a Meta Quest 3 device.

### Option 2: Testing with IWER (browser emulation)

IWER (Immersive Web Emulator Runtime) is a WebXR emulator that runs entirely in your browser, allowing you to develop and test WebXR applications without a headset. IWER automatically activates when no real WebXR device is detected and provides mouse/keyboard controls to simulate VR interactions.

### How IWER integration works

IWER is automatically injected into your project through the `injectIWER` Vite plugin in your `vite.config.ts`:

```
<span><span>injectIWER({</span></span><br><span><span>&nbsp;&nbsp;device:&nbsp;</span><span>'metaQuest3'</span><span>,</span></span><br><span><span>&nbsp;&nbsp;activation:&nbsp;</span><span>'localhost'</span><span>,</span></span><br><span><span>&nbsp;&nbsp;verbose:&nbsp;</span><span>true</span><span>,</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

**Configuration options:**

-   **`device`**: Which headset to emulate (`metaQuest2`, `metaQuest3`, `metaQuestPro`, or `oculusQuest1`). More headset presets and custom headset configuration support coming soon.-   **`activation`**: Controls when IWER activates. The default `'localhost'` is smart - it activates IWER when you access the site from localhost (typically your computer, which needs emulation), but not when accessing through IP address (typically from a headset with native WebXR support).-   **`userAgentException`**: Adds an extra layer of protection by skipping IWER activation if the browser’s user agent matches a pattern (like `OculusBrowser`). This ensures IWER won’t activate on headsets even when using ADB port forwarding with localhost.-   **`sem`**: Synthetic Environment Module for AR scene understanding (AR projects only)

To test with IWER, simply open `https://localhost:8081` in your desktop browser and click **Enter XR**. Here’s what the emulated experience looks like:

## Next steps

You now have a running WebXR application and understand how to test it both in the browser with IWER emulation and on a physical headset.

Other pages in this section dive into creating and manipulating 3D objects using Three.js fundamentals within the IWSDK framework.