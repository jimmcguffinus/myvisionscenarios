#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script to read the content of specified files and write them to 'blah.md',
separated by filename headers. Overwrites 'blah.md' on each run.

Usage: python create_bundle.py <file1_path> [file2_path] ...
Example: python create_bundle.py src/App.tsx src/components/EditModal.tsx
"""

import sys
import os

OUTPUT_FILENAME = "blah.md"

def create_content_bundle(file_paths):
    """Reads files and writes their content to the output file."""
    if not file_paths:
        print("Usage: python create_bundle.py <file1_path> [file2_path] ...")
        print("Error: No file paths provided.")
        sys.exit(1)

    all_content_blocks = []
    read_files_count = 0
    failed_files = []
    output_filepath = os.path.join(os.getcwd(), OUTPUT_FILENAME) # Output in current dir

    print(f"Preparing bundle in: {output_filepath}")
    print("Attempting to read files...")

    for i, file_path in enumerate(file_paths):
        normalized_path = os.path.normpath(file_path)
        relative_path_for_header = os.path.relpath(normalized_path, os.getcwd()) # Show path relative to project root
        print(f"- Reading: {normalized_path}")
        try:
            if not os.path.exists(normalized_path):
                raise FileNotFoundError(f"File does not exist: {normalized_path}")
            if os.path.isdir(normalized_path):
                 print(f"  Skipping directory: {normalized_path}")
                 failed_files.append(f"{normalized_path} (Is directory)")
                 continue

            with open(normalized_path, 'r', encoding='utf-8') as f:
                content = f.read()

                # Add separator and filename header using Markdown code block syntax
                header = f"\n```markdown\n--- START: {relative_path_for_header} ---\n```\n"
                # Add file content within a code block appropriate for the file type
                lang = os.path.splitext(relative_path_for_header)[1].lstrip('.')
                if not lang: lang = 'text' # Default language
                content_block = f"```{lang}\n{content}\n```"
                footer = f"\n```markdown\n--- END: {relative_path_for_header} ---\n```\n"

                all_content_blocks.append(header)
                all_content_blocks.append(content_block)
                all_content_blocks.append(footer)

                read_files_count += 1

        except FileNotFoundError as e:
            print(f"  Error: {e}", file=sys.stderr)
            failed_files.append(f"{normalized_path} (Not found)")
        except Exception as e:
            print(f"  Error reading file {normalized_path}: {e}", file=sys.stderr)
            failed_files.append(f"{normalized_path} (Read error)")

    if read_files_count == 0:
        print("\nError: No content was read from any valid files. Bundle not created.")
        sys.exit(1)

    final_text = "\n".join(all_content_blocks)

    try:
        # Open in 'w' mode to overwrite the file each time
        with open(output_filepath, 'w', encoding='utf-8') as outfile:
            outfile.write(final_text)
        print(f"\nSuccess! Content of {read_files_count} file(s) written to '{OUTPUT_FILENAME}'.")
        if failed_files:
            print("\nCould not read the following:")
            for failed in failed_files:
                print(f"- {failed}")

    except Exception as e:
        print(f"\nError writing to file '{OUTPUT_FILENAME}': {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    files_to_copy = sys.argv[1:]
    create_content_bundle(files_to_copy)