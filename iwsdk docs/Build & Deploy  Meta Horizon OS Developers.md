This tutorial shows you how to build for production and deploy to GitHub Pages so others can experience your creation.

## Production build process

Your starter app is already configured with Vite plugins that automatically optimize assets during build. When you run `npm run build`, it:

-   Bundles and minifies your JavaScript/TypeScript code.-   Compresses GLTF models with Draco and optimizes textures.-   Generates a deployable static site in the `dist/` folder.

## Building your project

Navigate to your project directory and run:

This creates a `dist/` folder with your optimized application. The build automatically:

-   Compresses your GLTF models using Draco compression.-   Optimizes textures with KTX2 compression (when available).-   Bundles and minifies JavaScript.-   Copies public assets.

## Asset optimization

Your starter app includes the `@iwsdk/vite-plugin-gltf-optimizer` plugin that automatically compresses GLTF models and textures during build.

### Current configuration

In your `vite.config.ts`, you can see the optimizer is already configured:

```
<span><span>import</span><span>&nbsp;{&nbsp;optimizeGLTF&nbsp;}&nbsp;</span><span>from</span><span>&nbsp;</span><span>'@iwsdk/vite-plugin-gltf-optimizer'</span><span>;</span></span><br><span><span></span></span><br><span><span>export</span><span>&nbsp;</span><span>default</span><span>&nbsp;defineConfig({</span></span><br><span><span>&nbsp;&nbsp;plugins:&nbsp;[</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>//&nbsp;...&nbsp;other&nbsp;plugins</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;optimizeGLTF({</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;level:&nbsp;</span><span>'medium'</span><span>,</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;}),</span></span><br><span><span>&nbsp;&nbsp;],</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

### Optimization levels

The plugin offers three preset levels:

-   `light`: Fast build, moderate compression.-   `medium`: Balanced build time and compression.-   `aggressive`: Slower build, maximum compression.

### KTX2 compression requirements

The optimizer uses KTX2 compression by default for better texture compression. If you don’t have KTX-Software installed, you’ll see this warning:

```
<span>⚠️</span><span>  KTX</span><span>-</span><span>Software</span><span> </span><span>not</span><span> found </span><span>(</span><span>missing </span><span>"ktx"</span><span> CLI</span><span>).</span><span> </span><span>Skipping</span><span> KTX2 compression</span><span>.</span><span>
   </span><span>Install</span><span> </span><span>from</span><span>:</span><span> https</span><span>:</span><span>//github.com/KhronosGroup/KTX-Software/releases</span>
