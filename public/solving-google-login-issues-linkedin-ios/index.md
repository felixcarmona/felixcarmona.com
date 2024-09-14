---
title: "Solving Google Login Issues from LinkedIn's In-App Browser on iOS"
date: '2024-09-14'
spoiler: "How I resolved the Error 403: disallowed_useragent that blocked users from logging in with Google on iOS devices through LinkedIn’s in-app browser. This post covers the technical details and the straightforward workaround I implemented."
---

I recently encountered a peculiar issue with one of my product websites when accessed via LinkedIn on iOS devices. Users attempting to sign up or log in through Google were met with this error: `Error 403: disallowed_useragent`.

### Understanding the Problem

Clicking a link within LinkedIn doesn’t open it in the device’s default browser. Instead, it opens in an embedded in-app browser. This is problematic because it fails to meet Google's security standards for authentication. Here’s the typical user agent string from LinkedIn’s in-app browser on iOS:

```
Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [LinkedInApp]/9.30.1317
```

Google’s authentication system blocks logins from browsers it deems insecure, which unfortunately includes LinkedIn’s in-app browser on iOS.

### The Solution

To address this, I devised a workaround that forces links from LinkedIn on iOS to open in Safari. This approach ensures compatibility with Google’s login requirements. Below is the JavaScript snippet that I use to perform this redirection:

```javascript
const userAgent = window.navigator.userAgent;
const url = window.location.href;
if (userAgent.includes('Mobile') && (userAgent.includes('iPhone') || userAgent.includes('iPad')) && userAgent.includes('LinkedInApp')) {
    window.location.href = 'x-safari-' + url;
    return;
}
```

This script checks if the page is accessed from LinkedIn's in-app browser on an iOS device and redirects to Safari using a custom URL scheme (x-safari-...). This scheme is supported starting from iOS 17, and looks like this:

`x-safari-https://example.com` or `x-safari-http://example.com`


### Conclusion
This method ensures that when users click on a link in LinkedIn, the page opens in Safari, enabling them to authenticate using Google without any hitches. It's a simple yet effective solution to an issue that could have hindered the onboarding process on my product website. 

I hope this can be helpful if you're facing similar issues!
