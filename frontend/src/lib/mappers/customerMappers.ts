import { AresCompany } from '@/types/aresCompany';
import { Customer } from '@/types/customer';

export const mapAresDataToCustomer = (aresData: AresCompany): Customer => {
  return {
    id: null,
    email: "",
    name: aresData.name,
    vatId: aresData.ico,
    dicId: aresData.dic,
    city: aresData.residence.city,
    country: aresData.residence.state,
    street: `${aresData.residence.street} ${aresData.residence.houseNumber}${aresData.residence.referenceNumber ? `/${aresData.residence.referenceNumber}` : ''}`,
    postalCode: aresData.residence.zipCode.toString()
  };
};
