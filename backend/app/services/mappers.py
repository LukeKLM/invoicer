from app.services.ares.ares_schema import AresEconomicSubject


def ares_economic_subject_mapper(data: dict) -> AresEconomicSubject | None:
    if not data:
        return None

    residence = data.get("sidlo", {})

    model_data = {
        "ico": data.get("ico"),
        "dic": data.get("dic"),
        "name": data.get("obchodniJmeno"),
        "residence": {
            "state": residence.get("nazevStatu"),
            "city": residence.get("nazevObce"),
            "city_part": residence.get("nazevCastiObce"),
            "street": residence.get("nazevUlice"),
            "zip_code": residence.get("psc"),
            "house_number": residence.get("cisloDomovni"),
            "reference_number": residence.get(
                "cisloOrientacni",
            ),
            "full_address": residence.get("textovaAdresa"),
        },
    }

    return AresEconomicSubject.model_validate(model_data)
