Updated: Mar 27, 2025

LIMITED PWA DISTRIBUTION

Meta Horizon Store currently supports both 2D and immersive WebXR Progressive Web App (PWA) distributions. Support for Hybrid (can switch between 2D and immersive) PWAs will be available later.

This page explains how to use packaging tools to convert a web experience into an APK for Store submission.

Before packaging your PWA, it’s recommended to first create a place for your app using the Developer Dashboard. Follow the steps in [Create apps](https://developers.meta.com/horizon/resources/publish-create-app/) to create your app page. By doing this, you will also generate an app ID. You need to create an app page and have an app ID before you can create a PWA APK with In-App purchase support.

Bubblewrap is an open-source tool to make wrapping your Progressive Web App into an Android App Bundle as easy as running a couple of CLI commands. It generates an Android project that launches your PWA as a [Trusted Web Activity](https://developer.chrome.com/docs/android/trusted-web-activity). Meta uses a custom forked version of Bubblewrap CLI to support the immersive launch experiences and Meta Horizon Store API connections, including in-app-purchase APIs.

-   Download the Meta Forked Bubblewrap CLI from the [github repo](https://github.com/meta-quest/bubblewrap).
    -   Extract the `bubblewrap` directory, navigate to the directory, and install the dependency libraries. **NOTE: If you are using a Windows device, make sure your NodeJS version is 21.0.0**:
    
    ```
    <span> cd bubblewrap
     npm install
     npm run build</span>
    ```
    -   Create an alias for the bubblewrap command:
    
    **MacOS**
    
    ```
    <span> </span><span>alias</span><span> bubblewrap</span><span>=</span><span>"/YOUR_DIRECTORY/bubblewrap/packages/cli/bin/bubblewrap.js"</span>
    ```
    
    **Windows**
    
    ```
    <span> </span><span>function</span><span> bubblewrap</span><span>-</span><span>aux </span><span>{</span><span>node c</span><span>:</span><span>\open\fbsource\third</span><span>-</span><span>party\bubblewrap</span><span>-</span><span>chrome\packages\cli\b</span><span>in</span><span>\bubblewrap</span><span>.</span><span>js $args</span><span>};</span><span>
     </span><span>set</span><span>-</span><span>alias</span><span> </span><span>-</span><span>name bubblewrap </span><span>-</span><span>value bubblewrap</span><span>-</span><span>aux</span><span>;</span>
    ```
    

## Create and Install a PWA App Package (APK)

### Create your Web Manifest file

Create a web manifest file for your domain _https://domain.com/manifest.webmanifest_ if you haven’t already. This manifest file will be used as a baseline to generate configurations for your PWA. Fill in the values that you want for your PWA. You can find more information in the [getting started](https://developers.meta.com/horizon/documentation/web/pwa-overview-gs#create-your-web-app-manifest) page.

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

### Bubblewrap your application into an APK

Once you have the [Web App Manifest file](https://web.dev/articles/add-manifest), you can create an App Package (APK) for the Meta Horizon Store using the Bubblewrap CLI.

-   To use the CLI, create a project directory, and navigate to the directory:
    
    ```
    <span> mkdir </span><span>my</span><span>-</span><span>pwa </span><span>&amp;&amp;</span><span> cd </span><span>my</span><span>-</span><span>pwa</span>
    ```
    -   Run the `bubblewrap init` command with your website URL:
    
    ```
    <span> bubblewrap init </span><span>--</span><span>manifest</span><span>=</span><span>https</span><span>:</span><span>//domain.com/manifest.webmanifest --metaquest</span>
    ```
    
    This generates a default Android Webapp project from the Web App Manifest. An in-console wizard starts, allowing you to override the default configuration.
    

ANDROID SDK AND JDK INSTALLATION

When Bubblewrap is run for the first time, it will ask for downloading the Java Development Kit (JDK) and the Android command-line tools. To ensure the correct versions are downloaded for each dependency, we strongly recommend allowing Bubblewrap to download the correct versions instead of using one already available on your computer.

#### App Mode

You will be asked to select the app mode of your PWA in Horizon OS, which will be either `2D` or `immersive`.

#### Application ID

While creating the PWA using our CLI tool, you must specify the package name (Application ID). The Application ID is important for you to upload to the Store because **subsequent updates will require an identical Application ID** for each submission.

#### Display Mode

The recommended display mode for a 2D application is `standalone` with the `landscape` orientation. You may also select `portrait` if you prefer a vertical panel.

#### Horizon Billing Feature

Make sure the Meta Horizon Store Billing feature is enabled if you want to access the In-App-Purchase functionalities inside your PWA.

Enter your app ID number from Meta Developer Dashboard. You have to provide a correct ID here to make In-App purchase work properly in your PWA. You can find your app ID number in the URL bar of your browser when viewing your app on the App Manager page of the [Meta Developer Dashboard](https://developers.meta.com/horizon/manage). For example: developer.oculus.com/manage/applications/**0000000000000000**/.

#### Signing Keys

Meta Horizon Store requires application packages to be digitally signed with a certificate when uploaded. All developers must create their own unique digital signature and sign their applications before submitting them to Meta for approval. For more information, check the [Android Application Signing](https://developers.meta.com/horizon/resources/publish-mobile-app-signing/) page. Bubblewrap will ask for the path for the key when creating the application.

**Note**: If you are creating an APK for an existing application listed Meta Horizon Store, you will need to add the path to the same key used by that application.

If you do not have an existing signing key and are creating a new listing on the Meta Horizon Store, you can use the default value provided by Bubblewrap to have it create a new release signing key for you. Make sure to save the keystore file you use to sign your application. All subsequent updates to your application must be signed with the same certificate file.

```
<span>Signing</span><span> key information </span><span>(</span><span>5</span><span>/</span><span>5</span><span>)</span><span>
</span><span>Please</span><span>,</span><span> enter information about the key store containing the keys that will be used
to sign the application</span><span>.</span><span> </span><span>If</span><span> a key store does </span><span>not</span><span> exist on the provided path</span><span>,</span><span>
</span><span>Bubblewrap</span><span> will prompt </span><span>for</span><span> the creation of a </span><span>new</span><span> keystore</span><span>.</span><span>
</span><span>-</span><span> </span><span>Key</span><span> store location</span><span>:</span><span> </span><span>The</span><span> location of the key store </span><span>in</span><span> the file
  system</span><span>.</span><span>
</span><span>-</span><span> </span><span>Key</span><span> name</span><span>:</span><span> </span><span>The</span><span> </span><span>alias</span><span> used on the key</span><span>.</span><span>
</span><span>Read</span><span> more about </span><span>Android</span><span> signing keys at</span><span>:</span><span>
 https</span><span>:</span><span>//developer.android.com/studio/publish/app-signing</span><span>
</span><span>?</span><span> </span><span>Key</span><span> store location</span><span>:</span><span> </span><span>/YOUR_PATH/</span><span>android</span><span>.</span><span>keystore
</span><span>?</span><span> </span><span>Key</span><span> name</span><span>:</span><span> android</span>
```

#### Build your APK file

After you’ve initialized your Android Webapp project, you can build your app apk within the same directory you ran Bubblewrap’s initialization command.

**Note**: You will need the passwords for your signing key for this step.

Make sure the **app-release-signed.apk** file is generated in your directory.

## Create Digital Asset Link for your PWA

### What is digital asset link?

The Digital Asset Links protocol and API enable an app or website to make public, verifiable statements about other apps or websites. For example, a website can declare that it is associated with a specific Android app, or it can declare that it wants to share user credentials with another website. In the PWA use case this file is used to prove your web app and your PWA are both owned by you.

### Digital Asset Link requirement for WebXR PWAs

In Meta Horizon OS, WebXR PWAs **will not launch** if the Digital Asset Link verification doesn’t pass.

### Get Your Digital Asset Link file

Get the SHA-256 fingerprint of the signing key you used when building your PWA APK via the following Java keytool command:

```
<span>keytool </span><span>-</span><span>list </span><span>-</span><span>v \
    </span><span>-</span><span>keystore </span><span>&lt;</span><span>keystore</span><span>-</span><span>file</span><span>-</span><span>path</span><span>&gt;</span><span> \
    </span><span>-</span><span>alias</span><span> </span><span>&lt;</span><span>key</span><span>-</span><span>alias</span><span>&gt;</span><span> \
    </span><span>-</span><span>keypass </span><span>&lt;</span><span>key</span><span>-</span><span>password</span><span>&gt;</span><span> \
    </span><span>-</span><span>storepass </span><span>&lt;</span><span>store</span><span>-</span><span>password</span><span>&gt;</span><span> </span><span>|</span><span> grep SHA256

$    </span><span>Signature</span><span> algorithm name</span><span>:</span><span> SHA256withRSA
$    SHA256</span><span>:</span><span> BD</span><span>:</span><span>92</span><span>:</span><span>64</span><span>:</span><span>B0</span><span>:</span><span>1A</span><span>:</span><span>B9</span><span>:</span><span>08</span><span>:</span><span>08</span><span>:</span><span>FC</span><span>:</span><span>FE</span><span>:</span><span>7F</span><span>:</span><span>94</span><span>:</span><span>B2</span><span>...</span>
```

Create Your Digital Asset Links File using the following command within the same directory created during Bubblewrapping Your PWA. Replace `<fingerprint>` with the fingerprint (for example `BD:92:64:B0:1A:B9:08:08:FC:FE:7F:94:B2...`) copied from the previous step.

```
<span>bubblewrap fingerprint add </span><span>&lt;fingerprint&gt;</span>
```

This command will add the fingerprint to the application’s fingerprint list and generate an **assetlinks.json** file. Upload this file to the `.well-known` directory on the same website domain as your PWA. (_https://domain.com/.well-known/assetlinks.json_)

**Note:** The `keytool` command may not be available if you haven’t installed any JDK in your OS already. If you met with this issue, you will be able to find the executionable binary under the JDK directory created by bubblewrap. For example, in Mac OS the keytool script can be found under

```
<span>$</span><span>{</span><span>USER_HOME</span><span>}/.</span><span>bubblewrap</span><span>/</span><span>jdk</span><span>/</span><span>jdk</span><span>-</span><span>11.0</span><span>.</span><span>9.1</span><span>+</span><span>1</span><span>/</span><span>Contents</span><span>/</span><span>Home</span><span>/</span><span>bin</span>
```

### Multiple PWAs from a single domain

The `assetlinks.json` file is a json array of package names and fingerprints. It is possible to add the ownership of multiple PWA apps within a single domain. To do that, just concatenate the asset link statements into the array similar to the following:

```
<span>[{</span><span>
    </span><span>"relation"</span><span>:</span><span> </span><span>[</span><span>"delegate_permission/common.handle_all_urls"</span><span>],</span><span>
    </span><span>"target"</span><span>:</span><span> </span><span>{</span><span>
      </span><span>"namespace"</span><span>:</span><span> </span><span>"android_app"</span><span>,</span><span>
      </span><span>"package_name"</span><span>:</span><span> </span><span>"pwa.application.id.1"</span><span>,</span><span>
      </span><span>"sha256_cert_fingerprints"</span><span>:</span><span> </span><span>[</span><span>
        </span><span>"BD:92:64:B0:1A:B9:08:08:FC:FE:7F:94:B2..."</span><span>
      </span><span>]</span><span>
    </span><span>}</span><span>
</span><span>},</span><span>
</span><span>{</span><span>
    </span><span>"relation"</span><span>:</span><span> </span><span>[</span><span>"delegate_permission/common.handle_all_urls"</span><span>],</span><span>
    </span><span>"target"</span><span>:</span><span> </span><span>{</span><span>
      </span><span>"namespace"</span><span>:</span><span> </span><span>"android_app"</span><span>,</span><span>
      </span><span>"package_name"</span><span>:</span><span> </span><span>"pwa.application.id.2"</span><span>,</span><span>
      </span><span>"sha256_cert_fingerprints"</span><span>:</span><span> </span><span>[</span><span>
        </span><span>"B3:FE:E9:E1:5C:1A:E8:68:5C:1A:16:99:E8..."</span><span>
      </span><span>]</span><span>
    </span><span>}</span><span>
</span><span>}]</span>
```

## Sideload your PWA to Test

Once you’ve generated an app package, you can install it to your Meta Quest using the [Android Platform Tools](https://dl.google.com/android/repository/platform-tools-latest-windows.zip) with [Developer Mode](https://developers.meta.com/horizon/documentation/native/android/mobile-device-setup/) enabled and connected to your computer:

```
<span>adb install </span><span>[</span><span>path to the app </span><span>package</span><span>]</span>
```

Once installed, you can launch your PWA from the App Library on Quest. In the App Library, change the app filter to **Unknown Sources**, and you should see your app in the list. Click on the app to launch it.

## Frequently Asked Questions

### My test WebXR PWA app can not launch after installed to the headset. What should I do?

The most common cause of the WebXR PWA not launching is the Digital Asset Link verification not passing. A `TWA verification was unsuccessful!` log would be printed to the Device Log in this case. Verify that both the package name and the signing key fingerprint match what’s listed in the _https://domain.com/.well-known/assetlinks.json_ file.

### My 2D PWA app has a URL bar at the top of the panel. How can I get rid of it?

The most common cause of the [custom tab bar](https://developer.chrome.com/docs/android/trusted-web-activity/integration-guide#remove-url-bar) appearance is the Digital Asset Link verification failing. A `TWA verification was unsuccessful!` log would be printed to the Device Log in this case. Verify that both the package name and the signing key fingerprint match what’s listed in the _https://domain.com/.well-known/assetlinks.json_ file.

### My 2D PWA app is not launching or stuck on a loading screen.

The most common reason for this is that your app has been incorrectly configured as an immersive app. Open your generated `twa-manifest.json` and verify that `horizonOsAppMode` is “2D”. Update the manifest and `bubblewrap build` again.

### I’m getting the `cli ERROR spawn EINVAL` error. What should I do?

Try to double check your NodeJS version that is executing the bubblewrap runtime. On Windows devices, please make sure you are using **NodeJS 21.0.0** to execute the `bubblewrap.js` file.

### I’m getting the `Android Gradle plugin requires Java 17 to run. You are currently using Java 11.` error. What should I do?

This is most likely due to conflict with the JDK version of the bubblewrap tool that’s already installed on your device. You can edit the `"jdkPath"` field of your `config.json` file to point to a Java 17 JDK (the default path of this file is `~/.bubblewrap/config.json` on Mac and `C:\Users\<username>\.bubblewrap\config.json` on Windows). Alternatively, you can delete the the `"jdkPath"` field in the `config.json` file and execute the bubblewrap command to automatically install the compatible JDK file.

### Gradle build fail on Windows.

This is a [known issue](https://github.com/GoogleChromeLabs/bubblewrap/issues/481) from the original bubblewrap project running under Windows. To fix it you need to remove or comment out the `org.gradle.jvmargs=-Xmx1536m` property inside the `gradle.properties` file from your project. This field is added every time that you generate or update the project. Make sure to fix it before running `bubblewrap build`.