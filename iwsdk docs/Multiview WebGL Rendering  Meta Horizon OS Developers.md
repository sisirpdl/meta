> **Warning:** Multiview is an experimental feature and you may see behavior that is different from what is described in this document.

To render VR content, you need to draw the same 3D scene twice; once for the left eye, and again for the right eye. There is usually only a slight difference between the two rendered views, but the difference is what enables the stereoscopic effect that makes VR work. By default in WebGL, the only option available is to render to the two eye buffers sequentially — essentially incurring double the application and driver overhead — despite the GPU command streams and render states typically being almost identical.

The WebGL [multiview extension](https://www.khronos.org/registry/webgl/extensions/OVR_multiview2/) addresses this inefficiency by enabling simultaneous rendering to multiple elements of a 2D texture array.

> **Note:** Only CPU-bound experiences will benefit from multi-view. Often, a CPU usage reduction of 25% - 50% is possible.

## Multiview Design

With the multiview extension draw calls are instanced into each corresponding element of the texture array. The vertex program uses a new `ViewID` variable to compute per-view values — typically the vertex position and view-dependent variables like reflection.

The formulation of the multiview extension is purposely high-level to allow implementation freedom. On existing hardware, applications and drivers can realize the benefits of a single scene traversal, even if all GPU work is fully duplicated per view.

In WebGL on Quest hardware, multiview can be enabled with the `OCULUS_multiview` extension. **Only WebGL 2.0 supports this extension**; WebGL 1.0 cannot use multiview.

`OCULUS_multiview` is a upgraded version of the [OVR\_multiview2 extension](https://www.khronos.org/registry/webgl/extensions/OVR_multiview2/). `OCULUS_multiview` operates in the same way as `OVR_multiview2`, but includes support for multisampled antialiasing (MSAA).

The differences from the `OVR_multiview2` are as follows:

-   The `OCULUS_multiview` is available out-of-the-box in the Browser, while the `OVR_multiview2` extension is behind the flag (chrome://flags). The latter extension is not enabled by default because it is in the ‘Draft’ state;-   The `OCULUS_multiview` extension includes all the functionality of the `OVR_multiview2`, plus multisampling support:
    
    ```
    <span>  </span><span>void</span><span> framebufferTextureMultisampleMultiviewOVR</span><span>(</span><span>GLenum</span><span> target</span><span>,</span><span> </span><span>GLenum</span><span> attachment</span><span>,</span><span>
                                            </span><span>WebGLTexture</span><span>?</span><span> texture</span><span>,</span><span> </span><span>GLint</span><span> level</span><span>,</span><span>
                                            </span><span>GLsizei</span><span> samples</span><span>,</span><span>
                                            </span><span>GLint</span><span> baseViewIndex</span><span>,</span><span>
                                            </span><span>GLsizei</span><span> numViews</span><span>);</span>
    ```
    

## Using OCULUS\_Multiview in WebGL 2.0

A WebGL app can be relatively easily modified to benefit from the extension.

Sample code which implements multiview rendering into a WebXR layer can be found at [Cubes (WebGL 2.0)](https://immersive-web.github.io/webxr-samples/layers-samples/proj-multiview.html) - [Source code](https://github.com/immersive-web/webxr-samples/blob/main/layers-samples/proj-multiview.html)

This is the recommended way to render a scene on Quest hardware.

First of all, the `OCULUS_multiview` or `OVR_multiview2` extension should be requested:

```
<span><span>var</span><span>&nbsp;is_multiview,&nbsp;is_multisampled&nbsp;=&nbsp;</span><span>false</span><span>;</span></span><br><span><span>var</span><span>&nbsp;ext&nbsp;=&nbsp;gl.getExtension(</span><span>'OCULUS_multiview'</span><span>);</span></span><br><span><span>if</span><span>&nbsp;(ext)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;console.log(</span><span>"OCULUS_multiview&nbsp;extension&nbsp;is&nbsp;supported"</span><span>);</span></span><br><span><span>&nbsp;&nbsp;is_multiview&nbsp;=&nbsp;</span><span>true</span><span>;</span></span><br><span><span>&nbsp;&nbsp;is_multisampled&nbsp;=&nbsp;</span><span>true</span><span>;</span></span><br><span><span>}</span></span><br><span><span>else</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;console.log(</span><span>"OCULUS_multiview&nbsp;extension&nbsp;is&nbsp;NOT&nbsp;supported"</span><span>);</span></span><br><span><span>&nbsp;&nbsp;ext&nbsp;=&nbsp;gl.getExtension(</span><span>'OVR_multiview2'</span><span>);</span></span><br><span><span>&nbsp;&nbsp;</span><span>if</span><span>&nbsp;(ext)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;console.log(</span><span>"OVR_multiview2&nbsp;extension&nbsp;is&nbsp;supported"</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;is_multiview&nbsp;=&nbsp;</span><span>true</span><span>;</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>&nbsp;&nbsp;</span><span>else</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;console.log(</span><span>"Neither&nbsp;OCULUS_multiview&nbsp;nor&nbsp;OVR_multiview2&nbsp;exten</span><span>sions&nbsp;are&nbsp;supported"</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;is_multiview&nbsp;=&nbsp;</span><span>false</span><span>;</span></span><br><span><span>&nbsp;&nbsp;}</span></span><br><span><span>}</span></span><br><span><span></span></span><br>
```

Then create a projection layer with a `texture-array` textureType and add it to your xrSession

```
<span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>function</span><span>&nbsp;onSessionStarted(session)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;xrFramebuffer&nbsp;=&nbsp;gl.createFramebuffer();</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;...</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>let</span><span>&nbsp;layer&nbsp;=&nbsp;xrGLFactory.createProjectionLayer({</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;textureType:&nbsp;</span><span>"texture-array"</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;depthFormat:&nbsp;gl.</span><span>DEPTH_COMPONENT24</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;});</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;session.updateRenderState({&nbsp;layers:&nbsp;[layer]&nbsp;</span><span>});</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;...</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;}</span></span><br><span><span></span></span><br>
```

### Render loop

When you get an XRFrame, bind the ViewSubImage (retrieved with getViewSubImage) from each layer to the framebuffer.

```
<span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>function</span><span>&nbsp;onXRFrame(t,&nbsp;frame)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;some&nbsp;code&nbsp;removed&nbsp;for&nbsp;clarity</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>let</span><span>&nbsp;session&nbsp;=&nbsp;frame.session;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>let</span><span>&nbsp;pose&nbsp;=&nbsp;frame.getViewerPose(refSpace);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>if</span><span>&nbsp;(pose)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>let</span><span>&nbsp;glLayer&nbsp;=&nbsp;</span><span>null</span><span>;</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gl.bindFramebuffer(gl.</span><span>FRAMEBUFFER</span><span>,&nbsp;xrFramebuffer);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>let</span><span>&nbsp;views&nbsp;=&nbsp;[];</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>for</span><span>&nbsp;(</span><span>let</span><span>&nbsp;view&nbsp;</span><span>of</span><span>&nbsp;pose.views)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;glLayer&nbsp;=&nbsp;xrGLFactory.getViewSubImage(se</span><span>ssion.renderState.layers[</span><span>0</span><span>],&nbsp;view);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;glLayer.framebuffer&nbsp;=&nbsp;xrFramebuffer;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gl.bindFramebuffer(gl.</span><span>FRAMEBUFFER</span><span>,&nbsp;xrFramebuffer);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>let</span><span>&nbsp;viewport&nbsp;=&nbsp;glLayer.viewport;</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>if</span><span>&nbsp;(views.length&nbsp;==&nbsp;</span><span>0</span><span>)&nbsp;{&nbsp;</span><span>//&nbsp;for&nbsp;multiview&nbsp;we&nbsp;need&nbsp;to&nbsp;set&nbsp;fbo&nbsp;only&nbsp;once,&nbsp;so&nbsp;</span><span>only&nbsp;do&nbsp;this&nbsp;for&nbsp;the&nbsp;first&nbsp;view</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>if</span><span>&nbsp;(!is_multisampled&nbsp;||&nbsp;!do_antialias.checked)</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mv_ext.framebufferTextureMultiviewOV</span><span>R(gl.</span><span>DRAW_FRAMEBUFFER</span><span>,&nbsp;gl.</span><span>COLOR_ATTACHMENT0</span><span>,&nbsp;glLayer.colorTexture,&nbsp;</span><span>0</span><span>,&nbsp;</span><span>0</span><span>,&nbsp;</span><span>2</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>else</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mv_ext.framebufferTextureMultisample</span><span>MultiviewOVR(gl.</span><span>DRAW_FRAMEBUFFER</span><span>,&nbsp;gl.</span><span>COLOR_ATTACHMENT0</span><span>,&nbsp;glLayer.colorTexture,&nbsp;</span><span>0</span><span>,&nbsp;samples,&nbsp;</span><span>0</span><span>,&nbsp;</span><span>2</span><span>);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>if</span><span>&nbsp;(glLayer.depthStencilTexture&nbsp;===&nbsp;</span><span>null</span><span>)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>if</span><span>&nbsp;(depthStencilTex&nbsp;===&nbsp;</span><span>null</span><span>)&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(</span><span>"MaxViews&nbsp;=&nbsp;"</span><span>&nbsp;+&nbsp;gl.getParameter(mv_ext.</span><span>MAX_VIEWS_OVR</span><span>));</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;depthStencilTex&nbsp;=&nbsp;gl.createTexture</span><span>();</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gl.bindTexture(gl.</span><span>TEXTURE_2D_ARRAY</span><span>,&nbsp;depthStencilTex);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gl.texStorage3D(gl.</span><span>TEXTURE_2D_ARRAY</span><span>,&nbsp;</span><span>1</span><span>,&nbsp;gl.</span><span>DEPTH_COMPONENT24</span><span>,&nbsp;viewport.width,&nbsp;viewport.height,&nbsp;</span><span>2</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;</span><span>else</span><span>&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;depthStencilTex&nbsp;=&nbsp;glLayer.depthStenc</span><span>ilTexture;</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>if</span><span>&nbsp;(!is_multisampled&nbsp;||&nbsp;!do_antialias.checked)</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mv_ext.framebufferTextureMultiviewOV</span><span>R(gl.</span><span>DRAW_FRAMEBUFFER</span><span>,&nbsp;gl.</span><span>DEPTH_ATTACHMENT</span><span>,&nbsp;depthStencilTex,&nbsp;</span><span>0</span><span>,&nbsp;</span><span>0</span><span>,&nbsp;</span><span>2</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>else</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mv_ext.framebufferTextureMultisample</span><span>MultiviewOVR(gl.</span><span>DRAW_FRAMEBUFFER</span><span>,&nbsp;gl.</span><span>DEPTH_ATTACHMENT</span><span>,&nbsp;depthStencilTex,&nbsp;</span><span>0</span><span>,&nbsp;samples,&nbsp;</span><span>0</span><span>,&nbsp;</span><span>2</span><span>);</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gl.disable(gl.</span><span>SCISSOR_TEST</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gl.clear(gl.</span><span>COLOR_BUFFER_BIT</span><span>&nbsp;|&nbsp;gl.</span><span>DEPTH_BUFFER_BIT</span><span>);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;views.push(</span><span>new</span><span>&nbsp;</span><span>WebXRView</span><span>(view,&nbsp;glLayer,&nbsp;viewport));</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;scene.drawViewArray(views);</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;scene.endFrame();</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;}</span></span><br><span><span></span></span><br>
```

Again, refer to the [Code sample section](https://developers.meta.com/horizon/documentation/web/web-multiview/#multi-view-webxr-code-example) for fully functional multiview example(s).

Note, the multiview extension may be used withoutWebXR; you just need to provide correct view and projection matrices and setup proper viewports.

### Changes in shaders

If you are converting WebGL 1.0 to WebGL 2.0, you should use ES 3.00 shaders: only those support multiview.

The following changes might be necessary for vertex shaders in a multiview-enabled experience:

-   #version 300 es should be added at the top of the shader code;-   GL\_OVR\_multiview extension should be requested on the second line: #extension GL\_OVR\_multiview : require-   layout(num\_views=2) in; must be provided on the following line;-   In order to convert a WebGL 1.0 shader to ES 3.00, all `attribute` keywords must be replaced with `in`, and all `varying` keywords must be replaced with `out`:
    -   in vec3 position;-   in vec2 texCoord;-   out vec2 vTexCoord;-   Both left and right projection / model matrices must be provided as uniforms:
    -   uniform mat4 leftProjectionMat;-   uniform mat4 leftModelViewMat;-   uniform mat4 rightProjectionMat;-   uniform mat4 rightModelViewMat;-   A built-in view identifier - gl\_ViewID\_OVR - should be used to determine which matrix set - left or right to use:
    -   mat4 m = gl\_ViewID\_OVR == 0u ? (leftProjectionMat \* leftModelViewMat) : (rightProjectionMat \* rightModelViewMat);-   The gl\_ViewID\_OVR is of unsigned int type.

An example WebGL 1.0 vertex shader...

```
<span>uniform mat4 projectionMat</span><span>;</span><span>
uniform mat4 modelViewMat</span><span>;</span><span>
attribute vec3 position</span><span>;</span><span>
attribute vec2 texCoord</span><span>;</span><span>
varying vec2 vTexCoord</span><span>;</span><span>

</span><span>void</span><span> main</span><span>()</span><span> </span><span>{</span><span>
  vTexCoord </span><span>=</span><span> texCoord</span><span>;</span><span>
  gl_Position </span><span>=</span><span> projectionMat </span><span>*</span><span> modelViewMat </span><span>*</span><span> vec4</span><span>(</span><span> position</span><span>,</span><span> </span><span>1.0</span><span> </span><span>);</span><span>
</span><span>}</span><span>
</span>
```

...and the equivalent multiview ES 3.00 shader:

```
<span>#version 300 es</span><span>
</span><span>#extension GL_OVR_multiview : require</span><span>
layout</span><span>(</span><span>num_views</span><span>=</span><span>2</span><span>)</span><span> </span><span>in</span><span>;</span><span>
uniform mat4 leftProjectionMat</span><span>;</span><span>
uniform mat4 leftModelViewMat</span><span>;</span><span>
uniform mat4 rightProjectionMat</span><span>;</span><span>
uniform mat4 rightModelViewMat</span><span>;</span><span>
</span><span>in</span><span> vec3 position</span><span>;</span><span>
</span><span>in</span><span> vec2 texCoord</span><span>;</span><span>
</span><span>out</span><span> vec2 vTexCoord</span><span>;</span><span>

</span><span>void</span><span> main</span><span>()</span><span> </span><span>{</span><span>
  vTexCoord </span><span>=</span><span> texCoord</span><span>;</span><span>
  mat4 m </span><span>=</span><span> gl_ViewID_OVR </span><span>==</span><span> </span><span>0u</span><span> </span><span>?</span><span> </span><span>(</span><span>leftProjectionMat </span><span>*</span><span> leftModelViewMat</span><span>)</span><span> </span><span>:</span><span>
                                 </span><span>(</span><span>rightProjectionMat </span><span>*</span><span> rightModelViewMat</span><span>);</span><span>
  gl_Position </span><span>=</span><span> m </span><span>*</span><span> vec4</span><span>(</span><span> position</span><span>,</span><span> </span><span>1.0</span><span> </span><span>);</span><span>
</span><span>}</span><span>
</span>
```

The fragment (pixel) shader should be modified to comply with ES 3.00 spec as well, even though the shader’s logic remains untouched. (Both vertex and fragment shaders must be written using the same specification, otherwise shaders won’t link.)

The main difference is absence of `gl_FragColor` and necessity to use `in` and `out` modifiers. Use explicit `out` declaration instead of `gl_FragColor`.

An example WebGL 1.0 fragment shader...

```
<span>precision mediump </span><span>float</span><span>;</span><span>
uniform sampler2D diffuse</span><span>;</span><span>
varying vec2 vTexCoord</span><span>;</span><span>

</span><span>void</span><span> main</span><span>()</span><span> </span><span>{</span><span>
  vec4 color </span><span>=</span><span> texture2D</span><span>(</span><span>diffuse</span><span>,</span><span> vTexCoord</span><span>);</span><span>
  gl_FragColor </span><span>=</span><span> color</span><span>;</span><span>
</span><span>}</span><span>
</span>
```

...and the equivalent multiview ES 3.00 shader:

```
<span>#version 300 es</span><span>
precision mediump </span><span>float</span><span>;</span><span>
uniform sampler2D diffuse</span><span>;</span><span>
</span><span>in</span><span> vec2 vTexCoord</span><span>;</span><span>
</span><span>out</span><span> vec4 color</span><span>;</span><span>

</span><span>void</span><span> main</span><span>()</span><span> </span><span>{</span><span>
  color </span><span>=</span><span> texture</span><span>(</span><span>diffuse</span><span>,</span><span> vTexCoord</span><span>);</span><span>
</span><span>}</span><span>
</span>
```

**Note:** After the conversion, please see console output in the browser developer tools: there will be a detailed error message if the converted shaders have issues.

## Multi-view WebXR code example