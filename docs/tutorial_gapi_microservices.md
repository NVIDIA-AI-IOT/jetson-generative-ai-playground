# Tutorial - Gapi Micro Services

A Micro Service is a process that runs a wrapper python script that integrates your custom code/models so they can integrate into Gapi Workflows.

<img src="https://GenAINerds.com/assets/img/MicroServices2.png"></img>

You can run a Micro Service wherever you like and connect it to a Gapi Server via the streaming, hybrid binary+json message protocol.

<img src="https://genainerds.com/assets/img/GapiDiagram3.png"></img>

There are some out-of-the-box “Community Micro Services" that we integrate, test and pack into Docker images.
When you run them, they auto integrate, load NVIDIA layers correctly and offer logging to the host system.

<img src="https://GenAINerds.com/assets/img/MicroServices3.png"></img>

Even better, create your own!
Just implement an **on_message** Python handler to process requests and respond. The rest is handled for you.

<img src="https://GenAINerds.com/assets/img/MicroServices4.png"></img>

Think of a Micro Service as a simple wrapper to some code or model you have.
It works the same as any other Node inside a Workflow. When it's your Micro Service Node's turn your **on_message** function will be called.
Your script gets the rolling Transaction data for context and you then publish your data directly back into the flow.

<img src="https://GenAINerds.com/assets/img/MicroServices1.png"></img>

## **Running the Community Micro Services**
 
!!! abstract "Requirements for Community Micro Services"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (16GB)</span>
        <span class="blobLightGreen3">Jetson Orin Nano (8GB)</span>
        <span class="blobLightGreen3">Jetson Orin Nano (4GB)</span>
	   
    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack){:target="_blank"}:

        <span class="blobPink1">JetPack 5 (L4T r35.x)</span>
        <span class="blobPink2">JetPack 6 (L4T r36.x)</span>

    3. Sufficient storage space.
        - Literally 4KB for your own Micro Service
        - Anywhere from ~4GB to ~10GB for each Community Micro Service
		 
```
#1 Login and go to the Micro Services tab
#2 Follow the instructions in the blue box on that page to download your custom configuration
#3 Then follow the instructions below that for installing the Micro Service you want
```

Example of instruction page: 

<img src="https://GenAINerds.com/assets/img/MicroServices5.png"></img>

## **Congrats! You Can Go Through the Workflow Tips Now**

<img src="https://genainerds.com/assets/img/WorkflowsHome.png"></img>

## **Creating Your Own Micro Service**

The entire Micro Service zip file is just 4KB with 4 files:

* message_handler.py: for you to respond
* message.py: for the streaming binary/json protocol
* gapi-ms: as entry point and handler)
* requirements.txt: defines just asyncio + websockets

Full documentation here: [Gapi Micro Service Docs](https://genainerds.com/#/Docs/14){:target="_blank"}. Synopsis below...

```
#1 Create logical Micro Service in UI and copy the key
#2 Download the zip file from the UI
#3 python gapi-ms.py ws://0.0.0.0:8090/gapi-ws [MICROSERVICE_KEY]
#4 Refresh the UI to confirm it's online
#5 Edit the message_handler.py to handle binary+json input and change the output
#6 Add a Micro Service Node to a Workflow and tie it to your Micro Service. Hit Test.
```




