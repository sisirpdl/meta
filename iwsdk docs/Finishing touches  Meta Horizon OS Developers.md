Updated: Sep 20, 2024

Now that you have a fully functioning WebXR game, it’s time to add some finishing touches to enhance the overall experience. In this final chapter, we’ll introduce audio, haptic feedback, and visual effects to make your game more immersive and engaging. These elements will provide immediate feedback to the player, making the game feel more polished and interactive.

## Adding audio feedback

We’ll start by adding audio feedback for firing the blaster and scoring points. Three.js provides a straightforward way to handle audio using its audio system, which we’ll leverage here.

### Setting up audio

First, we declare global variables for the sounds:

```
<span><span>let</span><span>&nbsp;laserSound,&nbsp;scoreSound;</span></span><br><span><span></span></span><br>
```

Next, inside the `setupScene` function, we create an audio listener and load the positional audio files:

```
<span><span>function</span><span>&nbsp;setupScene({scene,&nbsp;camera,&nbsp;renderer,&nbsp;player,&nbsp;cont</span><span>rollers})&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Other&nbsp;setup&nbsp;code...</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Load&nbsp;and&nbsp;set&nbsp;up&nbsp;positional&nbsp;audio</span></span><br><span><span>&nbsp;&nbsp;</span><span>const</span><span>&nbsp;listener&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>THREE</span><span>.</span><span>AudioListener</span><span>();</span></span><br><span><span>&nbsp;&nbsp;camera.add(listener);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>const</span><span>&nbsp;audioLoader&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>THREE</span><span>.</span><span>AudioLoader</span><span>();</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Laser&nbsp;sound</span></span><br><span><span>&nbsp;&nbsp;laserSound&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>THREE</span><span>.</span><span>PositionalAudio</span><span>(listener);</span></span><br><span><span>&nbsp;&nbsp;audioLoader.load(</span><span>'assets/laser.ogg'</span><span>,&nbsp;buffer&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;laserSound.setBuffer(buffer);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;blasterGroup.add(laserSound);</span></span><br><span><span>&nbsp;&nbsp;});</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Score&nbsp;sound</span></span><br><span><span>&nbsp;&nbsp;scoreSound&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>THREE</span><span>.</span><span>PositionalAudio</span><span>(listener);</span></span><br><span><span>&nbsp;&nbsp;audioLoader.load(</span><span>'assets/score.ogg'</span><span>,&nbsp;buffer&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;scoreSound.setBuffer(buffer);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;scoreText.add(scoreSound);</span></span><br><span><span>&nbsp;&nbsp;});</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

### Explanation:

-   **Audio listener**: The `AudioListener` is essentially the “ears” of the camera. It’s necessary for hearing the sounds in the scene. We attach it to the camera so that the audio follows the player’s perspective.
    -   **Positional audio**: We use `PositionalAudio` to make the sounds feel like they’re coming from specific points in the 3D space. The laser sound is attached to the blaster, and the score sound is attached to the scoreboard text.
    

### Playing the sounds

We trigger the sounds when appropriate actions occur:

-   **Firing the blaster**:
    
    ```
    <span><span>if</span><span>&nbsp;(laserSound.isPlaying)&nbsp;laserSound.stop();</span></span><br><span><span>laserSound.play();</span></span><br><span><span></span></span><br>
    ```
    -   **Scoring points**:
    
    ```
    <span><span>if</span><span>&nbsp;(scoreSound.isPlaying)&nbsp;scoreSound.stop();</span></span><br><span><span>scoreSound.play();</span></span><br><span><span></span></span><br>
    ```
    

This ensures that the sounds are played without overlap, providing clear audio feedback to the player.

## Adding haptic feedback

To enhance the tactile experience, we add haptic feedback when the player fires the blaster. This simple vibration adds a layer of immersion, making the action feel more impactful:

```
<span><span>try</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>const</span><span>&nbsp;hapticActuator&nbsp;=&nbsp;gamepad.getHapticActuator(</span><span>0</span><span>).pulse(</span><span>0.6</span><span>,&nbsp;</span><span>100</span><span>);</span></span><br><span><span>}&nbsp;</span><span>catch</span><span>&nbsp;{}</span></span><br><span><span></span></span><br>
```

### Explanation:

-   **Haptic feedback**: The `pulse` method triggers a short vibration at 60% intensity for 100 milliseconds.-   **Try-catch block**: We use a try-catch block to ensure that the application doesn’t crash on devices that don’t have haptic actuators.

## Adding visual feedback

Finally, we enhance the visual feedback when a target is hit by animating its disappearance and reappearance using GSAP. Instead of having the target abruptly disappear and reappear, we smoothly scale it down and back up. Let’s first locate the target disappear/reappear logic based on `setTimeout`:

```
<span><span>target.visible&nbsp;=&nbsp;</span><span>false</span><span>;</span></span><br><span><span>setTimeout(()&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;target.visible&nbsp;=&nbsp;</span><span>true</span><span>;</span></span><br><span><span>&nbsp;&nbsp;target.position.x&nbsp;=&nbsp;</span><span>Math</span><span>.random()&nbsp;*&nbsp;</span><span>10</span><span>&nbsp;-&nbsp;</span><span>5</span><span>;</span></span><br><span><span>&nbsp;&nbsp;target.position.z&nbsp;=&nbsp;-</span><span>Math</span><span>.random()&nbsp;*&nbsp;</span><span>5</span><span>&nbsp;-&nbsp;</span><span>5</span><span>;</span></span><br><span><span>},&nbsp;</span><span>2000</span><span>);</span></span><br><span><span></span></span><br>
```

And replace it with:

```
<span><span>import</span><span>&nbsp;{gsap}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'gsap'</span><span>;</span></span><br><span><span></span></span><br><span><span>gsap.to(target.scale,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;duration:&nbsp;</span><span>0.3</span><span>,</span></span><br><span><span>&nbsp;&nbsp;x:&nbsp;</span><span>0</span><span>,</span></span><br><span><span>&nbsp;&nbsp;y:&nbsp;</span><span>0</span><span>,</span></span><br><span><span>&nbsp;&nbsp;z:&nbsp;</span><span>0</span><span>,</span></span><br><span><span>&nbsp;&nbsp;onComplete:&nbsp;()&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;target.visible&nbsp;=&nbsp;</span><span>false</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;setTimeout(()&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;target.visible&nbsp;=&nbsp;</span><span>true</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;target.position.x&nbsp;=&nbsp;</span><span>Math</span><span>.random()&nbsp;*&nbsp;</span><span>10</span><span>&nbsp;-&nbsp;</span><span>5</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;target.position.z&nbsp;=&nbsp;-</span><span>Math</span><span>.random()&nbsp;*&nbsp;</span><span>5</span><span>&nbsp;-&nbsp;</span><span>5</span><span>;</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;Scale&nbsp;back&nbsp;up&nbsp;the&nbsp;target</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gsap.to(target.scale,&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;duration:&nbsp;</span><span>0.3</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x:&nbsp;</span><span>1</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;y:&nbsp;</span><span>1</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;z:&nbsp;</span><span>1</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;</span><span>1000</span><span>);</span></span><br><span><span>&nbsp;&nbsp;},</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

### Explanation:

-   **Scaling down**: When a target is hit, it scales down to zero over 0.3 seconds, creating a smooth disappearing effect.-   **Respawning with animation**: After 1 second, the target reappears, scaling back up to its original size over 0.3 seconds. This makes the reappearance feel smooth and natural.

### Final step: Updating the GSAP ticker

To ensure GSAP animations are synchronized with your WebXR frame updates, include this at the end of your `onFrame` function:

## Congratulations!

Congratulations! You’ve completed the entire WebXR first steps tutorial and built a fully immersive and interactive game. Here’s a final look at your game in action:

![Shrinking targets](https://scontent.frca1-1.fna.fbcdn.net/v/t39.2365-6/460407160_1845676345957017_6460674188672490588_n.gif?_nc_cat=106&ccb=1-7&_nc_sid=e280be&_nc_ohc=JD67sJc3gj4Q7kNvwH1aFit&_nc_oc=AdnxYga5G9rnE67s-m2Bdn8UeEnFcxm07ljGtt04aXPkHr7YI5iLpx4ylMBszQ_TI-g&_nc_zt=14&_nc_ht=scontent.frca1-1.fna&_nc_gid=yNcroLJNljNp1jYZFonMJA&oh=00_Afh4cxX4yBlWC-5qiV2YbnpxSg5MhpDg7xspqNkb4jZMeg&oe=69440BD0)

## What’s next?

Although the tutorial is over, your journey with WebXR has just begun. There are countless ways to expand and enhance your game. Here are some ideas to get you started:

-   **Dual wielding**: Add a second blaster to the other controller for dual-wielding action.-   **Timed challenge**: Introduce a timer to make it a race against the clock.-   **Moving targets**: Make the targets move around to increase the difficulty.-   **Exploding targets**: Add visual effects to make the targets explode when hit.-   **And more!**: Your imagination is the limit—experiment, add new features, and make the game truly your own!

Thank you for following along with this tutorial. I hope it’s been a fun and educational journey into the world of WebXR. Happy coding!