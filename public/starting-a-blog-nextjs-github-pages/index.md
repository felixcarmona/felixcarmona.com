---
title: "Starting a Blog with Next.js and GitHub Pages"
date: '2024-09-13'
spoiler: "This blog aims to share practical tips and knowledge gathered along the way in software development. After considering different platforms, forking overreacted.io and hosting it on GitHub Pages seemed like the simplest and cleanest option. The focus is on keeping things minimal, letting the content shine without worrying too much about the technical setup."
---

Hi! I'm Felix Carmona, developer. I've decided to create this blog to occasionally share useful tips and bits of knowledge I come across. Hopefully, some of it will be helpful to others.

When I started looking for a way to set up this blog, I wanted something simple and minimal—just enough to let me focus on the content without getting too caught up in the tech side of things.

After checking out static options like [Jekyll](https://jekyllrb.com/) and [gatsby-starter-blog](https://www.gatsbyjs.com/starters/gatsbyjs/gatsby-starter-blog), I ended up forking [**overreacted.io**](https://overreacted.io/). It originally started as a gatsby-starter-blog fork, but [Dan Abramov](https://danabra.mov/), the creator, later rewrote it in Next.js.

If you're interested in trying it out, you can fork the original repo from [overreacted.io on GitHub](https://github.com/gaearon/overreacted.io).

To host it on GitHub Pages like I did, just enable Pages in your repo's Settings under the **Pages** section (inside **Code and Automation**). Select **GitHub Actions** as the source, and you can also set up a custom domain there if you want.

Once GitHub Pages is set up, go to the **Actions** tab in your repo, click **New Workflow**, search for **Next.js**, and hit **Configure**.

You don’t need to change anything in the `.github/workflows/nextjs.yml` file, just commit it. From now on, any commit you push to the repo will automatically update your GitHub Pages site.

To test things before pushing changes, clone your repo and run:

```bash
npm install
npm run dev
```

This starts the blog at [http://localhost:3000](http://localhost:3000) , so you can see how it looks.

Enjoy!