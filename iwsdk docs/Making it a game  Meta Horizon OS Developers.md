Updated: Sep 20, 2024

In this chapter, we’ll turn your WebXR experience into a simple game by adding a proximity-based hit test for the targets and implementing a scoreboard to track the player’s score. These additions will make your scene more interactive and engaging, providing immediate feedback when a target is hit.

## Setting up the scoreboard

To display the score, we’ll use the `troika-three-text` library, which allows us to render high-quality text in Three.js. The score will be displayed on a monitor in the space station scene, giving the player a clear view of their progress.

### Scoreboard setup

First, we define the score text and an `updateScoreDisplay` function to manage the scoreboard:

```
<span><span>import</span><span>&nbsp;{</span><span>Text</span><span>}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'troika-three-text'</span><span>;</span></span><br><span><span>let</span><span>&nbsp;score&nbsp;=&nbsp;</span><span>0</span><span>;</span></span><br><span><span>const</span><span>&nbsp;scoreText&nbsp;=&nbsp;</span><span>new</span><span>&nbsp;</span><span>Text</span><span>();</span></span><br><span><span>scoreText.fontSize&nbsp;=&nbsp;</span><span>0.52</span><span>;</span></span><br><span><span>scoreText.font&nbsp;=&nbsp;</span><span>'assets/SpaceMono-Bold.ttf'</span><span>;</span></span><br><span><span>scoreText.position.z&nbsp;=&nbsp;-</span><span>2</span><span>;</span></span><br><span><span>scoreText.color&nbsp;=&nbsp;</span><span>0xffa276</span><span>;</span></span><br><span><span>scoreText.anchorX&nbsp;=&nbsp;</span><span>'center'</span><span>;</span></span><br><span><span>scoreText.anchorY&nbsp;=&nbsp;</span><span>'middle'</span><span>;</span></span><br><span><span></span></span><br><span><span>function</span><span>&nbsp;updateScoreDisplay()&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>const</span><span>&nbsp;clampedScore&nbsp;=&nbsp;</span><span>Math</span><span>.max(</span><span>0</span><span>,&nbsp;</span><span>Math</span><span>.min(</span><span>9999</span><span>,&nbsp;score));</span></span><br><span><span>&nbsp;&nbsp;</span><span>const</span><span>&nbsp;displayScore&nbsp;=&nbsp;clampedScore.toString().padStart(</span><span>4</span><span>,&nbsp;</span><span>'0'</span><span>);</span></span><br><span><span>&nbsp;&nbsp;scoreText.text&nbsp;=&nbsp;displayScore;</span></span><br><span><span>&nbsp;&nbsp;scoreText.sync();</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

#### Explanation:

-   **Score text setup**: The `Text` object is used to display the score. We configure its font size, color, and position, ensuring it fits well within the scene.-   **`updateScoreDisplay` function**: This function updates the score text whenever the score changes. It clamps the score between 0 and 9999 and formats it to be a four-digit number, which is then displayed on the monitor.

### Adding the scoreboard to the scene

Next, we add the score text to the scene in `setupScene`:

```
<span><span>function</span><span>&nbsp;setupScene({scene,&nbsp;camera,&nbsp;renderer,&nbsp;player,&nbsp;cont</span><span>rollers})&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Other&nbsp;setup&nbsp;code...</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;Add&nbsp;the&nbsp;score&nbsp;text&nbsp;to&nbsp;the&nbsp;scene</span></span><br><span><span>&nbsp;&nbsp;scene.add(scoreText);</span></span><br><span><span>&nbsp;&nbsp;scoreText.position.</span><span>set</span><span>(</span><span>0</span><span>,&nbsp;</span><span>0.67</span><span>,&nbsp;-</span><span>1.44</span><span>);</span></span><br><span><span>&nbsp;&nbsp;scoreText.rotateX(-</span><span>Math</span><span>.</span><span>PI</span><span>&nbsp;/&nbsp;</span><span>3.3</span><span>);</span></span><br><span><span>&nbsp;&nbsp;updateScoreDisplay();</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

#### Explanation:

