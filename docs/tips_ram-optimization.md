# RAM Optimization

Running a LLM requires a huge RAM space.

Especially if you are on <span class="blobLightGreen4">Jetson Orin Nano</span> that only has 8GB of RAM, it is crucial to leave as much RAM space available for models. 

Here we share a couple of ways to optimize the system RAM usage. 

## Disabling the Desktop GUI

If you use your Jetson remotely through SSH, you can disable the Ubuntu desktop GUI.<br>
This will free up extra memory that the window manager and desktop uses (around ~800MB for Unity/GNOME).

You can disable the desktop temporarily, run commands in the console, and then re-start the desktop when desired:

```
$ sudo init 3     # stop the desktop
# log your user back into the console (Ctrl+Alt+F1, F2, ect)
$ sudo init 5     # restart the desktop
```

If you wish to make this persistent across reboots, you can use the following commands to change the boot-up behavior:

- To disable desktop on boot

    ```
    $ sudo systemctl set-default multi-user.target     
    ```

- To enable desktop on boot

    ```
    $ sudo systemctl set-default graphical.target      
    ```

## Disabling misc services

```
sudo systemctl disable nvargus-daemon.service
```

## Mounting Swap

If you're building containers or working with large models, it's advisable to mount SWAP (typically correlated with the amount of memory in the board). Run these commands to disable ZRAM and create a swap file:

> If you have NVMe SSD storage available, it's preferred to allocate the swap file on the NVMe SSD.

```
sudo systemctl disable nvzramconfig
sudo fallocate -l 16G /ssd/16GB.swap
sudo mkswap /ssd/16GB.swap
sudo swapon /ssd/16GB.swap
```

Then add the following line to the end of /etc/fstab to make the change persistent:

```
/ssd/16GB.swap  none  swap  sw 0  0
```