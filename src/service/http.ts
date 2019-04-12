import axios from 'axios';
import { Service } from "typedi";

@Service()
export default class HttpService {
  async get(url: string, config?: any) {
    const response = await axios.get(url, config);

    return response.data;
  }

  async post(url: string, body: any, config?: any) {
    const response = await axios.post(url, body, config);

    return response.data;
  }

  async put(url: string, body: any, config?: any) {
    const response = await axios.put(url, body, config);

    return response.data;
  }

  async delete(url: string, config?: any) {
    const response = await axios.delete(url, config);

    return response.data;
  }
}
