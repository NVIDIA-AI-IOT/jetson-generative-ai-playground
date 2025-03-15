![](../images/jetson-ai-lab_models_0314.png){ width="40%"  align=right .shadow}

# AI Microservices - Introduction

*Building AI-powered applications at the edge has never been easier!*

Jetson AI Lab now offers a collection of pre-built containers, each functioning as a **local AI microservice**, designed to bring flexibility, efficiency, and scalability to your projects.

A **microservice** is a small, independent, and loosely coupled software component that performs a specific function.<br>
In the [**Models**](../models.html) section of Jetson AI Lab, you'll find AI inference services accessible through a standardized REST API.

These local AI microservices are powerful building blocks that enable you to create cutting-edge edge AI applications with ease.
Whether you're working on robotics, vision, or intelligent automation, you now have the tools to accelerate innovation.

Let’s build something amazing together! 💡✨

## Catalog

!!! info

    Currently, following models and Web UIs are listed.

    ![alt text](../images/jal_models_overview_0314.png)

## Launch the Microservice Server

### Walk-through video

<video controls>
  <source src="https://github.com/user-attachments/assets/585a6cc0-f434-4b87-87ad-bd8f12ad01aa" type="video/mp4">
  Your browser does not support the video tag.
</video>

### Steps

1. Go to [**Models**](../models.html) section of Jetson AI Lab
2. Click the model of your interest (specifically, the small green box representing different Orin modules) to open the model card
3. Check the parameter, change as needed, and click on the **:octicons-copy-16: ("Copy to clipboard")** icon in the code snippet under the "**Docker Run**" section
4. Paste the `docker run` command in Jetson terminal and execute
5. Once you see a line like the following (for the case of MLC based service), the server is up and ready

    ``` { .yaml .no-copy }
    INFO:     Uvicorn running on http://0.0.0.0:9000 (Press CTRL+C to quit)
    ```

## API Endpoints

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET`  | `/v1/models` | Get a list of models available |
| `POST` | `/v1/chat/completions` | Get a response from the model using a prompt |

## Example Use of LLM Microservices with Curl

### `/v1/models`

=== ":material-list-box: Step-by-step Instruction"

    1. Execute the following on a Jetson terminal

        ```bash
        curl http://0.0.0.0:9000/v1/models
        ```

    2. Check the output. It should show something like the following.

        ``` { .json .no-copy }
        {
        "object": "list",
            "data": [
                {
                "id": "DeepSeek-R1-Distill-Qwen-1.5B-q4f16_ft-MLC",
                "created": 1741991907,
                "object": "model",
                "owned_by": "MLC-LLM"
                }
            ]
        }
        ```

    !!! note

        For the `/v1/models` endpoint usage, you can reference the OpenAI doc page like [this](https://platform.openai.com/docs/api-reference/models).

        > `get https://api.openai.com/v1/models`

        Note that you need to substitute the base URL (`https://api.openai.com/` with `http://0.0.0.0:9000`), and you don't need to provide the authorization field.

=== ":octicons-video-16: Walk-through video"

    <video controls>
    <source src="https://github.com/user-attachments/assets/ee160d65-dad5-4eb1-8341-e178cfc53c78" type="video/mp4">
    Your browser does not support the video tag.
    </video>

### `/v1/chat/completions`

