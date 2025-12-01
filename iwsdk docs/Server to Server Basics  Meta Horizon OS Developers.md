Updated: Feb 4, 2025

Some platform features use server-to-server (S2S) REST API calls to perform actions that are not appropriate to be sent from client devices. These APIs are provided to ensure a secure interaction between your back-end servers and the Meta Horizon platform.

For example, we use these APIs to make [in-app purchases](https://developers.meta.com/horizon/documentation/web/ps-iap/) more secure, and prevent fraud.

Details about individual S2S calls can be found using the links in the [Features](https://developers.meta.com/horizon/documentation/web/ps-s2s-basics/#features) section.

## Message basics

There are some server to server message basics you should be familiar with.

## Server-to-Server API requirements

Calls to these APIs must meet the following requirements:

### Endpoint

Make all server-to-server requests to this endpoint:

`https://graph.oculus.com`

### Access token

Include an access token with every request to authenticate it either as a valid server request or on behalf of a specific user. The access token can be one of the following:

-   [App Credentials](https://developers.meta.com/horizon/documentation/web/ps-s2s-basics/#app)-   [User Access Token](https://developers.meta.com/horizon/documentation/web/ps-s2s-basics/#user)

### App credentials

App credentials authenticate your server’s back-end as a trusted resource. Never share these credentials with any client-side application.

The access token with app credentials includes the **App ID** and **App Secret** from the [API](https://developers.meta.com/horizon/manage/app/api/) page on the Meta Horizon Developer Dashboard. It follows this format: `OC|$APPID|$APPSECRET`.

If your credentials are compromised or you need new API credentials, generate a new app secret. Changing the app secret will revoke the permissions of the previous one. Accessing the app secret requires an administrator account.

### User access token

A user access token authenticates requests on behalf of a user. Use this token type when actions relate to a specific user. An example case is updating a client-authoritative leaderboard with the results of a server-hosted multiplayer match. For each user, you would use the user access token to authenticate your server as you make requests to update their leaderboards.

Retrieve the user token with the `ovr_User_GetAccessToken()` method.

The token will be returned as a response and can be passed from the client to your server.A user access token contains `FRL` or `OC` and a long alpha numeric string similar to the following: `FRL12342GhFccWvUBxPMR4KXzM5s2ZCMp0mlWGq0ZBrOMXyjh4EmuAPvaXiMCAMV9okNm9DXdUA2EWNplrQ`.

Additionally, you can retrieve your user token for testing purposes at the ‘User Token’ section of the [API](https://developers.meta.com/horizon/manage/app/api/) page of the Meta Horizon Developer Dashboard, which is at the left navigation bar.

### App ID

Some server calls require an app ID, which you can find on the [API](https://developers.meta.com/horizon/manage/app/api/) page of the Meta Horizon Developer Dashboard.

## Example server call

This is an example of a server API call that shows how to unlock a client-authoritative achievement that a user has earned. This example assumes that you have already created the achievement and integrated the hooks into your app. For more information, see [Achievements](https://developers.meta.com/horizon/documentation/web/ps-achievements/).

-   Retrieve the user’s id - To call the Meta Quest APIs on behalf of a user you need to include the Meta account identifying that user. Call to retrieve the ID. It will be returned as the `ovrID` of the user.-   Pass the information to your trusted server - Once you’ve retrieved the Meta account, pass the account and the `api_name` of the achievement you wish to update or unlock from the client device to your server.-   Form the App Access Token - Use the following credentials that we retrieved from the **Development** > **API** section of the [Developer Dashboard](https://developers.meta.com/horizon/manage):
    -   App Id - `1234567898014273`-   App Secret - `5f8730a4n51c5f8v8122aaf971b937e7`

You can then form the App Access Token as follows: `OC|1234567898014273|5f8730a4n51c5f8v8122aaf971b937e7`.

-   Call the API to unlock the achievement - Once you’ve retrieved the information from the client device and formed the App Access Token, send the API call to unlock the achievement.

```
<span>curl </span><span>-</span><span>d </span><span>"access_token=OC|$APP_ID|$APP_SECRET"</span><span> </span><span>-</span><span>d </span><span>"api_name=MY_SIMPLE_ACHIEVEMENT"</span><span> </span><span>-</span><span>d </span><span>"force_unlock=true"</span><span> https</span><span>:</span><span>//graph.oculus.com/$USER_ID/achievements</span>
```

The following response indicates that the request was successful.

```
<span>{</span><span> </span><span>"id"</span><span>:</span><span>"$USERID"</span><span>,</span><span> </span><span>"api_name"</span><span>:</span><span>"MY_SIMPLE_ACHIEVEMENT"</span><span>,</span><span> </span><span>"just_unlocked"</span><span>:</span><span>true</span><span> </span><span>}</span>
```

You can then pass a message back to the client indicating that the achievement has been successfully unlocked.

## Features with server APIs

Following is a list of platform solutions that provide server APIs

-   [In-App Purchases](https://developers.meta.com/horizon/documentation/web/ps-iap/#s2s-rest-requests)-   [Achievements](https://developers.meta.com/horizon/documentation/web/ps-achievements/#making-rest-requests-for-server-achievements)-   [Leaderboards](https://developers.meta.com/horizon/documentation/web/ps-leaderboards-s2s/)-   [Moderated Rooms (Deprecated)](https://developers.meta.com/horizon/documentation/web/ps-rooms-s2s/)

## Error responses and HTTP codes

The Meta Quest S2S REST APIs support the standard HTTP status codes indicate what the issue is.

| Code | Status |
| --- | --- |
| 
400

 | 

Bad Request

 |
| 

401

 | 

Unauthorized Request

 |
| 

403

 | 

Forbidden Request

 |
| 

404

 | 

Not Found

 |
| 

500

 | 

Internal Server Error

 |