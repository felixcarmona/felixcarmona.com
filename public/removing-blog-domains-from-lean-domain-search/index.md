---
title: 'Removing .blog domains from Lean Domain Search'
date: '2024-09-26'
spoiler: "Tired of Lean Domain Search showing .blog domains when you're only interested in .coms? I built a quick Chrome extension to clean up those search results. If you don't want to install it, there's also a simple code snippet you can run directly in your browser to filter them out. Check out the details here."
---

[**Lean Domain Search**](https://leandomainsearch.com/) is great for finding available .com domains, but recently, it started showing a bunch of .blog domains in the search results. It's frustrating because while the .blog versions are available, the .com domains that most people are after are usually already taken. And there's no easy way to filter out the .blog domains.

I found it annoying enough that I decided to build a simple Chrome extension to fix it. The extension automatically removes .blog domains from the search results, leaving just the available .com domains for you to browse.

You can grab the extension here: [**Clean Domain Search**](https://github.com/felixcarmona/clean-domain-search)

## Not a fan of installing extensions?

No worries. You can run this quick JavaScript snippet directly in your browser's console when you're on [*Lean Domain Search*](https://leandomainsearch.com/):

```javascript
setInterval(() => {
    const buttons = [...document.getElementsByTagName('button')];
    buttons.forEach((button) => {
        if (button.disabled && button.innerText === '.com') {
            button.parentNode.parentNode.remove()
        }
    });
    const divs = [...document.querySelectorAll('div[data-page]')];
    divs.forEach((div) => {
        if (div.innerText.trim() === '') {
            div.remove();
        }
    });
}, 1000);
```
If you're on Windows or Linux, press `F12` or `Ctrl+Shift+I`. On a Mac, press `Cmd+Option+I` to open the developer tools, go to the Console tab, and paste in the code. It'll clean up the results and leave you with the .com domains only.