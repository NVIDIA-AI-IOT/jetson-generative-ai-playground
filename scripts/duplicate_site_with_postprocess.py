import os
import shutil
import argparse
from bs4 import BeautifulSoup
from postprocess_html_file import postprocess_html_file  # Import the function from the local file

# Function to duplicate site directory with post-processing on HTML files
def duplicate_and_process_html(src_dir, dest_dir):
    if not os.path.exists(src_dir):
        print(f"Source directory {src_dir} does not exist.")
        return
    
    # Remove destination directory if it already exists, then create a new one
    if os.path.exists(dest_dir):
        shutil.rmtree(dest_dir)
    os.makedirs(dest_dir)

    # Walk through the source directory
    for root, dirs, files in os.walk(src_dir):

        if 'dist' in dirs:
            dirs.remove('dist')

        # Create corresponding directory in the destination
        rel_path = os.path.relpath(root, src_dir)
        dest_subdir = os.path.join(dest_dir, rel_path)
        os.makedirs(dest_subdir, exist_ok=True)

        for file_name in files:
            src_file_path = os.path.join(root, file_name)
            dest_file_path = os.path.join(dest_subdir, file_name)

            # Process only HTML files, copy others directly
            if file_name.endswith(".html"):
                # ### HTML file ### 
                #  - Make certain nav items collapse by removing `md-toggle--indeterminate` class.
                print(f"--> Processing file: {src_file_path}")
                postprocess_html_file(src_file_path, dest_file_path)
            else:
                # Copy non-HTML files as-is
                shutil.copy2(src_file_path, dest_file_path)

    print(f"Site duplicated with post-processing to: {dest_dir}")

# Main function to handle argument parsing
def main():
    parser = argparse.ArgumentParser(description="Duplicate a site directory and post-process HTML files.")
    parser.add_argument("src_dir", help="The source directory containing the site files.")
    parser.add_argument("dest_dir", help="The destination directory to output the post-processed site.")
    
    args = parser.parse_args()

    # Call the duplicate and post-process function with the provided arguments
    duplicate_and_process_html(args.src_dir, args.dest_dir)

if __name__ == "__main__":
    main()
