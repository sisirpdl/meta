[Browser](https://developers.meta.com/horizon/documentation/web/) supports the Meta Quest Touch Pro controllers. The controllers have several new features that are exposed in the WebXR gamepad object.

The name of this controller is `“meta-quest-touch-pro”` and it has a fallback to the Meta Quest 1 controller `“oculus-touch-v2”`.

Meta Quest 2 and Meta Quest Pro headsets support the Meta Quest Touch Pro controllers.

## Gamepad Button

The Touch Pro controller has many more sensors that are exposed as buttons in the [WebXR Gamepad](https://www.w3.org/TR/webxr-gamepads-module-1/) object. There are 12 buttons starting at index 0. Buttons 0 to 5 are defined the same as the complex `xr-standard` mapping.

### Button 6 - Thumb Rest

It also exists on the older controller, but now it also reports the pressure on the thumb pad.

### Button 7 - Stylus Pressure

It reports the pressure on the stylus tip.

-   0 = No pressure-   1 = Full pressure

### Button 8 - Trigger Finger Curl

It reports how much your trigger finger is bent.

-   0 = Straight-   1 = Bent touching the trigger

### Button 9 - Trigger Finger Slide

It reports the position of your trigger finger on the trigger.

-   0 = All the way to the left-   1 = All the way to the right

### Button 10 - Trigger Finger Proximity

It reports if your trigger finger is far from the trigger.

-   0 = Close to the trigger-   1 = Far from the trigger

### Button 11 - Thumb Proximity

It reports if your thumb is far from the controller.

-   0 = Close to the controller-   1 = Far from the controller

## Additional Haptics

There is also access to three additional haptic actuators. You can find these as additional entries in the `hapticActuators` array. The first entry controls the main actuator. The second one controls the actuator in the trigger, and the third controls one under the thumb stick.