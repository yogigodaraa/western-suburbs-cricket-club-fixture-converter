"""
Main entry point for the WSCC Fixtures converter.
"""
import click
from .converter import FixtureConverter
from .config import Config

@click.group()
def cli():
    """WSCC Fixtures converter tool."""
    pass

@cli.command()
@click.argument('input_file', type=click.Path(exists=True))
@click.argument('output_file', type=click.Path())
@click.option('--config', '-c', type=click.Path(), help='Path to config file')
def convert(input_file: str, output_file: str, config: str = None):
    """Convert fixtures from advanced format to template format."""
    converter = FixtureConverter()
    
    try:
        converter.convert_file(input_file, output_file)
        click.echo(f"Successfully converted {input_file} to {output_file}")
    except Exception as e:
        click.echo(f"Error converting file: {str(e)}", err=True)
        raise click.Abort()

if __name__ == '__main__':
    cli()