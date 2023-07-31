import axios from "axios";

export default async function getRequest(
  id: string
) : Promise<any> {
    const url = `${import.meta.env.VITE_API_URL}/${id}`;

    try {
        const location = await axios.get(url);
        return location.data
    } catch (error) {
        console.log(error);
        return undefined
    }
}