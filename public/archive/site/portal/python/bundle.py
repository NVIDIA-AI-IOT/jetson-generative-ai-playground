#!/usr/bin/env python
# This concatenates css, js, and json files into dist/
# For live refresh:  python portal/python/bundle.py --watch
import os
import time
import json
import argparse

from pathlib import Path
from datetime import datetime
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
    '$ROOT/css/tabs.css',
    '$ROOT/css/fields.css',
    '$ROOT/css/buttons.css', 
    '$ROOT/css/select.css',
    '$ROOT/css/sidebar.css',
    '$ROOT/css/rollup.css',
    '$ROOT/css/modal.css',
    '$ROOT/css/models.css'
]

def deployment_files(root: str=None, **kwargs):
    return {
        'css': [x.replace('$ROOT', root) for x in CSS],
        'db': globber(os.path.join(root, 'js/resolvers'), ext='.json'),
        'js': globber(os.path.join(root, 'js/'), ext='.js', blacklist='nanolab.js')
    }


def cli_arguments():
    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)

    parser.add_argument('--root', type=str, default=str(ROOT))

    parser.add_argument('--data', type=str, default='$ROOT/data')
    parser.add_argument('--css', type=str, default='$ROOT/dist/nanolab.css')
    parser.add_argument('--js', type=str, default='$ROOT/dist/nanolab.js')
    parser.add_argument('--db', type=str, default='$ROOT/dist/db.json')
    
    parser.add_argument('--skip-db', action='store_true')
    parser.add_argument('--skip-js', action='store_true')
    parser.add_argument('--skip-css', action='store_true')

    parser.add_argument('--json-indent', type=int, default=2)
    parser.add_argument('--watch', action='store_true')

    return parser.parse_args()


def format_header(title, sep='#', width=85):
    return f"\n{sep * width}\n{sep * 2} {title}\n{sep * width}\n"


def concat_css(css: str=None, root: str=None, files=None, **kwargs):
    css = css.replace('$ROOT', root)

    print(format_header(f"Concat CSS => {css}"))
    print(f"{pformat(files, indent=2)}\n")

    txt = ''

    for idx, path in enumerate(files):
        with open(path, 'r') as file:
            begin = f"/* BEGIN: {CSS[idx]} */"
            end = f"/* END: {CSS[idx]} */"
            txt = f"{txt}\n\n{begin}\n\n{file.read()}\n{end}\n\n"

    with open(css, 'w') as file:
        file.write(txt)

    print(f"Wrote {len(txt)} bytes to {css}\n")
    return txt


def globber(dirs, ext='.json', blacklist=[]):
    files = []

    if isinstance(dirs, str):
        dirs = [dirs]

    for path in dirs:
        path = Path(path)

    if path.is_dir():
        subdirs = path.rglob(f'*{ext}')

        for s in subdirs:
            if s.name not in blacklist: #s.parent != path:
                files.append(s)

    elif path.is_file() and path.suffix == ext:
        files.append(str(path))

    return files


def merge_js(root: str=None, js: str=None, files=None, **kwargs):
    print(f"Found {len(files)} javascript files to bundle:\n\n{pformat(files, indent=2)}\n")

    bundle = ''

    for file in files:
        with open(file, 'r') as f:
            lines = f.readlines()

        bundle += f"\n/* BEGIN: {file} */\n"
        importing = False
  
        for x in lines:
            if not x:
                continue

            if x[0] == '#':
                bundle += '/* ' + x + ' */'
            elif x.startswith('import'):
                if ';' in x:
                    bundle += '/* ' + x + ' */'
                else:
                    importing = True
                    bundle += '/* ' + x
            elif importing and ';' in x:
                importing = False
                bundle += x + ' */'
            else:
                bundle += x

        bundle += f"\n/* END: {file} */\n"

    dst_path = js.replace('$ROOT', root)
    print(f"Writing {len(bundle)} bytes to:   {dst_path}")

    with open(dst_path, 'w') as f:
        f.write(bundle)

    return bundle


def merge_json(src, dst={}):
    if isinstance(src, (str, os.PathLike)):
        path = src
        with open(path, 'r') as file:
            src = json.load(file)
            print(f"Read {len(src.keys())} entries from:\t{path.relative_to(ROOT)}")
    dst.update(src)
    return dst


def merge_db(db: str=None, root: str=None, json_indent: int=2, files=None, **kwargs):
    db = db.replace('$ROOT', root)

    print(format_header(f'Merging GraphDB => {db}'))
    print(f"Found {len(files)} json files to bundle:\n\n{pformat(files, indent=2)}\n")

    index = {}

    for file in files:
        merge_json(file, index)

    with open(db, 'w') as file:
        json.dump(index, file, indent=json_indent)
    
    print(f"\nWrote {len(index.keys())} entries from {len(files)} files to:\n  {db}\n")
   

def deploy(skip_css=False, skip_db=False, skip_js=False, files=None, **kwargs):
    if not skip_css:
        concat_css(**kwargs, files=files['css'])

    if not skip_db:
        merge_db(**kwargs, files=files['db'])

    if not skip_js:
        merge_js(**kwargs, files=files['js'])

    print(f'Refreshed deployment at:  {datetime.now().strftime("%H:%M:%S")}')
        
def main():
    args = cli_arguments()
    files = deployment_files(**vars(args))
    times = {}

    if not args.watch:
        return deploy(**vars(args), files=files)

    while True:
        changed = False

        for x, xf in files.items():
            for file in xf:
                last_updated = os.stat(file).st_mtime
                if file not in times or times[file] != last_updated:
                    changed = True
                    times[file] = last_updated
                    print(f"\nFILE CHANGED  {file} ({last_updated})")
                

        if changed:
            deploy(**vars(args), files=files)

        time.sleep(1.5)

if __name__ == "__main__":
    main()
    
    