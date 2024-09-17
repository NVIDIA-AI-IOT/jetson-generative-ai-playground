# ROS2 Nodes for Generative AI

The [`ros2_nanollm`](https://github.com/NVIDIA-AI-IOT/ros2_nanollm) package provides ROS2 nodes for running optimized LLM's and VLM's locally inside a container.  These are built on [NanoLLM](tutorial_nano-llm.md) and ROS2 Humble for deploying generative AI models onboard your robot with Jetson.

![](https://github.com/NVIDIA-AI-IOT/ros2_nanollm/raw/main/assets/sample.gif)


!!! abstract "What you need"

    1. One of the following Jetson devices:

        <span class="blobDarkGreen4">Jetson AGX Orin (64GB)</span>
        <span class="blobDarkGreen5">Jetson AGX Orin (32GB)</span>
        <span class="blobLightGreen3">Jetson Orin NX (16GB)</span>
        <span class="blobLightGreen4">Jetson Orin Nano (8GB)</span><span title="Orin Nano 8GB can run Llava-7b, VILA-7b, and Obsidian-3B">⚠️</span>
	   
    2. Running one of the following versions of [JetPack](https://developer.nvidia.com/embedded/jetpack):

        <span class="blobPink2">JetPack 5 (L4T r35.x)</span>
        <span class="blobPink2">JetPack 6 (L4T r36.x)</span>

    3. Sufficient storage space (preferably with NVMe SSD).

        - `22GB` for `nano_llm:humble` container image
        - Space for models (`>10GB`)
        
    4. Clone and setup [`jetson-containers`](https://github.com/dusty-nv/jetson-containers/blob/master/docs/setup.md){:target="_blank"}:
    
		```bash
		git clone https://github.com/dusty-nv/jetson-containers
		bash jetson-containers/install.sh
		``` 
		
## Running the Live Demo

!!! abstract "Recommended"

    Before you start, please review [NanoVLM](https://www.jetson-ai-lab.com/tutorial_nano-vlm.html) and [Live LLaVa](https://www.jetson-ai-lab.com/tutorial_live-llava.html) demos.  For primary documentation, view [ROS2 NanoLLM](https://github.com/NVIDIA-AI-IOT/ros2_nanollm).

1. Ensure you have a camera device connected

    ```
    ls /dev/video*
    ```
    
    
2. Use the `jetson-containers run` and `autotag` commands to automatically pull or build a compatible container image. 

	```
	jetson-containers run $(autotag nano_llm:humble) \
		ros2 launch ros2_nanollm camera_input_example.launch.py
	```
	
	This command will start the launch file of the container. 

By default this will load the [`Efficient-Large-Model/Llama-3-VILA1.5-8B`](https://huggingface.co/Efficient-Large-Model/Llama-3-VILA1.5-8b) VLM and publish the image captions and overlay to topics that can be subscribed to by your other nodes, or visualized with RViz or Foxglove.  Refer to the [`ros2_nanollm`](https://github.com/NVIDIA-AI-IOT/ros2_nanollm) repo for documentation on the input/output topics that are exposed.

## Build your own ROS Nodes

To build your own ROS2 node using LLM or VLM, first create a ROS 2 workspace and package in a directory mounted to the container (following the [ROS 2 Humble Documentation](https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Creating-A-Workspace/Creating-A-Workspace.html)).  Your src folder should then look like this: 


		└── src    
			└── your-package-name
				├── launch     
						└── camera_input.launch.py
				├── resource
						└── your-package-name
				├── your-package-name
						└── __init__.py 
						└── your-node-name_py.py
				├── test
						└── test_copyright.py
						└── test_flake8.py
						└── test_pep257.py
				├── package.xml
				├── setup.cfg
				├── setup.py
				└── README.md

We will create the launch folder, as well as the camera_input.launch.py and your-node-name_py.py files in later steps. 


### Editing the Setup

Let’s begin by editing the `setup.py` file. At the top of the file, add 

```
from glob import glob 
```

In the setup method, find the `data_files=[]` line, and make sure it looks like this: 

```
data_files=[
       ('share/ament_index/resource_index/packages',
           ['resource/' + package_name]),
       ('share/' + package_name, ['package.xml']),
   ('share/' + package_name, glob('launch/*.launch.py')),
   ],
```

Edit the maintainer line with your name. Edit the maintainer email to your email. Edit the description line to describe your package. 

```
maintainer='kshaltiel', 
maintainter_email='kshaltiel@nvidia.com', 
description='YOUR DESCRIPTION',  
```

Find the ```console_scripts``` line in the entry_points method. Edit the inside to be: 

```
'your-node-name_py = your-package-name.your-node-name_py:main'
```

For example: 
```
entry_points={
       'console_scripts': [
       'nano_llm_py = ros2_nanollm.nano_llm_py:main'
       ],
   },
```
*All done for this file!*


### Creating the Node

Inside your package, under the folder that shares your package's name and contains the ```__init__.py``` file, create a file named after your node. For NanoLLM, this file would be called ```nano_llm_py.py```. 

Paste the following code into the empty file: 

```python
import rclpy 
from std_msgs.msg import String
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
from PIL import Image as im
from MODEL_NAME import NECESSARY_MODULES

class Your_Model_Subscriber(Node):

    def __init__(self):
        super().__init__('your_model_subscriber')
        
        #EDIT PARAMETERS HERE 
        self.declare_parameter('param1', "param1_value") 
        self.declare_parameter('param2', "param2_value")
      
        # Subscriber for input query
        self.query_subscription = self.create_subscription(
            String,
            'input_query',
            self.query_listener_callback,
            10)
        self.query_subscription  # prevent unused variable warning

        # Subscriber for input image
        self.image_subscription = self.create_subscription(
            Image,
            'input_image',
            self.image_listener_callback,
            10)
        self.image_subscription  # prevent unused variable warning

        # To convert ROS image message to OpenCV image
        self.cv_br = CvBridge() 

        #LOAD THE MODEL
        self.model = INSERT_MODEL.from_pretrained("PATH-TO-MODEL")
        
        #chatHistory var 
        self.chat_history = ChatHistory(self.model)
 
        ##  PUBLISHER
        self.output_publisher = self.create_publisher(String, 'output', 10)
        self.query = "Describe the image."

    def query_listener_callback(self, msg):
        self.query = msg.data

    def image_listener_callback(self, data): 
        input_query = self.query
        
        # call model with input_query and input_image 
        cv_img = self.cv_br.imgmsg_to_cv2(data, 'rgb8')
        PIL_img = im.fromarray(cv_img)

        # Parsing input text prompt
        prompt = input_query.strip("][()")
        text = prompt.split(',')
        self.get_logger().info('Your query: %s' % text) #prints the query
        
        #chat history 
        self.chat_history.append('user', image=PIL_img)
        self.chat_history.append('user', prompt, use_cache=True)
        embedding, _ = self.chat_history.embed_chat()

	#GENERATE OUTPUT
        output = self.model.generate(
            inputs=embedding,
            kv_cache=self.chat_history.kv_cache,
            min_new_tokens = 10,
            streaming = False, 
            do_sample = True,
        )

        output_msg = String()
        output_msg.data = output
        self.output_publisher.publish(output_msg)
        self.get_logger().info(f"Published output: {output}")

def main(args=None):
    rclpy.init(args=args)

    your_model_subscriber = Your_Model_Subscriber()

    rclpy.spin(your_model_subscriber)

    # Destroy the node explicitly
    # (optional - otherwise it will be done automatically
    # when the garbage collector destroys the node object)
    nano_llm_subscriber.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```


Edit the import statement at the top of the file to import the necessary modules from the model. 

Next, edit the class name and name inside the ```__init__()``` function to reflect the model that will be used. 

Find the comment that reads ```#EDIT PARAMETERS HERE```. Declare all parameters except for the model name following the format in the file. Under the ```#LOAD THE MODEL``` comment, include the path to the model. 

Lastly, edit the generate method under the ```GENERATE OUTPUT``` comment to include any additional parameters. 

*All done for this file!*


### Creating the Launch File 

Inside your package, create the launch folder. Create your launch file inside of it. 

```
mkdir launch
cd launch 
touch camera_input.launch.py
```

You can edit this file externally, and it will update within the container. Paste the following code into the empty file. 

```python
from launch import LaunchDescription
from launch_ros.actions import Node
from launch.substitutions import LaunchConfiguration
from launch.actions import DeclareLaunchArgument

def generate_launch_description():
    launch_args = [
        DeclareLaunchArgument( 
            'param1',
            default_value='param1_default',
            description='Description of param1'),
        DeclareLaunchArgument(
            'param2',
            default_value='param2_default',
            description='Description of param2'),
    ]

   
    #Your model parameters 
    param1 = LaunchConfiguration('param1')
    param2 = LaunchConfiguration('param2')
    
    #camera node for camera input
    cam2image_node = Node(
            package='image_tools',
            executable='cam2image',
            remappings=[('image', 'input_image')],
    )

    #model node
    model_node = Node(
            package='your-package-name', #make sure your package is named this
            executable='your-node-name_py', 
            parameters=[{
            	'param1': param1, 
            	'param2': param2,
            }]
    )
    
    final_launch_description = launch_args + [cam2image_node] + [model_node]
    
    return LaunchDescription(final_launch_description)


```

Find the required parameters for your model. You can view this by looking at the [Model API](https://dusty-nv.github.io/NanoLLM/models.html#model-api) for your specific model and taking note to how the model is called. For example, NanoLLM retrieves models through the following: 

```
model = NanoLLM.from_pretrained(
   "meta-llama/Llama-3-8b-hf",  # HuggingFace repo/model name, or path to HF model checkpoint
   api='mlc',                   # supported APIs are: mlc, awq, hf
   quantization='q4f16_ft'      # q4f16_ft, q4f16_1, q8f16_0 for MLC, or path to AWQ weights
)
```

The parameters for NanoLLM would be the model name, api, and quantization. 

In the ```generate_launch_description``` function, edit the ```DeclareLaunchArgument``` to accomodate for all parameters except the model name. For NanoLLM, this would look like: 

```
def generate_launch_description():
    launch_args = [
        DeclareLaunchArgument( 
            'api',
            default_value='mlc',
            description='The model backend to use'),
        DeclareLaunchArgument(
            'quantization',
            default_value='q4f16_ft',
            description='The quantization method to use'),
    ]
```

Then edit the lines under ```#Your model Parameters``` to match the parameters of your model, again excluding the model name. Lastly, fill in the code under the ```#model node``` comment with your package name, the name of your node file, and all of your parameters, this time including the model. 

*All done for this file!*

