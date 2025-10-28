"""
Configuration handling.
"""
from dataclasses import dataclass
from typing import Dict, Any
import json
import os

@dataclass
class Config:
    """Configuration settings."""
    default_duration: int = 120  # minutes
    date_format: str = '%Y-%m-%d'
    time_format: str = '%H:%M'
    default_access_groups: list[str] = None

    @classmethod
    def load(cls, config_path: str) -> 'Config':
        """Load configuration from JSON file."""
        if not os.path.exists(config_path):
            return cls()
            
        with open(config_path, 'r') as f:
            data = json.load(f)
            return cls(**data)

    def save(self, config_path: str) -> None:
        """Save configuration to JSON file."""
        with open(config_path, 'w') as f:
            json.dump(self.__dict__, f, indent=2)