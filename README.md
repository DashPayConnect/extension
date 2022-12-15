# extension
The DashPay Connect extension enables browsing Dash blockchain enabled websites.

![image](https://user-images.githubusercontent.com/5849920/207965123-14fcd6e5-a9ba-4ce7-8ad4-b5082c508751.png)

#### Installation

- Git clone the repository.
- Open `chrome://extensions` in Chrome, and click `Load unpacked`
- Load the `/dist` folder of the repository. 


Try the demo : https://dashpayconnect.github.io/docs/boilerplate/connect-demo/index.html

## Development

This project uses NodeJS and requires a `yarn link` with the Platform workspace to be performed first.   
This is due to the usage of DashJS which is not compatible with Browser extension.  
We need to compile platform with modification described below. 

`git clone https://github.com/dashevo/platform && cd platform && yarn install` 

Then from the /extension folder : `yarn link --all ../platform`

### Modification to perform 

- All reference of `@dashevo/protobufjs/minimal` needs to be changed for `protobufjs/minimal` (dapi-grpc)
- Have js-dapi-client's JsonRPCTransport to use fetch instead of axios.post.
- Modify dash sdks webpack config to have terserOption to `keep_fnames: true` and `output: { ascii_only: true }`,
- Upon building, some issue arise with eval generated `return this`, we will apply a fix outself in the webpack of this project.  

This setup is temporary, hopefully we will have it modified in Platform directly.  

#### On build
> Perform replace of `Function("return this")();` to `(function() { return this || window || global || self; }).call(null);`
> and `window.crypto` to `self.crypto`

Add a unpacked extension using the `npm run build:full` and loading the `/dist` folder to use the application.   
Ensure ExtensionID match (should stay the same) for js-library integration.   
