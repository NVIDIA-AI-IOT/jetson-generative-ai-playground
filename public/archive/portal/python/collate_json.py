#!/usr/bin/env python
import os
import json
import argparse

from pathlib import Path


DATA_DIR=Path(__file__).parents[1] / 'data'


def glob_json(dirs):
  files = []

  for path in dirs:
    path = Path(path)
    if path.is_dir():
      subdirs = path.rglob('*.json')
      for s in subdirs:
        if s.parent != path:
          files.append(s)
    elif path.is_file() and path.suffix == '.json':
        files.append(path)

  return files


def merge_json(src, dst={}):
  if isinstance(src, (str, os.PathLike)):
     path = src
     with open(path, 'r') as file:
        src = json.load(file)
        print(f"Read {len(src.keys())} entries from:  {path.relative_to(DATA_DIR)}")
  dst.update(src)
  return dst


if __name__ == "__main__":
    
    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)

    parser.add_argument('inputs', type=str, nargs='*', default=[DATA_DIR])
    parser.add_argument('-O', '--output', type=str, default=DATA_DIR / 'index.json')
    parser.add_argument('--indent', type=int, default=2)

    args = parser.parse_args()
    
    files = glob_json(args.inputs)
    index = {}

    print(f"\nFound {len(files)} json files under {args.inputs}\n")

    for file in files:
      merge_json(file, index)

    with open(args.output, 'w') as file:
       json.dump(index, file, indent=args.indent)
    
    print(f"\nWrote {len(index.keys())} entries from {len(files)} files to:\n  {args.output}\n")