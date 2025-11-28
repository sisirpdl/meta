Meta Quest Developer Hub (MQDH) is a standalone companion development tool for Meta Quest headsets. For information on how to set up and general usage, [visit the Meta Quest Developer Hub page here](https://developers.meta.com/horizon/documentation/native/android/ts-mqdh/).

MQDH is a useful tool for a variety of applications, and has a set of tools that are useful for 2D and WebXR browser development:

## Enable ADB over Wi-Fi

Enabling [ADB over Wi-Fi](https://developers.meta.com/horizon/documentation/native/android/ts-mqdh#enable-adb-over-wifi) using MQDH is the preferred method for connecting your device to your desktop for debugging Browser applications.

## Cast headset to desktop

For WebXR experiences, this is an alternative to using the WebXR emulator -- the emulator will display your experience in your desktop web browser, while casting from device runs it directly on Browser.

## Take screenshots and videos

MQDH also allows you to take [screenshots and videos](https://developers.meta.com/horizon/documentation/native/android/ts-mqdh#odh-media) of your experience from the desktop, which can be useful if you’re casting from your headset.

## Send a URL to Browser from desktop

You can use MQDH to open a URL from your desktop web browser directly on your device in Browser. This avoids typing URLs manually on the device.

-   Follow the instructions to [connect your headset over USB or Wi-Fi to MQDH](https://developers.meta.com/horizon/documentation/native/android/ts-mqdh#connect-headset-to-odh).-   In MQDH, navigate to **Device Manager**.-   In the **Device Actions** card, find the **Browser** action.-   Type or paste a URL and select **Open** to send a command that opens the webpage on your device.

![Share URL to Browser from MQDH](https://scontent.frca1-1.fna.fbcdn.net/v/t39.2365-6/580074680_3753571291463363_5952320797016091797_n.png?_nc_cat=109&ccb=1-7&_nc_sid=e280be&_nc_ohc=R0gWrG5JJRgQ7kNvwEWCGzT&_nc_oc=Adnh_AhoWIOhSq9wly1zjVf0-PZRichzo9BA8cm2-tzoINMmMrW2Wo7AUD0EjrcyRBc&_nc_zt=14&_nc_ht=scontent.frca1-1.fna&_nc_gid=yyY8uo_dPdod3feZmyIDRQ&oh=00_AfiH0SNewPc0UcM9nZrcCXV1q-WJ6tcBennzPQskc4lfnw&oe=6943F311)

## Integration with OVRMetrics