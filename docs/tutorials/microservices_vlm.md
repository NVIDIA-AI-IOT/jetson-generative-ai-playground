# Local VLM Microservices

Local VLM (Vision Language Model) microservices can unlock a **new class of applications** for VLMs at the edge, as it can enable capabilities and performance that cloud-hosted VLMs cannot achieve, especially when integrated with **local live video sources**.

In this module, we

1. first look at the example of local VML microservices and its applications, and then
1. experiment with the **"Augmented" VLM Microservice** that enables the efficient local video source ingestion and explore the applications

## 1. Local VLM Microservices

### Gemma-3-4b on Ollama

Google [launched Gemma 3 in March 2025](https://developers.googleblog.com/en/introducing-gemma3/), introducing multimodal support for models with over 4 billion parameters, enabling vision input alongside text processing.

Let's run the 4B model using Ollama.

=== "Ollama Docker Container"

    ```bash
    docker run -it --rm \
    --gpus all --network=host \
    -e OLLAMA_HOST="0.0.0.0:9000" \
    -e OLLAMA_MODEL=gemma3:4b \
    -e OLLAMA_CONTEXT_LENGTH=4096 \
    -e OLLAMA_LOGS=/root/.ollama/ollama.log \
    -v /mnt/nvme/cache:/root/.cache \
    -v /mnt/nvme/cache/ollama:/root/.ollama \
    dustynv/ollama:main-r36.4.0
    ```

=== "Ollama natively installed"

    !!! note

        This assumes you have installed `ollama` natively on your Jetson, as shown in this [tutorial section](../tutorial_ollama.html#1-native-install).

    ```bash
    ollama run gemma3:4b
    ```

### LLM - Text-only

#### Curl Request with Text-only

You can reuse the curl command we used in the [earlier tutorial](./microservices_intro.md).

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
    ]
}'
```

You will see a response something like this.

``` { .json .no-copy }
{
"id": "chatcmpl-44f2b0d94e0e444e9fcdacfbe38728fc",
"object": "chat.completion",
"created": 1742065798,
"model": "google/gemma-3-4b-it",
"choices": [
    {
    "index": 0,
    "message": {
        "role": "assistant",
        "reasoning_content": null,
        "content": "Hello there! How can I help you today? 😊 \n\nDo you need me to:\n\n*   Answer a question?\n*   Brainstorm ideas?\n*   Write something?\n*   Just chat?\n\nLet me know what's on your mind!",
        "tool_calls": []
    },
    "logprobs": null,
    "finish_reason": "stop",
    "stop_reason": 106
    }
],
"usage": {
    "prompt_tokens": 18,
    "total_tokens": 75,
    "completion_tokens": 57,
    "prompt_tokens_details": null
},
"prompt_logprobs": null
}
```

### VLM - With Image

#### The "Vision API"

[OpenAI API Doc](https://platform.openai.com/docs/guides/images) shows how to use the vision capabilities through their API. This works with Ollama as well.

You make the request to the same `/v1/chat/completions` endpoint, but provides extra image information, either by putting a URL for an image file or by providing an image as a Base64-encoded data.

![](../images/openai_api_docs_image-and-vision.png){ .shadow }

#### Curl Request with Image

You can test the `curl` commands in both styles against Ollama server.

You will see the response that shows that it processed the passed or encoded image.

=== "Passing a URL"

    ```bash
    curl --location --request POST http://0.0.0.0:9000/v1/chat/completions \
    --header "Content-Type: application/json" \
    --data '{
        "messages": [
        {
            "role": "user",
            "content": [
            {
                "type": "text",
                "text": "What is in this image?"
            },
            {
                "type": "image_url",
                "image_url": {
                    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
                }
            }
            ]
        }
        ],
        "max_tokens": 300
    }'
    ```

    ??? abstract "Example response"

        ``` {.json .no-copy}
        {
        "id": "chatcmpl-7055ee78ebd64a7895bdf9a5e22e495e",
        "object": "chat.completion",
        "created": 1742067887,
        "model": "google/gemma-3-4b-it",
        "choices": [
            {
            "index": 0,
            "message": {
                "role": "assistant",
                "reasoning_content": null,
                "content": "Here's a breakdown of what's in the image:\n\n*   **Wooden boardwalk:** A long, wooden walkway stretches into the image, leading into the grassy field.\n*   **Tall grass and reeds:** The foreground is dominated by very tall, green grass and reeds, creating a lush, natural environment.\n*   **Field/Wetland:** The boardwalk leads into a wide field, which appears to be a wetland or marsh area.\n*   **Trees and shrubs:** A line of trees and shrubs forms the distant horizon.\n*   **Sky:** A vibrant blue sky filled with fluffy white clouds.\n\nOverall, it’s a beautiful landscape shot of a serene wetland area, likely a nature preserve or park, with a boardwalk providing access to the area.",
                "tool_calls": []
            },
            "logprobs": null,
            "finish_reason": "stop",
            "stop_reason": 106
            }
        ],
        "usage": {
            "prompt_tokens": 275,
            "total_tokens": 435,
            "completion_tokens": 160,
            "prompt_tokens_details": null
        },
        "prompt_logprobs": null
        }
        ```

=== "Passing a Base64 encoded image"

    ```bash
    curl --location --request POST 'http://0.0.0.0:9000/v1/chat/completions' \
    --header 'Content-Type: application/json' \
    --data '{
        "messages": [
        {
            "role": "user",
            "content": [
            {
                "type": "text",
                "text": "Describe this icon."
            },
            {
                "type": "image_url",
                "image_url": {
                    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAYNJREFUOE9j3CEjU/efkbGakYGBjYEE8J+B4Rfj//+tjNtlZX+SqhlmD9iQHbKy/2EC3CoqDNxKSnB3fL5xg4GZi4uBS04OLvbxwgWGn69ewfkoBvBqazMYzJjBwCUvD1ZwKjQUrFmntxfM/3DuHMPF7GyGH0+fYjcAJGq+YQODgJERw59Pnxj2GRgwsAkKMtifOcPAyMjI8Gz9eobL+fkoIYXiAmQDXm7bxnAhIwOs2HLrVgY+XV3SDLhSWsrwdOVKsAEqJSUMynl5pBnw9vhxsDdAgF1cnEHAwIB4A5jY2BiOe3khAoqZmcHx3DmG1wcOEBcG744eZbjd3Y0SWHpTpjD8//uXOANutrQwfDhzBsUAqeBgBmE7O8IGGC1cyHA+KQlsGzJgExFhUK+pYbhcUIA7GkWdnBikwsIYHi1YwPD+xAkUhYLm5gzyiYkMT1evZni9dy/2hCRsY8PAwsfH8PPlS4YPZ8+iGMBvZMTAISHB8OfzZ4a3hw8jDKA8M1GYnQE8m7INTv0HFQAAAABJRU5ErkJggg=="
                }
            }
            ]
        }
        ],
        "max_tokens": 128
    }'
    ```

    ??? abstract "Example response"

        ``` {.json .no-copy}
        {
        "id": "chatcmpl-76126099d5ea4560b32ddc74a307a210",
        "object": "chat.completion",
        "created": 1742068087,
        "model": "google/gemma-3-4b-it",
        "choices": [
            {
            "index": 0,
            "message": {
                "role": "assistant",
                "reasoning_content": null,
                "content": "Okay, here’s a description of the icon:\n\nIt’s a stylized white \"H\" on a solid red background. The \"H\" appears to have a slight glow or halo effect around it, and it’s somewhat blurred or hazy, giving it a soft, diffused look. \n\nBased on this, it’s most likely the icon for **HBO** (Home Box Office), the television network.",
                "tool_calls": []
            },
            "logprobs": null,
            "finish_reason": "stop",
            "stop_reason": 106
            }
        ],
        "usage": {
            "prompt_tokens": 281,
            "total_tokens": 368,
            "completion_tokens": 87,
            "prompt_tokens_details": null
        },
        "prompt_logprobs": null
        }
        ```

#### Python Examples

As demonstrated on the [OpenAI Doc page](https://platform.openai.com/docs/guides/images?api-mode=chat&lang=python&format=url), you can do the same with Python scripts.

!!! note

    Make sure you have installed `openai` Python library.

    ```bash
    pip install openai
    ```

=== "Passing a URL"

    ```python
    from openai import OpenAI
    client = OpenAI(
        base_url = os.environ.get('OPENAI_BASE_URL', 'http://0.0.0.0:9000/v1'),
        api_key = 'foo',
    )

    response = client.chat.completions.create(
        model="google/gemma-3-4b-it",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": "What's in this image?"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
                    },
                },
            ],
        }],
    )

    print(response.choices[0].message.content)
    ```

=== "Passing a Base64 encoded image"

    ```python
    import os, requests, base64
    from openai import OpenAI

    client = OpenAI(
        base_url = os.environ.get('OPENAI_BASE_URL', 'http://0.0.0.0:9000/v1'),
        api_key = 'foo',
    )

    # Function to encode the image
    def encode_image(url, toBase64=True):
        """ Download + convert to base64, or pass through as image_url """
        if not toBase64:
            return url
        response = requests.get(url)
        if response.status_code != 200:
            raise ValueError(f"Failed to fetch image: {url} (HTTP {response.status_code})")

        content_type = response.headers.get('Content-Type', 'image/jpeg')  # Default to JPEG
        return f"data:{content_type};base64,{base64.b64encode(response.content).decode()}"

    # Path to your image
    image_base_url = 'https://raw.githubusercontent.com/dusty-nv/jetson-containers/refs/heads/dev/data/images/hoover.jpg'

    # Getting the Base64 string
    base64_image = encode_image(image_base_url)

    completion = client.chat.completions.create(
        model="google/gemma-3-4b-it",
        messages=[{
            "role": "user",
            "content": [
                { "type": "text", "text": "what's in this image?" },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": base64_image,
                    },
                },
            ],
        }],
    )

    print(completion.choices[0].message.content)
    ```

### VLM usage in frameworks

#### Open WebUI

Let's take a look at how this VLM capability can be used in Open WebUI

1. As shown in the [earlier tutorial](microservices_intro.md#example-with-open-webui), launch the Open WebUI server.

    ??? abstract "`docker run` command to start Open WebUI server"

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

2. On a web browser on a PC (that is on the same network as Jetson), access  `http://<JETSON_IP>:8080/`

