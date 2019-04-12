import { Inject, Service } from "typedi";
import ConnectorInterface from "../interface";
import HttpService from "../../service/http";

@Service()
export default class AuthConnector implements ConnectorInterface {
  @Inject("settings")
  settings: any;

  @Inject()
  httpService: HttpService;

  getUser(token: string) {
    return this.httpService.get(`${this.settings.AuthUrl}/authorize`, {
      headers: {
        Authorization: token
      }
    });
  }

  async connect() {
    const { status } = await this.httpService.get(`${this.settings.AuthUrl}/system/info`);

    if (status === 'OK') {
      return Promise.resolve();
    }

    return Promise.reject();
  }
}
