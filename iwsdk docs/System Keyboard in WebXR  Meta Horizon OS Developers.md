This guide demonstrates how to use the system keyboard integration in WebXR with Browser to receive text input from users.

### WebXR System Keyboard Requirements

Browser version 26.1 or later

### WebXR System Keyboard Limitations

There are some limitations in this iteration of the WebXR integration with the Meta Quest headset system keyboard:

-   Each time the keyboard is shown represents a new underlying editing session. Any key press first overwrites the entire existing value in the text element.-   The only mechanism for reading keyboard input and interaction is through the text field’s value. At this time, there are no explicit system keyboard key-press events to be intercepted.-   Also consider that for the text field to receive keyboard input, it must be added to the underlying DOM. When appended to an off-screen location, like outside the underlying viewport, the web page scrolls to the text field when the user types. After exiting the immersive session, the page viewport’s contents might be different from what it was when the immersive session was entered.

### Sample integration (including source code)

You can find a sample implementation in the [source code](https://github.com/emmanueljl/webxr-samples/blob/main/system-keyboard.html). The following sections of this guide show relevant portions of the code.

### Checking for System Keyboard Support

You can check the `isSystemKeyboardSupported` attribute of `XRSession` to see if the system keyboard is supported by the UA.

```
<span>if</span><span> </span><span>(</span><span>session</span><span>.</span><span>isSystemKeyboardSupported</span><span>)</span><span> </span><span>{</span><span>
  </span><span>// ...</span><span>
</span><span>}</span>
```

### Showing the System Keyboard

In the Browser, showing the system keyboard is simple and intuitive. It can be used with any HTML text input element.

You can reuse any existing HTML text input element in your document. If you don’t have any, or if you prefer to keep your logic separate, you can create a HTML text input element and append it to the DOM. Just be sure to [remove it](https://developers.meta.com/horizon/documentation/web/webxr-keyboard/#clean-up) at the end of the session.

```
<span>let</span><span> myTextField </span><span>=</span><span> </span><span>null</span><span>;</span><span> </span><span>// keep a global reference to read text later</span><span>

myTextField </span><span>=</span><span> document</span><span>.</span><span>createElement</span><span>(</span><span>"input"</span><span>);</span><span>
myTextField</span><span>.</span><span>type </span><span>=</span><span> </span><span>"text"</span><span>;</span><span>
document</span><span>.</span><span>body</span><span>.</span><span>appendChild</span><span>(</span><span>myTextField</span><span>);</span>
```

Then call `focus()` on it to trigger the system keyboard.

### Reading Text Input

As the user types into the system keyboard, text populates the element.

To retrieve the text, read the `value` property.

```
<span>var</span><span> textFromUser </span><span>=</span><span> myTextField</span><span>.</span><span>value</span><span>;</span>
```

Also, an `oninput` event listener can respond to any change in the text element’s value as the user is typing.

```
<span>myTextField</span><span>.</span><span>oninput </span><span>=</span><span> </span><span>function</span><span>()</span><span> </span><span>{</span><span>
  </span><span>// ...</span><span>
</span><span>};</span>
```

### System Keyboard Lifecycle

#### System Keyboard is Displayed

The keyboard being displayed triggers an `XRSession` visibility state change to `visible-blurred`. Add an event listener to respond to it.

**Note:** Other events can also cause this visibility change.

```
<span>session</span><span>.</span><span>addEventListener</span><span>(</span><span>'visibilitychange'</span><span>,</span><span> </span><span>function</span><span>(</span><span>ev</span><span>)</span><span> </span><span>{</span><span>
  </span><span>if</span><span> </span><span>(</span><span>ev</span><span>.</span><span>session</span><span>.</span><span>visibilityState </span><span>===</span><span> </span><span>'visible-blurred'</span><span>)</span><span> </span><span>{</span><span>
    </span><span>// ...</span><span>
  </span><span>}</span><span>
</span><span>});</span>
```

#### Keyboard is Dismissed

There are several user interactions that dismiss the keyboard:

-   The “hide/dismiss keyboard” button on the keyboard is clicked.-   The **Done** key on the keyboard is clicked.-   The **Meta Quest** button on the controller is pressed.-   The user clicks outside of the keyboard bounds.

All of these dismiss the keyboard and result in two events:

-   The text field will be blurred.
    
    ```
    <span>myTextField</span><span>.</span><span>onblur </span><span>=</span><span> </span><span>function</span><span>()</span><span> </span><span>{</span><span>
      </span><span>// ...</span><span>
    </span><span>};</span>
    ```
    -   When visibility returns to the session, `XRSession` visibility state changes to `visible`.
    
    ```
    <span>session</span><span>.</span><span>addEventListener</span><span>(</span><span>'visibilitychange'</span><span>,</span><span> </span><span>function</span><span>(</span><span>ev</span><span>)</span><span> </span><span>{</span><span>
      </span><span>if</span><span> </span><span>(</span><span>ev</span><span>.</span><span>session</span><span>.</span><span>visibilityState </span><span>===</span><span> </span><span>'visible'</span><span>)</span><span> </span><span>{</span><span>
     </span><span>// ...</span><span>
      </span><span>}</span><span>
    </span><span>});</span>
    ```
    

#### Clean-Up

Remove the text input element from the DOM after the `XRSession` has ended.

```
<span>function</span><span> onSessionEnded</span><span>(</span><span>event</span><span>)</span><span> </span><span>{</span><span>
  textField</span><span>.</span><span>remove</span><span>();</span><span>
</span><span>}</span>
```