from pydantic import BaseModel
from pydantic import ConfigDict
from pydantic import Field


class AresResidence(BaseModel):
    state: str | None = Field(alias="nazevStatu")
    city: str | None = Field(alias="nazevObce")
    city_part: str | None = Field(alias="nazevCastiObce")
    street: str | None = Field(alias="nazevUlice")
    zip_code: int | None = Field(alias="psc", default=None)
    house_number: int | None = Field(alias="cisloDomovni", default=None)
    reference_number: int | None = Field(alias="cisloOrientacni", default=None)
    full_address: str | None = Field(alias="textovaAdresa")

    model_config = ConfigDict(populate_by_name=True)


class AresEconomicSubject(BaseModel):
    id: str | None = Field(alias="ico")
    dic: str | None = Field(alias="dic", default=None)
    name: str | None = Field(alias="obchodniJmeno")
    residence: AresResidence | None = Field(alias="sidlo")

    model_config = ConfigDict(populate_by_name=True)
