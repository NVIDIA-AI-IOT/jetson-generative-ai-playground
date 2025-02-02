#!/usr/bin/env python
import os
import json
import argparse

from pathlib import Path
from pprint import pprint, pformat

ROOT=Path(__file__).parents[1]

CSS=[
    '$ROOT/css/themes.css',
    '$ROOT/dist/select2/select2.css',
    '$ROOT/dist/bootstrap-icons/bootstrap-icons.css',
    '$ROOT/dist/prism/prism.nvidia.css',
    '$ROOT/css/styles.css',
    '$ROOT/css/flex.css', 
    '$ROOT/css/card.css', 
    '$ROOT/css/code.css',
    '$ROOT/css/fields.css',
    '$ROOT/css/buttons.css', 
    '$ROOT/css/select.css',
    '$ROOT/css/sidebar.css',
    '$ROOT/css/rollup.css',
    '$ROOT/css/modal.css',
    '$ROOT/css/models.css'
]

def cli_arguments():
    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)

    parser.add_argument('--root', type=str, default=str(ROOT))

    parser.add_argument('--data', type=str, default='$ROOT/data')
    parser.add_argument('--css', type=str, default='$ROOT/dist/nanolab.css')
    parser.add_argument('--db', type=str, default='$ROOT/dist/db.json')

    parser.add_argument('--skip-db', action='store_true')
    parser.add_argument('--skip-css', action='store_true')

    parser.add_argument('--json-indent', type=int, default=2)

    return parser.parse_args()


def format_header(title, sep='#', width=85):
    return f"\n{sep * width}\n{sep * 2} {title}\n{sep * width}\n"


def concat_css(css: str=None, root: str=None, **kwargs):
    abs = [x.replace('$ROOT', root) for x in CSS]
    css = css.replace('$ROOT', root)

    print(format_header(f"Concat CSS => {css}"))
    print(f"{pformat(abs, indent=2)}\n")

    txt = ''

    for idx, path in enumerate(abs):
        with open(path, 'r') as file:
            begin = f"/* BEGIN: {CSS[idx]} */"
            end = f"/* END: {CSS[idx]} */"
            txt = f"{txt}\n\n{begin}\n\n{file.read()}\n{end}\n\n"

    with open(css, 'w') as file:
        file.write(txt)

    print(f"Wrote {len(txt)} bytes to {css}\n")
    return txt


def glob_json(dirs):
    files = []

    if isinstance(dirs, str):
        dirs = [dirs]

    for path in dirs:
        path = Path(path)

    if path.is_dir():
        subdirs = path.rglob('*.json')

        for s in subdirs:
            if s.parent != path:
                files.append(s)

    elif path.is_file() and path.suffix == '.json':
        files.append(str(path))

    return files


def merge_json(src, dst={}):
    if isinstance(src, (str, os.PathLike)):
        path = src
        with open(path, 'r') as file:
            src = json.load(file)
            print(f"Read {len(src.keys())} entries from:\t{path.relative_to(ROOT)}")
    dst.update(src)
    return dst


def merge_db(db: str=None, root: str=None, data: str=None, json_indent: int=2, **kwargs):
    db = db.replace('$ROOT', root)
    data = data.replace(f'$ROOT', root)

    print(format_header(f'Merging GraphDB => {db}'))
          
    files = glob_json(data)
    index = {}

    print(f"Found {len(files)} json files under {data}:\n\n{pformat(files, indent=2)}\n")

    for file in files:
        merge_json(file, index)

    with open(db, 'w') as file:
        json.dump(index, file, indent=json_indent)
    
    print(f"\nWrote {len(index.keys())} entries from {len(files)} files to:\n  {db}\n")
   

if __name__ == "__main__":

    args = cli_arguments()

    if not args.skip_css:
        concat_css(**vars(args))

    if not args.skip_db:
        merge_db(**vars(args))
    
    