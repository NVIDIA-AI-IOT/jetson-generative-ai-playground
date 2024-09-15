# Tutorial - Gapi

[Gapi](https://GenAINerds.com/#/Gapi){:target="_blank"} is an embeddable API gateway that creates streaming integrations between
AI micro services and the systems that users leverage everyday.

!!! admonition "The project's goal is to accelerate the speed of creating pilots and demos of Jetson AI Lab achievements into real world environments"

"On Device" generative AI doesn't mean it has to live on an island!

<img src="https://genainerds.com/assets/img/GapiGIF.gif"></img>

* Workflow engine with low code UI with dozens of open integrations and customizable clients for mobile web and desktop.
* Micro service framework for wrapping Jetson containers (Ollama, Whisper, Piper TTS, etc. are done, with more coming).
Or wrap your own models/code and integrate it into Workflows.
* Real-time, hybrid, binary+json messaging smoothens intra-service calls and reduced latency. 
* A fast path to proving generative AI value to stakeholders in their actual environment.

## **Gapi Server**
Embeddable API gateway software that runs in the background with a low code workflow UI for testing.
The server is a message hub and state machine for workflow 'nodes' that talk to Micro Services.
Think of it as connective-tissue for applications.

<img src="https://genainerds.com/assets/img/GapiDiagram3.png"></img>

!!! admonition "A Micro Service is a process that runs some wrapper python scripts that integrates custom code/models into Workflows using a streaming API."

* Gapi Server can run on any Jetson Orin or really any computer as the Micro Services connect outbound over secure web sockets. It
doesn't use any GPU resources. There is a also a little demo version to skip the Server install
(but you'll still need to run your own Micro Services).

* **[Gapi Project Page](https://GenAINerds.com/#/Gapi){:target="_blank"}**
* **[Gapi Github](https://github.com/GenAI-Nerds/Gapi/){:target="_blank"}**
* **[Gapi Docs](https://genainerds.com/#/Docs){:target="_blank"}**
* **[Gapi Hosted Demo](https://GenAIGapi.com){:target="_blank"}**

!!! abstract "What you need to run Gapi Server on Jetson"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (16GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (8GB)</span>
        <span class="blobLightGreen3">Jetson Orin Nano (8GB)</span>
        <span class="blobLightGreen3">Jetson Orin Nano (4GB)</span>

    2. Docker

    3. Sufficient storage space.
        - Size: ~1.3GB

!!! admonition "Gapi Server will run on other environments. Email us at support@GenAINerds.com if that's something you think is worthwhile."

Explaining the Steps:

- 1) On the Docker host, create working dir for persistant data
- 2) Download configuration files
- 3) Unzip
- 4) Pull Docker image, create container and start the process (will return console to you)

Copy and Run the Steps:

```
mkdir ~/gapiData && cd ~/gapiData
curl -L https://raw.githubusercontent.com/genai-nerds/Gapi/main/gapiConfigs.zip -o gapiConfigs.zip
unzip -q gapiConfigs.zip
docker run -d --name gapi --network host -v ~/gapiData:/opt/gapi/vdata genainerds/gapi:arm64 /bin/bash -c "cd /opt/gapi/bin && ./startGapi.sh"
echo "You may need to hit Enter now. Afterwards the Docker container 'gapi' should be running"
```

Troubleshooting:

- Keep in mind all data read or written is in ~/gapiData
- Look at ~/gapiData/gapi.log to see what happened (if say the docker run command doesn't work)
- gapiServerConfig.json has all the initial setup

!!!admonition "NOTE: You will need to run some Micro Services before doing anything meaningful, so please review the mini tour below but don't do any of it in the UI untill you complete the setup (instructions at the bottom)"

## **UI**
<img src="https://genainerds.com/assets/img/gapi-hero.png"></img>

* Browse in: http://[host-device-ip]:8090
* User: root
* Pass: !gapi2024

* Change password in Settings! Docs shows how to add SSL cert.

## **Tips & Use Case Templates**
<img src="https://genainerds.com/assets/img/WorkflowsHome.png"></img>
When you login there will be an array of Tip Workflows that have notes and explain core concepts.

**Tips:**

* Hello World: Basics plus it literally says hello
* Run a Local LLM: Play with Ollama graphically and connect it to other systems
* Streaming Speech to Text: PiperTTS
* Querying a Vector Database: Query a simple set of vectorized text documents
* Variables, Flow and Logic: Understand how to setup more robust workflows
* Calling Workflows from Outside Gapi: Configure Webhooks
* Workflows Calling Your Code: Micro Service Nodes that invoke your code
* Communications: 3rd party communications like Slack (IM), Twilio (SMS), SendGrid (EMAIL)

## **Workflows**

Workflows visually connect the execution and flow of data between Nodes.
<img src="https://genainerds.com/assets/img/gapi-diagram-pic.png"></img>

A Transaction (or single firing) has "Rolling Input" data it accumulates as Node to Node steps each talk to Micro Services and APIs.
All Nodes enjoy variables and flow control using familiar json and javascript concepts.

<img src="https://genainerds.com/assets/img/switchproperties.png"></img>

Each Node can append or reference the rolling data in the Transaction while making decisions along the way.

<img src="https://genainerds.com/assets/img/visualfeedback.png"></img>

Watch live Transactions as they start from clients, webhooks and published messages from Micro Services with visual feedback and debugging.

## **APIs to Business Systems**

Gapi can help smoothly integrate generative AI into systems that people already use everyday via APIs.
It has the streaming API to Micro Services plus the state management and chops to handle the outward (webhook) style APIs to existing
systems.

!!!admonition "Our hope is to rally contributions by the community to keep growing the out-of-the-box/tested Nodes but there is a DIY one as well to manually map what you need into your Workflows."

Some of the out-of-the-box API Nodes: Slack (IM), Twilio (SMS), SendGrid (Email), Service Now (Ticketing), DIY Webhook

## **Micro Services**

There are community published Micro Services as well as custom ones you can make yourself.
Gapi Server becomes most useful when leveraging them so please follow the How To below.

**Current Community Micro Services:**

* Whisper
* Ollama
* Vector
* Text to Speech
* Img to Text

!!! admonition "Complete the Setup: [How To Run and/or Create Micro Services](./tutorial_gapi_microservices.md)"

## **Support / Contribute**

Gapi is a project from the [GenAI Nerds](https://GenAINerds.com) and hosted on [Github](https://github.com/GenAI-Nerds/Gapi/){:target="_blank"}.

* Ask a question, support@GenAINerds.com or
* Say hello, hello@GenAINerds.com
* Contribute/create tickets on [Github](https://github.com/GenAI-Nerds/Gapi/){:target="_blank"}

