---
title: "SSD + Docker Setup"
description: "Set up NVMe SSD storage and configure Docker on your Jetson for optimal performance with AI containers and large models."
category: "Setup"
section: "Environment Setup"
order: 3
tags: ["setup", "jetson", "ssd", "nvme", "docker", "storage", "containers"]
---

Once you have your Jetson set up by flashing the latest Jetson Linux (L4T) BSP on it or by flashing the SD card with the whole JetPack image, before embarking on testing out all the great generative AI applications using `jetson-containers`, you want to make sure you have a huge storage space for all the containers and the models you will download.

This guide shows how you can install SSD on your Jetson and set it up for Docker.

---

## SSD Installation

### Physical Installation

1. **Unplug power** and any peripherals from the Jetson developer kit.

2. **Physically install** an NVMe SSD card on the carrier board of your Jetson developer kit, making sure to properly seat the connector and secure with the screw.

3. **Reconnect** any peripherals, and then reconnect the power supply to turn on the Jetson developer kit.

4. **Verify** that your Jetson identifies a new memory controller on PCI bus:

```bash
lspci
```

The output should show something like:

```
0007:01:00.0 Non-Volatile memory controller: Marvell Technology Group Ltd. Device 1322 (rev 02)
```

---

### Format and Set Up Auto-mount

1. **Find the device name:**

```bash
lsblk
```

The output should look like:

```
NAME         MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
loop0          7:0    0    16M  1 loop
mmcblk1      179:0    0  59.5G  0 disk
├─mmcblk1p1  179:1    0    58G  0 part /
...
nvme0n1      259:0    0 238.5G  0 disk
```

Identify the device corresponding to your SSD. In this case, it is `nvme0n1`.

2. **Format the SSD, create a mount point, and mount it:**

```bash
sudo mkfs.ext4 /dev/nvme0n1
```

> You can choose any name for the mount point directory. We use `/ssd` here, but in `jetson-containers`' documentation, `/mnt` is used.

```bash
sudo mkdir /ssd
sudo mount /dev/nvme0n1 /ssd
```

3. **Set up auto-mount** to ensure the mount persists after boot:

First, identify the UUID for your SSD:

```bash
lsblk -f
```

Then, add a new entry to the `fstab` file:

```bash
sudo vi /etc/fstab
```

Insert the following line, replacing the UUID with the value found from `lsblk -f`:

```
UUID=************-****-****-****-******** /ssd/ ext4 defaults 0 2
```

4. **Change ownership** of the `/ssd` directory:

```bash
sudo chown ${USER}:${USER} /ssd
```

---

## Docker Setup

### Install nvidia-container Package

> **Note:** If you used an NVIDIA-supplied SD card image to flash your SD card, all necessary JetPack components (including `nvidia-containers`) and Docker are already pre-installed, so this step can be skipped.

```bash
sudo apt update
sudo apt install -y nvidia-container
```

**For JetPack 6.x users:**

If you flash Jetson Linux (L4T) R36.x (JetPack 6.x) on your Jetson using SDK Manager, and install `nvidia-container` using `apt`, on JetPack 6.x it no longer automatically installs Docker.

Run the following to manually install Docker and set it up:

```bash
sudo apt update
sudo apt install -y nvidia-container curl
curl https://get.docker.com | sh && sudo systemctl --now enable docker
sudo nvidia-ctk runtime configure --runtime=docker
```

### Configure Docker

1. **Restart Docker service** and add your user to the `docker` group:

```bash
sudo systemctl restart docker
sudo usermod -aG docker $USER
newgrp docker
```

2. **Add default runtime** in `/etc/docker/daemon.json`:

**One-liner method:**

```bash
sudo apt install -y jq
sudo jq '. + {"default-runtime": "nvidia"}' /etc/docker/daemon.json | \
  sudo tee /etc/docker/daemon.json.tmp && \
  sudo mv /etc/docker/daemon.json.tmp /etc/docker/daemon.json
```

**Manual method:**

Edit the file:

```bash
sudo vi /etc/docker/daemon.json
```

Insert the `"default-runtime": "nvidia"` line:

```json
{
    "runtimes": {
        "nvidia": {
            "path": "nvidia-container-runtime",
            "runtimeArgs": []
        }
    },
    "default-runtime": "nvidia"
}
```

3. **Restart Docker:**

```bash
sudo systemctl daemon-reload && sudo systemctl restart docker
```

---

### Migrate Docker Directory to SSD

Now that the SSD is installed and available on your device, you can use the extra storage capacity to hold the storage-demanding Docker directory.

1. **Stop the Docker service:**

```bash
sudo systemctl stop docker
```

2. **Move the existing Docker folder:**

```bash
sudo du -csh /var/lib/docker/ && \
    sudo mkdir /ssd/docker && \
    sudo rsync -axPS /var/lib/docker/ /ssd/docker/ && \
    sudo du -csh  /ssd/docker/
```

3. **Edit `/etc/docker/daemon.json`:**

```bash
sudo vi /etc/docker/daemon.json
```

Add the `"data-root"` line:

```json
{
    "runtimes": {
        "nvidia": {
            "path": "nvidia-container-runtime",
            "runtimeArgs": []
        }
    },
    "default-runtime": "nvidia",
    "data-root": "/ssd/docker"
}
```

4. **Rename the old Docker data directory:**

```bash
sudo mv /var/lib/docker /var/lib/docker.old
```

5. **Restart the docker daemon:**

```bash
sudo systemctl daemon-reload && \
    sudo systemctl restart docker && \
    sudo journalctl -u docker
```

---

### Test Docker on SSD

1. **[Terminal 1]** Open a terminal to monitor disk usage:

```bash
watch -n1 df
```

2. **[Terminal 2]** Open a new terminal and start Docker pull:

```bash
docker pull ubuntu:22.04
```

3. **[Terminal 1]** Observe that the disk usage on `/ssd` goes up as the container image is downloaded and extracted.

```bash
docker image ls
```

---

## Final Verification

Reboot your Jetson and verify the following:

```bash
# Check SSD is recognized
sudo blkid | grep nvme

# Check disk space
df -h

# Check Docker root directory
docker info | grep Root

# List Docker directory on SSD
sudo ls -l /ssd/docker/

# Check Docker size
sudo du -chs /ssd/docker/

# Verify nvidia runtime
docker info | grep -e "Runtime" -e "Root"
```

Expected output should show:
- SSD mounted at `/ssd`
- Docker Root Dir: `/ssd/docker`
- Default Runtime: `nvidia`

---

## ✅ Your Jetson is Now Set Up!

Your Jetson is now configured with SSD storage and Docker optimized for AI workloads.

---

## Next Steps

- [Introduction to GenAI](/tutorials/genai-on-jetson-llms-vlms) - Start running LLMs and VLMs
- [Ollama](/tutorials/ollama) - Easy local LLM deployment
- [Supported Models](/models) - Browse optimized models for Jetson

