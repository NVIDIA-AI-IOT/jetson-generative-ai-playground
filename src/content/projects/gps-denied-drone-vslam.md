---
title: "GPS-Denied Drone with NVIDIA Jetson Orin Nano"
description: "Autonomous drone using real-time VSLAM on Jetson Orin Nano with Isaac ROS to navigate GPS-denied environments via visual-inertial odometry and onboard mapping."
author: "Andrew Bernas"
date: "2025-06-22"
source: "Hackster"
image: "https://hackster.imgix.net/uploads/attachments/1860199/_3us6r87BE8.blob?auto=compress%2Cformat&w=900&h=675&fit=min"
link: "https://www.hackster.io/bandofpv/gps-denied-drone-with-nvidia-jetson-orin-nano-9f3417"
featured: true
tags: ["vslam", "isaac-ros", "drone", "autonomous", "px4", "mavros", "robotics", "orin-nano"]
---

Andrew Bernas developed an autonomous UAV platform powered by Visual Simultaneous Localization and Mapping (VSLAM) using Isaac ROS, integrated with MAVROS and PX4 flight stack. The system enables real-time localization and mapping for autonomous navigation in GPS-denied environments.

By fusing visual-inertial data from an Intel D435i camera and leveraging Jetson Orin Nano's edge computing capabilities, the drone can maintain situational awareness, dynamically map unknown environments, and execute autonomous flight patterns with high precision—all without GPS dependency.

### Features

- Isaac ROS VSLAM for real-time visual-inertial odometry
- PX4 flight controller integration via MAVROS
- Intel RealSense D435i stereo camera with IMU
- Extended Kalman Filter (EKF) for sensor fusion
- Autonomous flight pattern execution (square, circle, figure-8, spiral)
- Real-time mapping and localization on edge device
- Complete ROS2 integration for visualization and control
- Fully autonomous operation in GPS-denied scenarios

### Resources

- [Hackster Project](https://www.hackster.io/bandofpv/gps-denied-drone-with-nvidia-jetson-orin-nano-9f3417)
- [GitHub Repository](https://github.com/bandofpv/VSLAM-UAV)


