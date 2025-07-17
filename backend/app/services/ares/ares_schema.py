from pydantic import BaseModel
from pydantic import ConfigDict


class AresResidence(BaseModel):
    state: str | None
    city: str | None
    city_part: str | None = None
    street: str | None
    zip_code: int | None
    house_number: int | None
    reference_number: int | None = None
    full_address: str | None

    model_config = ConfigDict(populate_by_name=True)


class AresEconomicSubject(BaseModel):
    ico: str | None
    dic: str | None = None
    name: str | None
    residence: AresResidence | None

    model_config = ConfigDict(populate_by_name=True)
