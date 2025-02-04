/*
 * Generate 'docker run' and docker-compose templates for launching models & containers
 */

Resolvers({
  docker_image: {
    tags: "string",
    help: [
      "Specify the container image to run and launch the server.\n",
      "On Jetson, pick a tag that is compatible with your version of JetPack.\n",
      "For example, L4T r36.4.0 images are compatible with JetPack 6.1 and 6.2.\n",
      "These are built from jetson-containers with CUDA and are on DockerHub."
    ]
  },

  auto_update: {
    tags: "string",
    options: ["on", "off"],
    help: "When set to 'on', will automatically pull the latest container on start-up."
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

  cache_dir: {
    tags: "path",
    value: "/mnt/nvme/cache",
    help: [
      "Path on the server's native filesystem that will be mounted into the container\n",
      "for saving the models.\nIt is recommended this be relocated to NVME storage."
    ]
  }
});