-   **Score text positioning**: The score text is positioned and rotated to align with a monitor in the space station scene, making it look like the monitor is displaying the player’s score. You will need to adjust it if you are using a different environment.

## Implementing proximity-based hit test

To determine whether a bullet hits a target, we use a proximity-based hit test. This method checks the distance between the bullet and each target, and if they’re close enough, the target is considered “hit”:

```
<span><span>function</span><span>&nbsp;onFrame()&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;...&nbsp;unchanged&nbsp;params</span></span><br><span><span>&nbsp;&nbsp;</span><span>Object</span><span>.values(bullets).forEach(bullet&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;...&nbsp;unchanged&nbsp;logic</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;targets</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.filter(target&nbsp;=&gt;&nbsp;target.visible)</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.forEach(target&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>const</span><span>&nbsp;distance&nbsp;=&nbsp;target.position.distanceTo(bullet.posi</span><span>tion);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>if</span><span>&nbsp;(distance&nbsp;&lt;&nbsp;</span><span>1</span><span>)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>delete</span><span>&nbsp;bullets[bullet.uuid];</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;scene.remove(bullet);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;make&nbsp;target&nbsp;disappear,&nbsp;and&nbsp;then&nbsp;reappear&nbsp;at&nbsp;a&nbsp;d</span><span>ifferent&nbsp;place&nbsp;after&nbsp;2&nbsp;seconds</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;target.visible&nbsp;=&nbsp;</span><span>false</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;setTimeout(()&nbsp;=&gt;&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;target.visible&nbsp;=&nbsp;</span><span>true</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;target.position.x&nbsp;=&nbsp;</span><span>Math</span><span>.random()&nbsp;*&nbsp;</span><span>10</span><span>&nbsp;-&nbsp;</span><span>5</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;target.position.z&nbsp;=&nbsp;-</span><span>Math</span><span>.random()&nbsp;*&nbsp;</span><span>5</span><span>&nbsp;-&nbsp;</span><span>5</span><span>;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;</span><span>2000</span><span>);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;score&nbsp;+=&nbsp;</span><span>10</span><span>;&nbsp;</span><span>//&nbsp;Update&nbsp;the&nbsp;score&nbsp;when&nbsp;a&nbsp;target&nbsp;is&nbsp;hit</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;updateScoreDisplay();&nbsp;</span><span>//&nbsp;Update&nbsp;the&nbsp;rendered&nbsp;troika-three-text&nbsp;object</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;});</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

### Explanation:

-   **Proximity-based hit test**: This method checks if the distance between the bullet and a target is less than 1 unit. If it is, the bullet is removed from the scene, and the target is temporarily hidden.-   **Updating the score**: Each time a target is hit, the score is increased by 10 points, and the `updateScoreDisplay` function is called to refresh the displayed score.-   **Respawning targets**: After 2 seconds, the target becomes visible again and is repositioned randomly within the scene.
    -   **Why proximity-based?**: This approach is simple and effective for our scenario because the targets are round and facing the player. However, for more advanced and reliable hit detection, especially with irregularly shaped objects or targets that aren’t facing the player, you would need to look into using raycasting.

## Summary

In this chapter, you’ve transformed your WebXR scene into a simple game by adding hit detection and a scoreboard. The proximity-based hit test provides a straightforward way to register hits, while the scoreboard keeps track of the player’s score, making the game more engaging and interactive.

Here’s what your game looks like now:

![Gameplay screenshot](https://scontent.frca1-1.fna.fbcdn.net/v/t39.2365-6/460797909_1845676352623683_550374503913877572_n.gif?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=eEAYAsyL9bQQ7kNvwGaJGHL&_nc_oc=AdlrzYXIH29IwVGeMJA3aiEXiBzDAVengGN3HMkmZWzPA5J0fwa18WV5gQj5yKjkYeI&_nc_zt=14&_nc_ht=scontent.frca1-1.fna&_nc_gid=t6sCm9rIEINGpP_Eoi_21w&oh=00_Afgwg3lpYqEaRwepyGQn1Od4aOH0cnD8vSESbTMBO2WIEw&oe=69440044)