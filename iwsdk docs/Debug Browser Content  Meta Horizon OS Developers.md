This page describes the numerous ways you can debug your Browser experience.

## Connecting to your device

Before debugging, you must connect to your device. You can use MQDH, USB, or Wi-Fi.

The preferred way to test and debug your Browser content is to use [Meta Quest Developer Hub](https://developers.meta.com/horizon/documentation/native/android/ts-mqdh/), which has tools to set up your device, enable desktop casting, and more. Visit the MQDH main page for instructions on how to set up MQDH to connect your device.

To configure your device for USB debugging:

-   On your mobile device, open the Meta Horizon app.
    -   In the app, tap the hamburger menu (the icon with three horizontal lines) next to the search bar. Then, tap **Devices** and select your headset from the results.
    
    **Video**: Shows selection of the Devices item in the hamburger menu.
    -   Tap **Headset Settings** beneath the image of your headset.
    
    ![Headset settings](https://scontent.frca1-1.fna.fbcdn.net/v/t39.2365-6/546616028_3681205788699914_3035320909496992215_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=ku_iDdghKi0Q7kNvwEfYCe9&_nc_oc=AdldD0cMghTdr8omcewZgfP5E0rYIJE5hkJXR3QxdwN29LfLGrYQGNSMNPn3sfDqIFQ&_nc_zt=14&_nc_ht=scontent.frca1-1.fna&_nc_gid=pHSLKxDewGzjM-W8tVQPag&oh=00_AfhPzq74mk1OOp444Ia0FZYnTrLBRNYOfi-28qpkM-kyPg&oe=6943E126)
    -   Tap **Developer Mode**.
    
    ![Developer mode list item](https://scontent.frca1-1.fna.fbcdn.net/v/t39.2365-6/548075717_3681205745366585_2361700326249191207_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=StqTTYKZ2sYQ7kNvwFkSH3X&_nc_oc=AdnNthw4bXtGwsPEutDO7DoJvboFVYx_91Fyj9s9fHY8P_BOYxOUVQktb_eELubqSdA&_nc_zt=14&_nc_ht=scontent.frca1-1.fna&_nc_gid=pHSLKxDewGzjM-W8tVQPag&oh=00_AfhL0ch2oPVbvMnCx98RyL2gkupe23CaYe7JqfwkAgSDZw&oe=6943EFAF)
    -   Turn on the **Developer Mode** toggle switch.
    
    ![Toggle Developer Mode to the on position](https://scontent.frca1-1.fna.fbcdn.net/v/t39.2365-6/552699568_3693305354156624_2208372356157753526_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=d8HLN6HAI8gQ7kNvwGo8uPg&_nc_oc=AdkKXxVViU7GCwvKoXUF3-Vd063fIjxT_w9E_eOf3OjrA7q11FCyKunshNFVQnrFX0Q&_nc_zt=14&_nc_ht=scontent.frca1-1.fna&_nc_gid=pHSLKxDewGzjM-W8tVQPag&oh=00_AfgWAA6ZevbmYR0-U3hFHY7C5hQyvG_Mdbeo-mMRm2Oh1A&oe=69440B33)
    -   Use a USB-C cable to connect the headset to your computer.
    -   Put on the headset.
    -   In the headset, go to **Settings** > **Advanced** > **Developer**, and then enable **Enable custom settings** and **MTP Notification**.
    -   When asked to allow USB debugging, select **Always allow from this computer**.
    
    ![Allow USB Debugging prompt](https://scontent.frca1-1.fna.fbcdn.net/v/t39.2365-6/123501957_688453455418503_2729454915805133542_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=lH3Q_q37bukQ7kNvwGCEF5x&_nc_oc=AdmeG4xrxXvMOTPjBDVXA0JOyxjbOlOVAVwWEee4klpp8GpM05Vg-whbO8-G60kXfnA&_nc_zt=14&_nc_ht=scontent.frca1-1.fna&_nc_gid=pHSLKxDewGzjM-W8tVQPag&oh=00_Afg1TnOUoJcKblGTdTopjjQi-f5RuhfWunzsf9pwg6Nbiw&oe=6943E3C5)
    

After connecting, open up a command shell and type:

If the device is connected properly, ADB will show the device ID list such as:

```
<span>List</span><span> of devices attached
ce0551e7                device</span>
```

ADB can’t be used if no device is detected. If your device is not listed, the most likely problem is that you do not have the correct USB driver. You can also try another USB cable and/or port.

### Use ADB Reverse to View Local Pages on your Quest

Use adb reverse to see local pages from your PC on your device.

A common web development workflow is to set up a local HTTP server on your desktop pointing to a port of `localhost`. You can use `adb reverse` to make that page available on your device while it is connected to your desktop.

To do this, run the following command: `adb reverse tcp:8080 tcp:8080`

Replace the `8080` with the port number that your HTTP server is running on.

## Enable Wi-Fi Debugging

Connecting to a device via USB is generally faster than using a TCP/IP connection, but a TCP/IP connection is sometimes indispensable.

To set up Wi-Fi debugging:

-   Complete the **Enabling USB Debugging** procedure above and then connect your device to your computer with a USB cable.-   Install [Android Platform Tools](https://dl.google.com/android/repository/platform-tools-latest-windows.zip), if you have not already installed the adb tool.-   Open a terminal or Windows command prompt window.-   Locate the **adb** tool if it is not already in your path. On Windows, it is typically located in `C:\Users\{user}\AppData\Local\Android\sdk\platform-tools`. Then, use the following command to determine the IP address for the device:

The output should look something like this:

```
<span>10.0</span><span>.</span><span>30.0</span><span>/</span><span>19</span><span> dev wlan0  proto kernel  scope link  src </span><span>10.0</span><span>.</span><span>32.101</span>
```

The IP address of the device follows `src`. Use the IP address and port 5555, and issue the following commands:

```
<span>adb tcpip </span><span>5555</span><span>
adb connect </span><span>*&lt;</span><span>ipaddress</span><span>&gt;*:</span><span>5555</span>
```

For example:

```
<span>&gt;</span><span> adb tcpip </span><span>5555</span><span>
    restarting </span><span>in</span><span> TCP mode port</span><span>:</span><span> </span><span>5555</span><span>
</span><span>&gt;</span><span> adb connect </span><span>10.0</span><span>.</span><span>32.101</span><span>:</span><span>5555</span><span>
    connected to </span><span>10.0</span><span>.</span><span>32.101</span><span>:</span><span>5555</span>
```

The device can now be disconnected from the USB port. As long as `adb devices` shows only a single device, all ADB commands will be issued for the device via Wi-Fi.

To stop using the Wi-Fi connection, issue the following ADB command from the OS shell:

After browsing to your website on the device in Browser, you can debug it remotely using the Chrome Developer tools.

To start a remote debugging session:

-   On the device, browse to your website in Browser.-   Launch Google Chrome.-   Navigate to chrome://inspect/#devices.-   Find your device, which will be followed by a set of Browser tabs currently open on the device.-   Click **inspect** to start debugging a tab in Browser.

## Debugging WebXR Content

The information on this page is for debugging two-dimensional and immersive WebXR experiences on Browser. For information about debugging strategies specifically for immersive WebXR experiences, see [WebXR Workflow](https://developers.meta.com/horizon/documentation/web/webxr-workflow/).

## Other Related Content

For more information about setting up your devices and debugging VR apps, see:

-   [Device Setup - Meta Quest](https://developers.meta.com/horizon/documentation/native/android/mobile-device-setup/)-   [ADB connection troubleshooting](https://developers.meta.com/horizon/documentation/native/android/ts-adb/)-   [Android Debugging](https://developers.meta.com/horizon/documentation/native/android/book-anddebug/)