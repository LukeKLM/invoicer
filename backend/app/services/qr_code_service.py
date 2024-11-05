import base64

import qrcode
import qrcode.image.svg


def generate_qr_svg(data: str) -> str:
    factory = qrcode.image.svg.SvgPathImage
    qr = qrcode.make(data, image_factory=factory)
    svg_data = qr.to_string().decode("utf-8")
    return base64.b64encode(svg_data.encode("utf-8")).decode("utf-8")
