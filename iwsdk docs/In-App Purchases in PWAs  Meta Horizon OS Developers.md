Updated: Mar 27, 2025

This topic discusses how to integrate add-ons with in-app purchase into your PWAs.

-   For an overview of add-ons, see [Add-ons (DLC and IAP)](https://developers.meta.com/horizon/resources/add-ons/).-   For guidance on setting up add-ons, see [Setting Up Add-ons](https://developers.meta.com/horizon/resources/add-ons-setup).-   For best practices and other considerations, see [Working with Add-ons](https://developers.meta.com/horizon/resources/working-with-add-ons).-   For details on server-to-server APIs, see [IAP Server to Server APIs](https://developers.meta.com/horizon/documentation/web/ps-iap-s2s/).-   For guidance on testing, see [Testing Add-ons](https://developers.meta.com/horizon/documentation/web/ps-iap-test/).

The [Digital Goods API](https://wicg.github.io/digital-goods/) is a web API that allows Progressive Web Apps (PWAs) to sell digital goods and services, such as in-app purchases. This API enables PWAs to provide a seamless purchasing experience for users, while also generating additional revenue streams.

Currently, Meta Horizon OS only supports the in-app purchase feature of Digital Goods API in WebXR PWAs, with the support of subscriptions coming at a later date.

This is a Platform SDK feature requiring Data Use Checkup

To use this or any other Platform SDK feature, you must [complete a Data Use Checkup (DUC)](https://developers.meta.com/horizon/resources/publish-data-use/). The DUC ensures that you comply with Developer Policies. It requires an administrator from your team to certify that your use of user data aligns with platform guidelines. Until the app review team reviews and approves your DUC, platform features are only available for [test users](https://developers.meta.com/horizon/resources/test-users/).

## Getting started

Currently in Meta Horizon OS, the Digital Goods service is only available for WebXR PWAs that’s installed from the Meta Horizon Store (including ALPHA and BETA channels). If available, the method `window.getDigitalGoodsService()` can be called in Javascript with a the quest billing URL. The method returns a promise that is rejected if the given service provider is not available.

Here is an example wrapper function that calls `window.getDigitalGoodsService()`:

```
<span>async</span><span> </span><span>function</span><span> getDigiGoodsService</span><span>()</span><span> </span><span>{</span><span>
    </span><span>if</span><span> </span><span>(!(</span><span>"getDigitalGoodsService"</span><span> </span><span>in</span><span> window</span><span>))</span><span> </span><span>{</span><span>
        </span><span>throw</span><span> </span><span>new</span><span> </span><span>Error</span><span>(</span><span>'Digital Goods service not supported in this browser.'</span><span>);</span><span>
    </span><span>}</span><span>

    </span><span>let</span><span> service </span><span>=</span><span> </span><span>undefined</span><span>;</span><span>
    </span><span>try</span><span> </span><span>{</span><span>
        service </span><span>=</span><span> </span><span>await</span><span> window</span><span>.</span><span>getDigitalGoodsService</span><span>(</span><span>'https://quest.meta.com/billing'</span><span>);</span><span>
        console</span><span>.</span><span>log</span><span>(</span><span>'got digital goods service'</span><span>);</span><span>
    </span><span>}</span><span> </span><span>catch</span><span> </span><span>(</span><span>e</span><span>)</span><span> </span><span>{</span><span>
        service </span><span>=</span><span> </span><span>undefined</span><span>;</span><span>
        console</span><span>.</span><span>error</span><span>(</span><span>`Error! ${e.message}`</span><span>);</span><span>
        </span><span>throw</span><span> e</span><span>;</span><span>
    </span><span>}</span><span>

    </span><span>return</span><span> service</span><span>;</span><span>
</span><span>}</span>
```

## Querying item details by item ID (SKU)

The `getDetails()` method returns server-side details about a given set of items, intended to be displayed to the user in a menu, so that they can see the available purchase options and prices without having to go through a purchase flow.

For example:

```
<span>const</span><span> service </span><span>=</span><span> </span><span>await</span><span> getDigiGoodsService</span><span>();</span><span>
</span><span>const</span><span> details </span><span>=</span><span> </span><span>await</span><span> service</span><span>.</span><span>getDetails</span><span>([</span><span>itemId</span><span>]);</span>
```

The item ID is a string representing the primary key of the items, configured in the Meta Horizon Store Developer Center as the item’s “SKU”. There is no function to get a list of item IDs; those have to be hard-coded in the client code or fetched from the developer’s own server.

The returned `ItemDetails` sequence can be in any order and might not include an item if it doesn’t exist on the server (i.e., there is not a 1:1 correspondence between the input list and output).

## Initiate a purchase

The [Payment Request API](https://w3c.github.io/payment-request/) can be used to initiate a user in-app purchase inside a WebXR PWA with a specific item ID. After this API is called, a system in-app purchase dialog would pop up and the user can make the payment with Meta Horizon Store.

For example:

```
<span>async</span><span> </span><span>function</span><span> purchase</span><span>(</span><span>itemId</span><span>)</span><span> </span><span>{</span><span>
    </span><span>// The 'paymentDetails' values are not actually used in the paymentRequest so dummy values are okay. The most important is that paymentMethods should be correctly populated.</span><span>
    </span><span>const</span><span> paymentDetails </span><span>=</span><span> </span><span>{</span><span> total</span><span>:</span><span> </span><span>{</span><span> label</span><span>:</span><span> </span><span>'Total'</span><span>,</span><span> amount</span><span>:</span><span> </span><span>{</span><span>currency</span><span>:</span><span> </span><span>'USD'</span><span>,</span><span> value</span><span>:</span><span> </span><span>'0'</span><span>}</span><span> </span><span>}</span><span> </span><span>};</span><span>
    </span><span>const</span><span> paymentMethods </span><span>=</span><span> </span><span>[{</span><span> supportedMethods</span><span>:</span><span> </span><span>"https://quest.meta.com/billing"</span><span>,</span><span> data</span><span>:</span><span> </span><span>{</span><span> sku</span><span>:</span><span> itemId</span><span>,</span><span> </span><span>}</span><span> </span><span>}];</span><span>
    </span><span>const</span><span> request </span><span>=</span><span> </span><span>new</span><span> </span><span>PaymentRequest</span><span>(</span><span>paymentMethods</span><span>,</span><span> paymentDetails</span><span>);</span><span>
    </span><span>const</span><span> response </span><span>=</span><span> </span><span>await</span><span> request</span><span>.</span><span>show</span><span>();</span><span>
    </span><span>const</span><span> purchaseToken </span><span>=</span><span> response</span><span>.</span><span>details</span><span>.</span><span>purchaseToken</span><span>;</span><span>
    console</span><span>.</span><span>log</span><span>(</span><span>`got purchase token: ${purchaseToken}`</span><span>);</span><span>
    </span><span>return</span><span> purchaseToken</span><span>;</span><span>
</span><span>}</span>
```

To test purchases with a sideloaded .apk, visit chrome://flags in Browser and enable `#enable-debug-for-store-billing`. This is not a requirement when installing the app from the Store.

## Retrieve the user’s purchased items

You can call the `listPurchases()` API to retrieve a list of IAP purchases that the user has made. The returned list includes all durable type purchases and any consumable type purchases that have not been consumed.

For example:

```
<span>async</span><span> </span><span>function</span><span> listPurchases</span><span>()</span><span> </span><span>{</span><span>
    </span><span>const</span><span> service </span><span>=</span><span> </span><span>await</span><span> getDigiGoodsService</span><span>();</span><span>
    </span><span>const</span><span> purchases </span><span>=</span><span> </span><span>await</span><span> service</span><span>.</span><span>listPurchases</span><span>();</span><span>
    </span><span>return</span><span> purchases</span><span>;</span><span>
</span><span>}</span>
```

Meta Horizon Store doesn’t support purchase history. The return value of [listPurchaseHistory()](https://wicg.github.io/digital-goods/#checking-past-purchases) API would be the same data as the `listPurchases()` method.

## Getting User Age Group

All Meta Quest developers are required to indicate their app’s intended age group via a self-certification flow. For more information, check [determining your app age group](https://developers.meta.com/horizon/resources/age-groups/#determining-your-app-age-group).

If your PWA’s target age group is Mixed Ages, then you are required to implement the Get Age Category API in your PWA and make sure it is called every time your PWA is launched. For more information, check [Age group self-certification and youth requirements](https://developers.meta.com/horizon/resources/age-groups/).

The `DigitalGoodsService.getUserAccountAgeCategory()` API is exclusive to PWAs running on Meta Horizon OS.

```
<span>async</span><span> </span><span>function</span><span> getUserAccountAgeCategory</span><span>()</span><span> </span><span>{</span><span>
    </span><span>const</span><span> service </span><span>=</span><span> </span><span>await</span><span> getDigiGoodsService</span><span>();</span><span>
    </span><span>const</span><span> userAgeCategory </span><span>=</span><span> </span><span>await</span><span> service</span><span>.</span><span>getUserAccountAgeCategory</span><span>();</span><span>
    </span><span>return</span><span> userAgeCategory</span><span>;</span><span>
</span><span>}</span>
```

## Retrieve ID of the current user

You can retrieve the unique ID for the current user, you can use `DigitalGoodsService.getLoggedInUserId()`. This method returns a 16 digit id and would return `6` if something goes wrong. The most common cause of failure is the absence of [Data Use Checkup](https://developers.meta.com/horizon/resources/publish-data-use/) of your application. The user ID returned by this method is specific only to this application.

Note: The `DigitalGoodsService.getLoggedInUserId()` API is exclusive to PWAs running on Meta Horizon OS.

```
<span>async</span><span> </span><span>function</span><span> getLoggedInUserId</span><span>()</span><span> </span><span>{</span><span>
    </span><span>const</span><span> service </span><span>=</span><span> </span><span>await</span><span> getDigiGoodsService</span><span>();</span><span>
    </span><span>const</span><span> userId </span><span>=</span><span> </span><span>await</span><span> service</span><span>.</span><span>getLoggedInUserId</span><span>();</span><span>
    </span><span>return</span><span> userId</span><span>;</span><span>
</span><span>}</span>
```