3. Go through the sign-in process

4. In the chat box, click on :octicons-plus-16:(plus) icon and select "**:material-file-upload-outline: Upload Files**", and attach a local image.

5. Supply a text query (e.g. "Describe this image.") and hit "**:material-arrow-up-circle:(Send message)**" button.

    ![](../images/openwebui_query-with-image.png){ .shadow }

6. Check the response.

    ![](../images/openwebui_vlm_moon.gif){ .shadow }

7. Check the log on terminal running Ollama

    You may find information like following.

    ```text
    INFO 03-15 20:57:25 [logger.py:39] Received request chatcmpl-ffb41435ad4a4bb990b48ecc341850a9: prompt: '<bos><start_of_turn>user\n### Task:\nGenerate 1-3 broad tags categorizing the main themes of the chat history, along with 1-3 more specific subtopic tags.\n\n### Guidelines:\n- Start with high-level domains (e.g. Science, Technology, Philosophy, Arts, Politics, Business, Health, Sports, Entertainment, Education)\n- Consider including relevant subfields/subdomains if they are strongly represented throughout the conversation\n- If content is too short (less than 3 messages) or too diverse, use only ["General"]\n- Use the chat\'s primary language; default to English if multilingual\n- Prioritize accuracy over specificity\n\n### Output:\nJSON format: { "tags": ["tag1", "tag2", "tag3"] }\n\n### Chat History:\n<chat_history>\nUSER: Describe the photo.\nASSISTANT: Here\'s a description of the photo:\n\nThe photo showcases a large, full moon dominating the frame. It is a vibrant, creamy white color, with prominent and detailed dark grey and brown craters, maria (smooth, dark plains formed by ancient lava flows), and highlands visible across its surface. \n\nThe background is a solid, dark black, which makes the moon stand out dramatically and emphasizes its round shape.  It appears to be a close-up shot, giving a clear and detailed view of the lunar surface.\n</chat_history><end_of_turn>\n<start_of_turn>model\n', params: SamplingParams(n=1, presence_penalty=0.0, frequency_penalty=0.0, repetition_penalty=1.0, temperature=1.0, top_p=1.0, top_k=-1, min_p=0.0, seed=None, stop=[], stop_token_ids=[], bad_words=[], include_stop_str_in_output=False, ignore_eos=False, max_tokens=7890, min_tokens=0, logprobs=None, prompt_logprobs=None, skip_special_tokens=True, spaces_between_special_tokens=True, truncate_prompt_tokens=None, guided_decoding=None, extra_args=None), prompt_token_ids: None, lora_request: None, prompt_adapter_request: None.
    INFO 03-15 20:57:25 [engine.py:289] Added request chatcmpl-ffb41435ad4a4bb990b48ecc341850a9.
    INFO:     172.17.0.1:42452 - "POST /v1/chat/completions HTTP/1.1" 200 OK
    INFO 03-15 20:57:36 [metrics.py:481] Avg prompt throughput: 48.7 tokens/s, Avg generation throughput: 4.1 tokens/s, Running: 0 reqs, Swapped: 0 reqs, Pending: 0 reqs, GPU KV cache usage: 0.0%, CPU KV cache usage: 0.0%.
    INFO 03-15 20:57:46 [metrics.py:481] Avg prompt throughput: 0.0 tokens/s, Avg generation throughput: 0.0 tokens/s, Running: 0 reqs, Swapped: 0 reqs, Pending: 0 reqs, GPU KV cache usage: 0.0%, CPU KV cache usage: 0.0%.
    ```

