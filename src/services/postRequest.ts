import axios, { AxiosResponse } from "axios";

export default async function postRequest(
  requestObj: RequestObj
): Promise<RequestResponse | undefined> {
  const url = `${import.meta.env.VITE_API_URL}/`;
  try {
    const request: AxiosResponse<RequestResponse> = await axios.post(
      url,
      requestObj
    );
    if (request.data) {
      return {...request.data, status: request.status}
    }
    return undefined
  } catch (error) {
    console.log(error);
    alert("Ooops"); //TODO handle error
    return undefined
  }
}

export type RequestObj = {
  providerId?: String;
  email: String;
  country?: String;
  phone?: String;
  requestIdentifier?: String;
  notificationSMS?: Boolean;
};

export type RequestResponse = {
  id: string;
  provider: string;
  url: string;
  country: string;
  lang: string;
  status: number
};
