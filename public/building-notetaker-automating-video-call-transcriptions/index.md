---
title: 'Building a Notetaker: Automating Video Call Transcriptions with AI'
date: '2024-09-20'
spoiler: 'A deep dive into how I built a notetaker that automatically records, transcribes, and summarizes video calls from platforms like Zoom and Google Meet, leveraging AI to turn meetings into actionable insights.'
---
For a while now, I’ve been working on a notetaker that records video calls (Zoom, Google Meet, etc.), transcribes them, and then applies AI to the transcription. The goal is to help people capture key points from conversations without the hassle of manually taking notes.

### Three methods to record a video call
There are generally three ways to record a video call, each with its own characteristics, and I'll walk you through them briefly before diving deeper into the method I’ve found most effective.

#### Automated bot
One approach is using an automated bot that controls a browser, joins the call, and records the screen. This method is almost entirely hands-off for the user, as it doesn’t require any kind of installation or setup. It’s especially useful when the main participant, such as a meeting organizer, is unable to join the call—like in sales calls arranged by a third party, where two other people are conducting the actual conversation. The bot can still jump in, record the session, and capture metadata like who’s speaking or chat messages.

From my experience, one of the common concerns is whether having a bot join a meeting feels intrusive. But after recording thousands of hours for hundreds of clients, this hasn’t really been an issue. People seem to adapt quickly, especially if you give the bot a friendly name, like _"Felix's Notetaker"_. It helps blend it into the meeting without causing too much friction.

#### Browser extension / Desktop app
Another option is to use a browser extension or a desktop app to record the call. While this method is less visible to other participants—since no bot appears to be joining the meeting—it comes with its own challenges. Developing separate extensions for each browser or apps for different operating systems is time-consuming, and once built, there’s the added complexity of distributing them through platform-specific stores, often requiring approval and verification processes.

On the technical side, browser extensions have the advantage of allowing access to data like who’s speaking during the call, but desktop apps don’t make this as easy. The bigger drawback, however, is that **if the main participant who initiated the recording leaves the call—whether because of a dropped connection or just exiting early—the rest of the meeting won’t be recorded**. This creates gaps and is a major limitation in scenarios where continuous recording is important.

#### Native platform recording
The last option is using the built-in recording features offered by platforms like Google Meet. This is a simple, no-fuss solution for people who are already familiar with the platform, as the recording is saved directly to services like Google Drive. But here’s the catch: these features often require manual setup before the call, which can be a bit tedious and lacks the automation that makes recording a large volume of calls efficient.

Also, native platform recordings are usually limited in what they can do. They don’t give you extra data, like who’s speaking at any given time or detailed chat logs. It’s a basic solution, good enough for simple cases, but less suited for more complex needs.

For these reasons, *I’m focusing this article on the bot-based approach. It’s the method that offers the most flexibility without requiring too much from the user*. Let's dive deeper into how it works and why I think it’s the best option.


### Step-by-step breakdown
#### User authentication
First, the user needs to authenticate using their email provider, like Gmail, and give us permission to access their calendar. Through the API, we can check when they have video calls and on what platform, using details like conference data from Gmail events. The bot launcher stays in sync with the event and can cancel if the meeting gets called off or attendees decline.

### Launching the bot
When it’s time for the call, the bot automatically joins. For this, I recommend using Chrome with Chromedriver, which I’ll focus on here. However, it’s important to understand that Chrome is a memory-intensive application. Running multiple instances on the same machine can quickly lead to memory exhaustion, resulting in the system terminating processes—this is commonly referred to as Out of Memory (OOM) kills.

If Chrome crashes during a call, you risk losing the entire recording, which is a terrible user experience for a notetaker. To mitigate this risk, here are two critical recommendations:

- **Enable Swap:** This acts as a safety net during memory usage spikes, providing extra buffer memory. When the system is under pressure, swap can help avoid OOM kills.
- **Process Isolation:** Each bot process should be fully isolated. If the operating system runs out of memory and needs to terminate processes, you don’t want all bots to share the same parent process. Imagine recording 10 calls simultaneously—losing one due to memory constraints might be acceptable, but losing all 10 would be catastrophic.

To achieve isolation, ensure the entire process tree where Chrome runs is separated. It’s not enough to isolate 10 Chromedriver instances if they all hang from the same orchestrating process. If that parent process gets killed, all your bots go down with it.

A practical solution to manage this is using `systemctl` in Linux. Here’s a partial setup:

