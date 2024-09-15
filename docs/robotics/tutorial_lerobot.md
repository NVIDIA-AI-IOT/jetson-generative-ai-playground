# Tutorial - LeRobot

Let's run [`LeRobot`](https://github.com/huggingface/lerobot/) to train robotics models in videos using NVIDIA Jetson.

<img src="https://github.com/user-attachments/assets/6a8967e1-f9dd-463f-906b-d9fd1f44450f">

## Usage Examples

### Example: Visualize datasets

On Docker host (Jetson native), first launch rerun.io (check the [original instruction on lerobot repo](https://github.com/huggingface/lerobot/?tab=readme-ov-file#visualize-datasets))

```bash
pip install rerun-sdk
rerun
```

Then, start the docker container to run the visualization script.

```bash
jetson-containers run -w /opt/lerobot $(autotag lerobot) \
  python3 lerobot/scripts/visualize_dataset.py \
    --repo-id lerobot/pusht \
    --episode-index 0
```

### Example: Evaluate a pretrained policy

See the [original instruction on lerobot repo](https://github.com/huggingface/lerobot/?tab=readme-ov-file#evaluate-a-pretrained-policy).

```bash
jetson-containers run -w /opt/lerobot $(autotag lerobot) \
  python3 lerobot/scripts/eval.py \
    -p lerobot/diffusion_pusht \
    eval.n_episodes=10 \
    eval.batch_size=10
```

### Example: Train your own policy

See the [original instruction on lerobot repo](https://github.com/huggingface/lerobot/?tab=readme-ov-file#train-your-own-policy).

```bash
jetson-containers run -w /opt/lerobot $(autotag lerobot) \
  python3 lerobot/scripts/train.py \
    policy=act \
    env=aloha \
    env.task=AlohaInsertion-v0 \
    dataset_repo_id=lerobot/aloha_sim_insertion_human 
```

To start the container, you can use [`jetson-containers run`](/docs/run.md) and [`autotag`](/docs/run.md#autotag), or manually put together a [`docker run`](https://docs.docker.com/engine/reference/commandline/run/) command:
```bash
# automatically pull or build a compatible container image
jetson-containers run $(autotag lerobot)

# or explicitly specify one of the container images above
jetson-containers run dustynv/lerobot:r36.3.0

# or if using 'docker run' (specify image and mounts/ect)
sudo docker run --runtime nvidia -it --rm --network=host dustynv/lerobot:r36.3.0
```