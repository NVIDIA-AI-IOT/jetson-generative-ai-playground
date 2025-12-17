---
title: "Setup Jetson Orin Nano with SDK Manager"
description: "Alternative setup method using NVIDIA SDK Manager to flash firmware and JetPack to your Jetson Orin Nano Developer Kit, including NVMe SSD installation support."
category: "Setup"
section: "Jetson Setup"
order: 2
tags: ["setup", "jetson", "orin-nano", "jetpack", "sdk-manager", "nvme", "ssd", "getting-started"]
---

> This guide supplements the official [Jetson Orin Nano Developer Kit Getting Started Guide](https://developer.nvidia.com/embedded/learn/get-started-jetson-orin-nano-devkit).

The NVIDIA® Jetson Orin Nano™ Developer Kit is a perfect kit to start your journey of local generative AI evaluation and development.

This guide explains the **alternative method** for setting up Jetson Orin Nano Developer Kit by flashing both the latest firmware (QSPI image) and the latest JetPack all at once, using a host x86 PC.

---

## Prerequisites

The following items are needed for flashing your Jetson Orin Nano Developer Kit using your host PC.

### Host PC

- x86 PC running **Ubuntu 22.04** or **Ubuntu 20.04**

### Storage

Either of the following:

- microSD card (64GB or bigger)
- NVMe SSD (Recommended for better performance)

### Flashing Supplies

- USB cable (USB-C plug for Jetson Orin Nano Developer Kit side, other end depends on your PC)
- Jumper pin (or metal paper clip)

### Means to Access Terminal

You need either of the following sets:

- DisplayPort cable, DisplayPort capable monitor and a USB keyboard
- DisplayPort to HDMI cable and HDMI capable monitor (or TV) and a USB keyboard
- [USB to TTL Serial cable](https://www.adafruit.com/product/954) (Advanced)

---

## Default Method Alternative

If you **do NOT** have an x86 PC running Ubuntu 22.04 or 20.04, you can use the default "microSD card only" setup method that does not require any host PC.

See our [microSD-only setup guide](/tutorials/initial-setup-jetson-orin-nano) for that method.

---

## Overall Flow (SDK Manager Method)

1. Install SDK Manager
2. Connect Target Hardware
3. Select Software Components to Install
4. Download on Host PC
5. Flash
6. Boot and initial setup
7. 👍 Start developing on JetPack 6.2

---

## 0️⃣ Install SDK Manager

On your Ubuntu 22.04 / 20.04 PC, open a terminal and execute the following commands.

### For Ubuntu 22.04

```bash
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get -y install sdkmanager
```

### For Ubuntu 20.04

```bash
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2004/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get -y install sdkmanager
```

Then launch SDK Manager:

```bash
sdkmanager
```

> **First time users:** When using SDK Manager for the first time, log in with your NVIDIA Developer credentials. Remember to tick the checkbox for "Stay logged in" and click "LOGIN" button.

---

## 1️⃣ Connect the Target Hardware

Once SDK Manager is launched, connect your Jetson developer kit to your Ubuntu PC and power it on in Forced Recovery mode.

1. **Connect** your Jetson Orin Nano Developer Kit to your PC with a USB cable.
   
   > The USB cable goes into the USB-C port of the carrier board of the developer kit.

2. **Enter Recovery Mode:** While shorting `pin 9` and `pin 10` of `J14` header located below the Jetson module using a jumper pin, insert the DC power supply plug into the DC jack of the carrier board to power it on.

   > You can use a paper clip as well.

3. **Select Device:** Select "Jetson Orin Nano [8GB developer kit version]" and hit "OK"

4. **Uncheck Host Machine** - it should now show only the Target Hardware selected

5. Click **Continue** to proceed to the next step.

---

## 2️⃣ Select Software Components to Install

1. Leave only "**Jetson Linux**" component checked, and uncheck everything else.

2. Check "**I accept the terms and conditions of the license agreements**".

3. Click **Continue** to proceed.

4. Enter your `sudo` password when prompted.

---

## 3️⃣ Download on Host PC

1. SDK Manager will start downloading the "BSP" package and "RootFS" package.

2. Once downloads are complete, it will untar the package and start generating the images to flash in the background.

3. Once images are ready, SDK Manager will open the prompt for flashing.

---

## 4️⃣ Flash

1. On the flashing prompt, select **"Runtime"** for "OEM Configuration".

2. Select **"NVMe"** if you want to flash Jetson Linux (BSP) to NVMe SSD (or **"SD Card"** for microSD).

3. Click **Flash** and wait for the process to complete.

4. Monitor the flash progress in the Details or Terminals tab.

---

## 5️⃣ Boot and Initial Setup

1. **Remove the jumper** from header (that was used to put it in Forced Recovery mode)

2. **Connect peripherals:** DisplayPort cable/adapter and USB keyboard/mouse to Jetson Orin Nano Developer Kit, or hook up the USB to TTL Serial cable.

3. **Power cycle:** Unplug the power supply and put back in.

4. Jetson should now boot into the Jetson Linux (BSP) of your selected JetPack version from the storage of your choice.

5. **Complete the initial software setup** (`oem-config`)

---

## Switch to MAXN SUPER Mode

Note that the default power mode on JetPack 6.2 on Jetson Orin Nano Developer Kit is **25W**.

To switch to the **MAXN SUPER** mode and unlock the unregulated performance:

1. Click on the current power mode (**25W**) by clicking the NVIDIA icon on the right side of the Ubuntu desktop's top bar.
2. Select **Power mode** from the menu.
3. Choose **MAXN SUPER** to enable maximum performance.

---

## 👍 Congratulations!

Your Jetson Orin Nano Developer Kit is set up with JetPack 6.2 image and you are ready to develop!

---

## Next Steps

- [SSD + Docker Setup](/tutorials/ssd-docker-setup) - Configure Docker for AI workloads
- [Introduction to GenAI](/tutorials/genai-on-jetson-llms-vlms) - Start running LLMs and VLMs

