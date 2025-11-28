Native VR applications can launch lightweight browser windows called _Web Tasks_. A Web Task is a modal browser window with a toolbar that contains a back button, refresh button, web security information, a read-only address bar, and a Done button.

Web Tasks provide a similar experience as Chrome Custom Tabs on Android, but are specialized for VR. They are great for linking to external information, such as a privacy policy or support documentation, as well as web-based authentication flows such as OAuth.

The following image shows an example of the Web Task window.

![web Task example](https://scontent.frca1-1.fna.fbcdn.net/v/t39.2365-6/72738876_393436161586902_7870377417863331840_n.png?_nc_cat=111&ccb=1-7&_nc_sid=e280be&_nc_ohc=eA1ykcQbjhgQ7kNvwH8Nnre&_nc_oc=AdnetUVK7Qi6oOjXROeXXYj-331k89gixwgcIfFThZFwIuFvPtZiE7rL_LGK9u2U794&_nc_zt=14&_nc_ht=scontent.frca1-1.fna&_nc_gid=XH2KR4l2-7cqfNc6QUBrXA&oh=00_Afgp9LwjLl_Hv8ImZYMMFEcuYoK-ID3E31Eep04TKp4p3g&oe=6943D8B2)

## Launch A Web Task

To launch Browser as a Web Task, create a new intent and pass the URI to the Web Task. Java example:

```
<span>Intent</span><span> intent </span><span>=</span><span> </span><span>new</span><span> </span><span>Intent</span><span>(</span><span>Intent</span><span>.</span><span>ACTION_VIEW</span><span>);</span><span>
intent</span><span>.</span><span>setData</span><span>(</span><span>Uri</span><span>.</span><span>parse</span><span>(</span><span>"ovrweb://webtask?uri="</span><span> </span><span>+</span><span> </span><span>Uri</span><span>.</span><span>encode</span><span>(</span><span>url</span><span>)));</span><span>
mContext</span><span>.</span><span>startActivity</span><span>(</span><span>intent</span><span>);</span>
```

> **Note:** Under memory pressure, it is possible the app that launched the Web Task can be terminated while in the background.

## Close A Web Task

A Web Task can be closed in one of three ways:

-   By the user, when they click the **DONE** button. The OS returns to the app that launched the Web Task.-   By the web page, if it calls the `window.close()` function (JavaScript) to close the current window.-   By the web page, if it navigates to an app intent scheme (For example, `mygame://` ), the browser asks the user if they wish to switch to another app. If the user agrees, the OS activates the app’s intent.

## Using Web Tasks for Authentication (OAuth)

Web Tasks can be used for authentication flows for your app. The following steps provide a typical authentication flow.

-   Launch a Web Task using [the procedure described previously](https://developers.meta.com/horizon/documentation/web/web-tasks/#launch).
    
    The URL opened by the Web Task should point to a login flow that ends in an intent launch. For most OAuth flows, this means you should provide your app’s intent scheme as the redirect URI parameter in the login service URL.
    -   Register for the intent scheme in your app.
    
    Example intent registration:
    

```
<span>&lt;intent-filter&gt;</span><span>
</span><span>&lt;action</span><span> </span><span>android:name</span><span>=</span><span>"android.intent.action.VIEW"</span><span>/&gt;</span><span>
</span><span>&lt;category</span><span> </span><span>android:name</span><span>=</span><span>"android.intent.category.DEFAULT"</span><span>/&gt;</span><span>
</span><span>&lt;category</span><span> </span><span>android:name</span><span>=</span><span>"android.intent.category.BROWSABLE"</span><span>/&gt;</span><span>
</span><span>&lt;data</span><span> </span><span>android:scheme</span><span>=</span><span>"mygame"</span><span> </span><span>/&gt;</span><span>
</span><span>&lt;/intent-filter&gt;</span>
```

As a result, the web login service launches your app (optionally, with an auth token) after the user has logged in: