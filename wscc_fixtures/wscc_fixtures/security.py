
def sanitize_filename(filename):
    """Sanitize uploaded filename for security"""
    return "".join(c for c in filename if c.isalnum() or c in "._-")
