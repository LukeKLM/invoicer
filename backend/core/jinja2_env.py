from jinja2 import Environment
from jinja2 import PackageLoader
from jinja2 import select_autoescape

from app.templates.filters import amount

jinja_env = Environment(
    loader=PackageLoader("app", "templates"),
    autoescape=select_autoescape(),
)

jinja_env.filters["format_date"] = lambda value: value.strftime("%d.%m.%Y")
jinja_env.filters["amount"] = amount