=== ":material-list-box: Step-by-step Instruction"

    1. Execute the following on a Jetson terminal

        ```bash
        curl http://0.0.0.0:9000/v1/chat/completions \
        -H "Content-Type: application/json" \
        -d '{
            "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": "Hello!"
            }
            ],
        }'
        ```

    2. Check the output. It should show something like the following.

        ``` { .json .no-copy }
        {
        "id": "chatcmpl-9439e77a205a4ef3bc2d050a73a6e30b",
        "choices": [
            {
            "finish_reason": "stop",
            "index": 0,
            "message": {
                "content": "<think>\nAlright, the user greeted me with \"Hello!\" and then added \"hi\". I should respond politely and clearly. I want to make sure they feel comfortable and open to any further conversation.\n\nI'll start with a friendly greeting, maybe \"Hello!\" or \"Hi there?\" to keep it consistent. Then, I'll ask how I can assist them, which is important to build trust. I should mention that I'm here to help with any questions, comments, or suggestions they might have.\n\nI also want to invite them to ask anything, so I'll make sure to keep the door open for future interaction. I'll keep the tone friendly and supportive, avoiding any abrupt requests.\n\nSo, putting it all together, I'll have a clear and concise response that's helpful and inviting.\n</think>\n\nHello! I'm here to help with any questions, comments, or suggestions you have. Keep asking anything you like, and I'll do my best to assist!",
                "role": "assistant",
                "name": null,
                "tool_calls": null,
                "tool_call_id": null
            },
            "logprobs": null
            }
        ],
        "created": 1741993253,
        "model": null,
        "system_fingerprint": "",
        "object": "chat.completion",
        "usage": {
            "prompt_tokens": 11,
            "completion_tokens": 196,
            "total_tokens": 207,
            "extra": null
        }
        }
        ```

=== ":octicons-video-16: Walk-through video"

    <video controls>
    <source src="https://github.com/user-attachments/assets/d0d64ffb-2147-4e8b-a887-8d89ef091ee1" type="video/mp4">
    Your browser does not support the video tag.
    </video>

## Example Use of LLM Microservices with Open WebUI

=== ":material-list-box: Step-by-step Instruction"

    1. Go to [**Models**](../models.html) section of Jetson AI Lab
    2. Go to **Web UI** section, and click "**Open WebUI**" card
    3. Check the parameter, change as needed, and click on the **:octicons-copy-16: ("Copy to clipboard")** icon in the code snippet under the "**Docker Run**" section
        - Note the "**Server IP / Port**" section. The default is `0.0.0.0:8080`.
    4. Paste the `docker run` command in Jetson terminal and execute

        ```bash
        docker run -it --rm \
            --name open-webui \
            --network=host \
            -e PORT=8080 \
            -e ENABLE_OPENAI_API=True \
            -e ENABLE_OLLAMA_API=False \
            -e OPENAI_API_BASE_URL=http://0.0.0.0:9000/v1 \
            -e OPENAI_API_KEY=foo \
            -e AUDIO_STT_ENGINE=openai \
            -e AUDIO_TTS_ENGINE=openai \
            -e AUDIO_STT_OPENAI_API_BASE_URL=http://0.0.0.0:8990/v1 \
            -e AUDIO_TTS_OPENAI_API_BASE_URL=http://0.0.0.0:8995/v1 \
            -v /mnt/nvme/cache/open-webui:/app/backend/data \
            -e DOCKER_PULL=always --pull always \
            -e HF_HUB_CACHE=/root/.cache/huggingface \
            -v /mnt/nvme/cache:/root/.cache \
            ghcr.io/open-webui/open-webui:main
        ```
    5. Once you see a line like the following, the Open WebUI server should be ready

        ``` { .json .no-copy }
        INFO:     Started server process [1]
        INFO:     Waiting for application startup.
        ```

    6. On a web browser on a PC (that is on the same network as Jetson), access  `http://<JETSON_IP>:8080/`
    7. Sign in (if you have not, create an account first).
        - For the detail, read this note from our [Open WebUI tutorial](../tutorial_openwebui.md#step-2-complete-the-account-creation-process).
    8. Check the selected model
    9. Type your query in the chat box and check the response.

    !!! tip

        You can check out the walk-through video (in the [next tab](#__tabbed_3_2)) for details.

=== ":octicons-video-16: Walk-through video"

    <video controls>
    <source src="https://github.com/user-attachments/assets/1166a26c-e8db-4952-9a99-b1802b5d39e4" type="video/mp4">
    Your browser does not support the video tag.
    </video>