```

The build will fall back to standard texture optimization instead of crashing, but installing KTX-Software gives you better compression results. Download and install it from the [KTX-Software releases page](https://github.com/KhronosGroup/KTX-Software/releases) for optimal texture compression.

### Advanced configuration

For more control, you can customize specific options:

```
<span><span>optimizeGLTF({</span></span><br><span><span>&nbsp;&nbsp;level:&nbsp;</span><span>'medium'</span><span>,</span></span><br><span><span>&nbsp;&nbsp;verbose:&nbsp;</span><span>true</span><span>,&nbsp;</span><span>//&nbsp;Show&nbsp;optimization&nbsp;details</span></span><br><span><span>&nbsp;&nbsp;geometry:&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;compress:&nbsp;</span><span>'draco'</span><span>,&nbsp;</span><span>//&nbsp;Draco&nbsp;compression</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;quality:&nbsp;</span><span>0.8</span><span>,&nbsp;</span><span>//&nbsp;Higher&nbsp;=&nbsp;better&nbsp;quality,&nbsp;larger&nbsp;size</span></span><br><span><span>&nbsp;&nbsp;},</span></span><br><span><span>&nbsp;&nbsp;textures:&nbsp;{</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;mode:&nbsp;</span><span>'auto'</span><span>,&nbsp;</span><span>//&nbsp;Automatic&nbsp;texture&nbsp;compression</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;quality:&nbsp;</span><span>0.75</span><span>,&nbsp;</span><span>//&nbsp;Texture&nbsp;compression&nbsp;quality</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;maxSize:&nbsp;</span><span>1024</span><span>,&nbsp;</span><span>//&nbsp;Maximum&nbsp;texture&nbsp;resolution</span></span><br><span><span>&nbsp;&nbsp;},</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

During build, you’ll see optimization results showing significant file size reductions for your GLTF models and textures.

## Deploying to GitHub pages

GitHub Pages provides free hosting perfect for WebXR applications.

### Step 1: Configure base path

Update your `vite.config.ts` to set the correct base path:

```
<span><span>export</span><span>&nbsp;</span><span>default</span><span>&nbsp;defineConfig({</span></span><br><span><span>&nbsp;&nbsp;base:&nbsp;</span><span>'/your-repository-name/'</span><span>,&nbsp;</span><span>//&nbsp;Must&nbsp;match&nbsp;your&nbsp;GitHub&nbsp;repo&nbsp;name</span></span><br><span><span>&nbsp;&nbsp;</span><span>//&nbsp;...&nbsp;rest&nbsp;of&nbsp;your&nbsp;existing&nbsp;config</span></span><br><span><span>});</span></span><br><span><span></span></span><br>
```

### Step 2: Manual deployment

Install the gh-pages tool and deploy:

```
<span># Install deployment tool</span><span>
npm install </span><span>-</span><span>D gh</span><span>-</span><span>pages

</span><span># Build and deploy</span><span>
npm run build
npx gh</span><span>-</span><span>pages </span><span>-</span><span>d dist</span>
```

### Step 3: Enable GitHub pages

-   Go to your repository on GitHub.-   Click **Settings** > **Pages**.-   Set **Source** to **Deploy from a branch**.-   Select the `gh-pages` branch.-   Click **Save**.
    
    Your app will be live at: `https://yourusername.github.io/your-repository-name/`
    

### Automated deployment with GitHub actions

For automatic deployment on every push, create `.github/workflows/deploy.yml`:

```
<span><span>name</span><span>:&nbsp;</span><span>Deploy&nbsp;to&nbsp;GitHub&nbsp;Pages</span></span><br><span><span></span></span><br><span><span>on</span><span>:</span></span><br><span><span>&nbsp;&nbsp;</span><span>push</span><span>:</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>branches</span><span>:&nbsp;[</span><span>main</span><span>]</span></span><br><span><span></span></span><br><span><span>jobs</span><span>:</span></span><br><span><span>&nbsp;&nbsp;</span><span>build-and-deploy</span><span>:</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>runs-on</span><span>:&nbsp;</span><span>ubuntu-latest</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>steps</span><span>:</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;</span><span>name</span><span>:&nbsp;</span><span>Checkout</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>uses</span><span>:&nbsp;</span><span>actions/checkout@v4</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;</span><span>name</span><span>:&nbsp;</span><span>Setup&nbsp;Node.js</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>uses</span><span>:&nbsp;</span><span>actions/setup-node@v4</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>with</span><span>:</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>node-version</span><span>:&nbsp;</span><span>'20'</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>cache</span><span>:&nbsp;</span><span>'npm'</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;</span><span>name</span><span>:&nbsp;</span><span>Install&nbsp;dependencies</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>run</span><span>:&nbsp;</span><span>npm&nbsp;install</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;</span><span>name</span><span>:&nbsp;</span><span>Build</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>run</span><span>:&nbsp;</span><span>npm&nbsp;run&nbsp;build</span></span><br><span><span></span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;</span><span>name</span><span>:&nbsp;</span><span>Deploy&nbsp;to&nbsp;GitHub&nbsp;Pages</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>uses</span><span>:&nbsp;</span><span>peaceiris/actions-gh-pages@v4</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>if</span><span>:&nbsp;</span><span>github.ref&nbsp;==&nbsp;'refs/heads/main'</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>with</span><span>:</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>github_token</span><span>:&nbsp;</span><span>$</span></span><br><span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>publish_dir</span><span>:&nbsp;</span><span>./dist</span></span><br><span><span></span></span><br>
```

## Next steps

For developers ready to dive deeper into advanced IWSDK development, continue with:

-   Advanced Topics: Explore physics simulation, scene understanding, and performance optimization.-   Production Patterns: Learn enterprise-level development practices, testing strategies, and deployment pipelines.