import os
import sys
from bs4 import BeautifulSoup

# Specify the section name exactly as spelled in mkdocs.yml file
sections_to_keep_open = ["Text (LLM)", "Text + Vision (VLM)", "Vision Transformers (ViT)"]

# Function to process each HTML file
def postprocess_html_file(src_file_path, dest_file_path):
    with open(src_file_path, "r", encoding="utf-8") as file:
        # Parse the HTML file using BeautifulSoup
        soup = BeautifulSoup(file, "lxml")

    # Find and print all <li> elements with specific classes
    li_items = soup.find_all("li", class_="md-nav__item md-nav__item--nested")
    input_tags_modified = 0
    for li in li_items:
        span = li.find("span", class_="md-ellipsis")
        section_name = ""
        if span:
            section_name = span.get_text(strip=True)
            print(f"Text found: {section_name}")

        if section_name not in sections_to_keep_open:
            input_tag = li.find("input", class_="md-nav__toggle")  # Make sure the class is correct
            if not input_tag:
                print(" NO <input> found under <li>")
            # Remove the class "md-toggle--indeterminate"
            if input_tag and "md-toggle--indeterminate" in input_tag['class']:
                input_tag['class'].remove("md-toggle--indeterminate")
                input_tags_modified = input_tags_modified + 1
                print(" --> removed `md-toggle--indeterminate` class")

    # Overwrite the modified content to the file
    with open(dest_file_path, "w", encoding="utf-8") as file:
        file.write(str(soup.prettify()))

    print(f"Modified {input_tags_modified} <input> elements and saved to {dest_file_path}")
