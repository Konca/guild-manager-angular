import { Injectable } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

import disc from '../../assets/apiKeys/discordKey.json';
import { CrudService } from './crud.service';
import { ProfileService } from './profile.service';
import { User } from '../shared/user.model';

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
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  public loginStatusChanged = new BehaviorSubject<boolean>(false);

  constructor(
    private crudService: CrudService,
    private profileService: ProfileService
  ) {}

  loginUser() {
    this.loginStatusChanged.next(true);
    this.profileService.getUserProfile();
  }
  logOutUser() {
    this.loginStatusChanged.next(false);
    this.profileService.ngOnDestroy();
  }
  getUserGuildRoleGroups() {}
  authoriseWithDisc(code: string, refresh: boolean = false) {
    let grant = 'authorization_code';
    if (refresh) grant = 'refresh_token';
    const options = {
      url: 'https://discord.com/api/oauth2/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: disc.DISCORD_OAUTH_CLIENT_ID,
        client_secret: disc.DISCORD_OAUTH_SECRET,
        grant_type: grant,
        [refresh ? 'refresh_token' : 'code']: code,
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
  async refreshToken(refreshToken: string) {
    const response = await this.authoriseWithDisc(refreshToken, true);
    const tokens: {
      RefreshToken: string;
      AccessToken: string;
      ExpiresIn: string;
    } = {
      RefreshToken: response.refresh_token,
      AccessToken: response.access_token,
      ExpiresIn: response.expires_in,
    };
    return tokens;
  }
  async autoLogin() {
    let anyChanges = false;
    const userData: User = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return false;
    userData.ExpiresOn = Timestamp.fromMillis(
      +userData.ExpiresOn['seconds'] * 1000
    );
    if (userData.ExpiresOn < Timestamp.fromMillis(Date.now())) {
      const newTokens = await this.refreshToken(userData.RefreshToken);
      userData.RefreshToken = newTokens.RefreshToken;
      userData.AccessToken = newTokens.AccessToken;
      userData.ExpiresOn = Timestamp.fromMillis(
        Date.now() + +newTokens.ExpiresIn * 1000
      );
      anyChanges = true;
    }

    const guildInfo = await this.getAuthUserGuilds(userData.AccessToken);
    const readFSUserData = await this.crudService.readUserOnce(userData.Id);
    const botGuilds = await this.readBotGuilds();
    const guildDataForUpload = await this.sortMemberRanks(
      guildInfo,
      botGuilds,
      userData.Id
    );
    this.crudService.uploadUserGuildData(guildDataForUpload, userData.Id);
    if (userData.SelectedGuildId !== readFSUserData.data()['SelectedGuildId']) {
      userData.SelectedGuildId = readFSUserData.data()['SelectedGuildId'];
      userData.SelectedGuildName = readFSUserData.data()['SelectedGuildName'];
      anyChanges = true;
    }
    if (!guildDataForUpload[userData.SelectedGuildId]) {
      userData.SelectedGuildId =
        botGuilds[Object.keys(guildDataForUpload)[0]].Id;
      userData.SelectedGuildName =
        botGuilds[Object.keys(guildDataForUpload)[0]].Name;
      anyChanges = true;
    }
    if (anyChanges) {
      this.crudService.uploadUser(userData.Id, userData);
      localStorage.setItem('userData', JSON.stringify(userData));
    }

    await this.crudService.readUser(userData.Id);
    await this.crudService.readUserGuilds(userData.Id);
    await this.crudService.readGuildData(userData.SelectedGuildId);
    this.loginUser();
    return true;
  }
  async getAuthUserData(loginInfo: LoginInfo) {
    const userInfo = await this.getAuthUserInfo(loginInfo.access_token);
    const guildInfo = await this.getAuthUserGuilds(loginInfo.access_token);
    if (Object.keys(guildInfo).length === 0)
      return 'No Discord Servers found matching this user. \nAuthetification cancelled.';
    const botGuilds = await this.readBotGuilds();
    const guildDataForUpload = await this.sortMemberRanks(
      guildInfo,
      botGuilds,
      userInfo.id
    );
    if (Object.keys(guildDataForUpload).length === 0)
      return 'No Discord Servers that are using the bot found matching this user. \nAuthetification cancelled.';
    const userdataForUpload = {
      Email: userInfo.email,
      Discriminator: userInfo.discriminator,
      Id: userInfo.id,
      UserName: userInfo.username,
      AccessToken: loginInfo.access_token,
      ExpiresOn: Timestamp.fromMillis(
        Date.now() + +loginInfo.expires_in * 1000
      ),
      SelectedGuildId: botGuilds[Object.keys(guildDataForUpload)[0]].Id,
      SelectedGuildName: botGuilds[Object.keys(guildDataForUpload)[0]].Name,
      RefreshToken: loginInfo.refresh_token,
    };
    this.crudService.uploadUser(userInfo.id, userdataForUpload);
    this.crudService.uploadUserGuildData(guildDataForUpload, userInfo.id);
    await this.crudService.readUser(userInfo.id);
    await this.crudService.readUserGuilds(userInfo.id);
    await this.crudService.readGuildData(userInfo.SelectedGuildId);
    localStorage.setItem('userData', JSON.stringify(userdataForUpload));
    this.loginUser();
    return false;
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
