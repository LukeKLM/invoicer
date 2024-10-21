from io import BytesIO

from weasyprint import CSS
from weasyprint import HTML

from core.jinja2_env import jinja_env


async def generate_pdf(template: str, context: dict) -> BytesIO:
    template = jinja_env.get_template(template)
    html = template.render(**context)
    css = CSS(filename="backend/app/templates/invoice.css")
    return BytesIO(HTML(string=html).write_pdf(stylesheets=[css]))