#### n8n

1. Start n8n server container

    === ":material-list-box: Step-by-step Instruction"

        1. Go to [**Models**](../models.html) section of Jetson AI Lab
        2. Go to **Web UI** section, and click "**n8n**" card
        3. Check the parameter, change as needed, and click on the **:octicons-copy-16: ("Copy to clipboard")** icon in the code snippet under the "**Docker Run**" section
            - Note the "**Server IP / Port**" section. The default is **`0.0.0.0:5678`**.
        4. Paste the `docker run` command in Jetson terminal and execute

            ```bash
            docker run -it --rm --name=n8n \
                --network=host \
                -e N8N_LISTEN_ADDRESS=0.0.0.0 \
                -e N8N_PORT=5678 \
                -e N8N_SECURE_COOKIE=false \
                -v /mnt/nvme/cache/n8n:/root/node/.n8n \
                -e DOCKER_PULL=always --pull always \
                -e HF_HUB_CACHE=/root/.cache/huggingface \
                -v /mnt/nvme/cache:/root/.cache \
                n8nio/n8n:stable
            ```

    === ":octicons-video-16: Walk-through video"

        <video controls>
        <source src="https://github.com/user-attachments/assets/901a2fde-4376-42af-a829-752e7c207659" type="video/mp4">
        Your browser does not support the video tag.
        </video>

