"""API versioning constants and helpers."""

CURRENT_API_VERSION = "v1"
SUPPORTED_API_VERSIONS = (CURRENT_API_VERSION,)
API_VERSION_HEADER = "API-Version"


def version_prefix(version=CURRENT_API_VERSION):
    """Return the URL prefix for a supported API version."""
    if version not in SUPPORTED_API_VERSIONS:
        raise ValueError(f"Unsupported API version: {version}")
    return f"api/{version}/"
