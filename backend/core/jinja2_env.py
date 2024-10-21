from jinja2 import Environment
from jinja2 import PackageLoader
from jinja2 import select_autoescape

jinja_env = Environment(
    loader=PackageLoader("app", "templates"),
    autoescape=select_autoescape(),
)