2. First create a "Credential" to configure the connection to the local Ollama server.

    === ":material-list-box: Step-by-step Instruction"

        1. On the n8n top screen, click on "**:octicons-plus-16:**" button on the left, and select "**Credential**".
        2. In the "**Add new credential**" prompt box, in the "**:octicons-search-16:Search for app...**" field, type "openai" and select "OpenAi". Hit "**Continue**" button.
        3. In the "**OpenAi account**" prompt box, put the followings;

            | Field | Value |
            | ----- | ----- |
            | API Key | `foo` (or whatever random) |
            | Organization ID | ` ` (leave it blank) |
            | Base URL | `http://0.0.0.0:9000/v1` |

        4. Once done, hit "**Save**" button. Check you get "**:material-check-circle: Connection tested successfully**" message.

            ![](../images/n8n_OpenAi-account_configured.png){ .shadow }

        5. Put your mouse cursor over the text "OpenAi account" at the top of the prompt box
        6. "**:material-pencil: (Edit)**" icon shows up, so click on it to edit, and name is something like "**Local Ollama**".
        7. Click :octicons-x-16: icon on the top left corner of the prompt box to close

            ![](../images/n8n_credential_added.png){ .shadow }

    === ":octicons-video-16: Walk-through video"

        <video controls>
        <source src="https://github.com/user-attachments/assets/ef53a91c-1985-4622-95ac-0c6e8055a727" type="video/mp4">
        Your browser does not support the video tag.
        </video>

3. Then create a "**Workflow**" to use the "OpenAI Analyze Image" node to use gemma-3-4b model hosted on Ollama

    === ":material-list-box: Step-by-step Instruction"

        1. On the n8n top screen, click on "**:octicons-plus-16:**" button on the left, and select "**Workflow**".
        2. Click on "**Add first step...**" button in the center
        3. In the right side pane that shows up, in the field "**:octicons-search-16:Search for app...**" field, type "openai" and select "OpenAI", the first item.
        4. Under the "**Actions (15)**" section, under "**IMAGE ACTION**" category, find and select "**Analyze Image**"
        5. In the "**OpenAi account**" prompt box, under the "**Parameters**" tab, put the followings;

            | Field | Value | Note |
            | ----- | ----- | ---- |
            | Credential to connect with | "**Local Ollama**" | (or whatever credential you created and named) |
            | Resource | Image | (default) |
            | Operation | Analyze Image | (default) |
            | Model | **`google/gemma-3-4b-it`** | (Ollama cares this field, so you need to supply the correct name of the model)|
            | Text Input | "What's in this image" | (default) |
            | Input Type | Image URL(s) | (default) |
            | URL | https://raw.githubusercontent.com/dusty-nv/jetson-containers/refs/heads/dev/data/images/hoover.jpg | |

        6. Click "Tst step" button the top right of the prompt box, and check the output shown on the right.

            ![](../images/n8n_analyze-image_test-step.png)

    === ":octicons-video-16: Walk-through video"

        <video controls>
        <source src="https://github.com/user-attachments/assets/8dcf3e0b-279f-45be-b20b-5cdaf02d4a9f" type="video/mp4">
        Your browser does not support the video tag.
        </video>

## 2. Augmented VLM Microservice