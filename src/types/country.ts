export type Country = {
  name: string;
  code: string;
  dial_code: string;
};

export type CountryListResponse = {
  success: boolean;
  message: string;
  data: Country[];
};
