import { Injectable } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

import disc from '../../assets/apiKeys/discordKey.json';
import { CrudService } from './crud.service';
import { ProfileService } from './profile.service';

export interface LoginInfo {
  email: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}
export interface Guilds {
  [id: string]: { Id: string; Name: string; Server: string };
}
export interface User {}
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  public loginStatusChanged = new BehaviorSubject<boolean>(false);

  constructor(private crudService: CrudService, private profileService:ProfileService) {}

  loginUser(id: string) {
    this.loginStatusChanged.next(true);
    this.profileService.getUserProfile()
  }
  logOutUser(id: string) {
    this.loginStatusChanged.next(false);
  }
  authoriseWithDisc(code: string) {
    const options = {
      url: 'https://discord.com/api/oauth2/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: disc.DISCORD_OAUTH_CLIENT_ID,
        client_secret: disc.DISCORD_OAUTH_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: disc.DISCORD_REDIRECT_URL,
      }).toString(),
    };
    return fetch('https://discord.com/api/oauth2/token', options).then(
      (res) => {
        return res.json().then((response) => {
          return response;
        });
      }
    );
  }
  async getAuthUserData(loginInfo: LoginInfo) {
    const userInfo = await this.getAuthUserInfo(loginInfo.access_token);

    const guildInfo = await this.getAuthUserGuilds(loginInfo.access_token);
    const botGuilds = await this.readBotGuilds();
    const guildDataForUpload = await this.sortMemberRanks(
      guildInfo,
      botGuilds,
      userInfo.id
    );
    const userdataForUpload = {
      Email: userInfo.email,
      Discriminator: userInfo.discriminator,
      Id: userInfo.id,
      UserName: userInfo.username,
      AccessToken: loginInfo.access_token,
      ExpiresOn: Timestamp.fromMillis(
        Date.now() + +loginInfo.expires_in * 1000
      ),SelectedGuildId:botGuilds[Object.keys(botGuilds)[0]].Id,
      SelectedGuildName:botGuilds[Object.keys(botGuilds)[0]].Name,
      RefreshToken: loginInfo.refresh_token,

    };
    this.crudService.uploadUser(userInfo.id, userdataForUpload);
    this.crudService.uploadUserGuildData(guildDataForUpload, userInfo.id);
    await this.crudService.readUser(userInfo.id)
    await this.crudService.readUserGuilds(userInfo.id)
    this.loginUser(userInfo.id);
  }

  async sortMemberRanks(guildInfo, botGuilds, id) {
    const guildDataForUpload = {};
    await Promise.all(
      guildInfo.map(async (element) => {
        if (botGuilds[element.id]) {
          const role = await this.readGuildMembers(element.id, id);
          guildDataForUpload[element.id] = {
            Id: botGuilds[element.id].Id,
            Rank: role,
            Name: botGuilds[element.id].Name,
            Server: botGuilds[element.id].Server,
          };
        }
      })
    );
    return guildDataForUpload;
  }

  async getAuthUserInfo(accessToken: string) {
    const userInfoUnparsed = await fetch(
      'https://discord.com/api/v8/users/@me',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const userInfo = await userInfoUnparsed.json();

    return userInfo;
  }
  async getAuthUserGuilds(accessToken: string) {
    const guildInfoUnparsed = await fetch(
      'https://discord.com/api/v8/users/@me/guilds',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const guildInfo = await guildInfoUnparsed.json();

    return guildInfo;
  }

  async readBotGuilds() {
    const botGuildsDoc = await (
      await this.crudService.readGuildsListData()
    ).data();
    return botGuildsDoc;
  }
  async readGuildMembers(guildId, memberId) {
    const members = await (
      await this.crudService.readGuildMembers(guildId)
    ).data();
    return members[memberId].Role;
  }
}
