type AresCompanyResidence = {
  city: string,
  cityPart: string,
  fullAddress: string,
  houseNumber: number,
  referenceNumber: number,
  state: string,
  street: string,
  zipCode: number
}

export type AresCompany = {
  dic: string,
  ico: string,
  name: string,
  residence: AresCompanyResidence
}
