import {Inject, Service} from "typedi";
import HttpService from "../../service/http";

@Service()
export default class UserService {
  @Inject("settings")
  settings: any;

  @Inject()
  httpService: HttpService;

  getUser(userId: number) {
    return this.httpService.get(`${this.settings.AuthUrl}/user/${userId}`);
  }

  search(userIds: number[]) {
    return this.httpService.post(`${this.settings.AuthUrl}/user/search`, {
      userIds,
    });
  }
}
