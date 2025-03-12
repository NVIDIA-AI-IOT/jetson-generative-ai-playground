/*
 * Generate 'docker run' and docker-compose templates for launching models & containers
 */

Resolvers({
  container: {
    name: "Docker Container",
    tags: [],
    docker_options: null,
    docker_image: null,
    docker_cmd: null,
    docker_run: null,
    auto_update: null,
    cache_dir: null,
    CUDA_VISIBLE_DEVICES: "all"
  },

  docker_image: {
    tags: "string",
    help: [
      "Specify the container image to run and launch the server.\n",
      "On Jetson, pick a tag that is compatible with your version of JetPack.\n",
      "For example, L4T r36.4.0 images are compatible with JetPack 6.1 and 6.2.\n",
      "These are built from jetson-containers with CUDA and are on DockerHub."
    ]
  },

  docker_cmd: {
    name: "Docker Entrypoint",
    tags: "string",
    help: [
      "Override the default docker entrypoint command and its arguments that get executed when the container starts.",
    ]
  },

  docker_profile: {
    tags: ["string"]
  },

  auto_update: {
    tags: "string",
    options: ["on", "off"],
    help: "When set to 'on', will automatically pull the latest container on start-up."
  },

  cache_dir: {
    tags: "path",
    value: "/mnt/nvme/cache",
    help: [
      "Path on the server's native filesystem that will be mounted into the container\n",
      "for saving the models.\nIt is recommended this be relocated to NVME storage."
    ]
  },

  web_host: {
    name: "Webserver IP / Port",
    tags: "string",
    help: [
      "This is the hostname/IP and port of the frontend webserver that browsers would navigate to."
    ]
  },

  server_host: {
    name: "Server IP / Port",
    tags: "string",
    help: [
      "The server's hostname/IP and port that it is listening on for incoming requests.\n",
      "0.0.0.0 will listen on all network interfaces (127.0.0.1 from localhost only)\n",
      "This IP address also gets populated in the examples, so set it to your device."
    ]
  },

  server_llm: {
    name: "LLM Server URL",
    tags: "string",
    help: [
      "The LLM server's hostname/IP and port (commonly OPENAI_API_BASE_URL)\n",
      "The server implements the chat.completion endpoint for LLMs.\n",
    ]
  },

  server_asr: {
    name: "ASR Server URL",
    tags: "string",
    help: [
      "The speech-to-text server's hostname/IP and port\n",
      "The server implements the audio.transcriptions endpoint for ASR/STT.\n",
    ]
  },

  server_tts: {
    name: "TTS Server URL",
    tags: "string",
    help: [
      "The text-to-speech server's hostname/IP and port\n",
      "The server implements the audio.transcriptions endpoint for TTS.\n",
    ]
  }
});