def amount(value):
    if not value:
        return "0"

    return f"{float(value):,.2f}".replace(",", " ").replace(".", ",")