```bash
[Service]
ExecStart=/usr/local/bin/chromedriver --port=%i --url-base=wd/hub
OOMScoreAdjust=-999
...
````
By spawning each bot process through `systemctl`, you achieve full isolation. Additionally, I highly recommend setting the `OOMScoreAdjust` value to make sure the system deprioritizes killing your Chromedriver processes. This ensures better resilience against memory issues and keeps your recordings safe.

### Accessing the call

To join the call, there are two main ways to approach this:
- **Anonymous Access:** Most platforms allow anonymous participants to join. You just provide a name, and the bot enters. Depending on how the meeting is configured, the bot might get in automatically or need to be let in by someone in the meeting. If a password is required (like on Zoom), this is typically found in the conference data of the event.
- **Authenticated Access:** This depends on the platform. For instance, in Google Meet, you’d need a dedicated Workspace user and OAuth authentication. This path has its limitations, like not being able to change the bot’s name. I recommend delegating this responsibility to the end user, allowing them to provide a pool of users from their Workspace if needed.

For simplicity, going with anonymous access is the best route.

### The technical details: Recording the screen
To control Chromedriver, the most practical approach is to use Selenium, which offers a well-known interface to control WebDriver (in this case, Chromedriver). You’ll also rely heavily on JavaScript since Selenium's interfaces can be somewhat limited depending on the programming language you use. Don’t hesitate to write your own implementations directly in JavaScript when necessary.

When programming the bot, I recommend designing the architecture around events, reacting to them as needed. Various things can happen during a call, and you’ll need to switch between scenarios efficiently. For example, if a popup appears, you’ll want to close it. If the call ends, or the last participant leaves, you’ll want to stop recording and terminate the bot process. Or, you might want to wait until a minimum number of participants have joined before starting the recording.

As for screen recording, it’s essential to understand that Chrome doesn’t allow arbitrary screen recording via Chromedriver or JavaScript. To capture the screen, you’ll need to develop a native browser extension. The API you need for this is [chrome.tabCapture](https://developer.chrome.com/docs/extensions/mv2/reference/tabCapture).

It’s important to note that I’m specifically referring to Manifest v2 instead of the newer v3. Currently, v2 is the only version that works for this use case, as v3 isn’t ready yet for what we need. Also, using this capability requires elevated permissions, so you’ll need to whitelist your extension when launching Chrome. This can be easily done with the `--allowlisted-extension-id` argument.

In the extension, I recommend streaming the recorded data using `MediaRecorder`. Why? Because in case the process crashes, you don’t want to lose everything you’ve recorded. By streaming the data, whatever has been captured up to that point is saved. This also opens up the possibility of resuming the recording if you’ve developed failover mechanisms that can spin up another bot.

### Post-Recording: Fixing timestamps

When you record in `webm` format, you may notice that the video file doesn’t include time stamps, which means you can’t seek through the video properly. But don’t worry, you can fix this easily using `MKVToolNix`:

```bash
mkvmerge -o video_fixed.webm video.webm
```

This takes less than a second to run and solves the issue.

### Transcribing the audio

When it comes to transcription, smaller files work better. If you recorded video and audio, it’s a good idea to split them. Use `MKVToolNix` to extract just the audio:

```bash
mkvmerge -o audio.webm --no-video video.webm
```

From here, you have a couple of options:

- **Use a SaaS Transcription Service:** This is usually more accurate but can get expensive. Prices range from $0.1 to $0.4 per hour of audio. For instance, assuming a median cost of $0.3/hour, transcribing an entire month’s worth of calls would cost about $216 per month.
- **Host Your Own Model (Like Whisper):** If you want to cut costs and have a GPU available (like an NVIDIA RTX 4080), this can be a very cost-effective solution. Let’s break it down:

A powerful GPU like the RTX 4080 costs about $0.13/hour on platforms like [salad](https://salad.com). If you rent the GPU 24/7, it’ll cost roughly $93.6 per month. **Unlike SaaS, you’re paying for GPU time, not audio hours**. Transcribing 1 hour of audio doesn’t take 1 hour of GPU time—more like 5 minutes.  

So, with $93.6/month, you could process around **8640 hours of audio**, bringing the cost down to about $0.01/hour.

As always, it depends on the volume and precision you need. SaaS is great for scalability, but hosting your own system can be a game-changer in terms of cost. You could even combine both systems—using SaaS for premium users and self-hosting for free plans.

### Speaker Diarization

When it comes to transcribing the call, you’ll likely want to diarize it as well—essentially, identifying who said what. While most AI transcription services can distinguish between different speakers (e.g., _"Speaker 1 said X"_ and _"Speaker 2 said Y"_), they don’t inherently know if Speaker 1 is Felix or David. You might be able to infer it based on context—like if someone says, _"Hi Felix"_—but this is a heuristic approach and generally not very reliable.

To make speaker identification more accurate, my recommendation is to extract and store real-time metadata on who is speaking. Most conferencing platforms visually highlight the current speaker, either through a colored frame around their video or a dynamic microphone icon. You can capture this information directly from the DOM during the call.

Once you have this data, you can align it with the timestamps from the video, cross-referencing who was talking at any given moment. To improve accuracy, I also recommend using traditional speaker diarization systems to resolve edge cases, such as two people talking simultaneously. This combined approach offers a more robust solution for identifying speakers reliably.
### Where to go from here

Once the transcription is ready, you can pass it through an AI model like ChatGPT to summarize the conversation or extract action items. A nice touch that users love is sending them a summary email right after the call with all the key points.