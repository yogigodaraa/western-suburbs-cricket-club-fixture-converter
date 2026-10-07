import os


def sanitize_filename(filename):
    """Sanitize an uploaded filename: drop any directory part, keep safe characters only."""
    name = os.path.basename(filename)
    return "".join(c for c in name if c.isalnum() or c in "._-")
