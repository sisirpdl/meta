Updated: Mar 27, 2025

## Test add-ons

You can test your add-on integration by creating [test users](https://developers.meta.com/horizon/resources/test-users) for your team.

We recommend using Test Users to validate your in-app entitlement functionality and purchase flow, as you can grant/revoke add-on entitlements to your test users easily, even if the add-ons are in draft mode and have not been published to all users

## Set up test payment method

Test users have permission to buy add-ons in your app, including Alpha, Beta, and Release Candidate apps and draft add-ons, without using real money. These users will work with all applications in your team and can be deleted at any time. Before you can buy add-ons as a test user, you must set up test payment information.

This is done either through the [Developer Dashboard](https://developers.meta.com/horizon/manage/), in the headset, or from the Meta Quest mobile app.

### Setting up test payments in the Developer Dashboard

-   Open your browser and navigate to the [Developer Dashboard](https://developers.meta.com/horizon/manage/).-   Expand **Development** in the left-side navigation, and click **Test Users**.-   If you already have a test user, click the ellipses (...) menu on a test user. Otherwise, [create a test user](https://developers.meta.com/horizon/resources/test-users#creating-test-users) to continue.-   Click **Manage Test Credit Cards** from the drop-down menu. Since this user will be testing the IAP and subscription checkout flow, add the following credit card numbers to test different add-on flows.
    
    -   Always succeeds - 4111 1177 1155 2927-   Fails at sale - 4111 1193 1540 5122
    
    These cards only work with test users and can only be used within your team.
    -   Select the pre-set credit cards you want for the test user that supports your use case.-   Select **Submit** to have the credit cards added for the test user.

**Note**: Don’t use real credit card numbers with test users, as the purchases will be charged as a regular transaction. Only use the test credit card numbers provided.

## Testing Entitlements

### Manage Add-on Entitlement Directly

You can Grant your Test User the entitlement to your Add-on through the Developer Dashboard, without having to execute the entire end-to-end purchase flow.

This tool also allows you to Revoke Test User entitlements for the Add-ons, allowing fast testing of different entitlement states and the overall purchase flow.

It is suggested you do such testing to confirm your application is recognizing when a user is granted/loses/consumes an add-on entitlement within your app.

### Manage Add-on Entitlements

Test users can grant/revoke add-on entitlements using the **Manage Add-on Entitlements** modal.

-   Open your browser and navigate to the [Developer Dashboard](https://developers.meta.com/horizon/manage/) and click on your app.-   Expand **Development** in the left-side navigation, and click **Test Users**.-   If you already have a test user, click the ellipses (...) menu on a test user. Otherwise, create a test user to continue.-   Click **Manage Add-on Entitlements** from the drop-down menu.-   Select both the **App** and the **Add-ons** that you want to modify the entitlement of in the **Add-ons Entitlements** modal.-   Click **Submit** to confirm.

### Testing payments in the headset or mobile app

Testing your IAP purchase flow with a Test User allows a view into what users see when they try to purchase your Add-on

You must be signed in as the test user to set up the test payment information. To do so, log in to that account using the generated email and password you created and add a payment method for the user.

Test credit cards set for the test user in the Developer Dashboard will automatically apply to the user for Headset/Mobile App usage as well

If you haven’t set up the above credit cards through the developer portal and want to do so in Headset/Mobile App directly, you can do so after logging in. When entering the test credit cards, you’ll need to provide a 5 digit zip code, an expiration date that has not already passed, and **111** for the security code.

## Distributing add-ons with keys

You can optionally distribute add-ons with keys if your app has been approved for release or key generation. To create a key for your IAP item:

-   Open your browser and navigate to the [Developer Dashboard](https://developers.meta.com/horizon/manage/) and click on your app.-   From the left-side navigation, expand **Distribution** and click **Keys**. If the app has been reviewed by Meta Quest and approved for release or key generation, the Keys page appears and you have the option to select **Create New Keys**. For more information, see [Meta Platforms Technology Keys](https://developers.meta.com/horizon/policy/distribution-options/#meta-platforms-technologies-keys).-   Create a key using the on-page instructions, specifying the SKU for the add-on you wish to distribute with a key.-   Click **Create** when you are finished to display the key.-   Copy and save the key in a safe place as you cannot retrieve it after you exit this page.