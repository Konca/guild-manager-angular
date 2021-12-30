import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from 'firebase/firestore';
import { lastValueFrom, Observable, map, merge } from 'rxjs';

import { User } from '../shared/user.model';
export interface GuildData {
  Id: string;
  Name: string;
  Roles: { Id: string; Name: string }[];
  Server: string;
}
export interface Guild {
  Id: string;
  Name: string;
  Rank: string;
  Server: string;
}
export interface Guilds {
  [id: string]: Guild;
}
export interface Raid {
  CreatorId: string;
  CreatorName: string;
  Date: Timestamp;
  Description: string;
  Id: string;
  Name: string;
  SortedRaids: SortedRaids;
}
export interface SortedRaids {
  RaidInfo: { [raidNum: string]: string };
  SortedRaids: {
    [playerNum: string]: {
      AssignedTo: string;
      Class: string;
      Id: string;
      Name: string;
      Role: string;
      Spec: string;
      Status: string;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  constructor(private firestore: AngularFirestore) {}
  raids$: Observable<Raid[]>;
  user$: Observable<User>;
  guildData$: Observable<GuildData>;
  usersGuilds$: Observable<Guilds>;

  uploadGuildData(record) {
    return this.firestore.collection('guilds').doc('123').set(record);
  }
  readGuildMembers(guildId) {
    return lastValueFrom(
      this.firestore
        .collection('guilds')
        .doc(guildId)
        .collection('members')
        .doc('AllMembers')
        .get()
    );
  }
  uploadUserGuildData(data, id) {
    return this.firestore
      .collection('users')
      .doc(id)
      .collection('guilds')
      .doc('Guilds')
      .set(data);
  }
  readGuildsListData() {
    return lastValueFrom(
      this.firestore.collection('guilds').doc('AllGuilds').get()
    );
  }
  uploadUser(userId, data) {
    return this.firestore
      .collection('users')
      .doc(userId)
      .set(data, { merge: true });
  }
  readUser(userId: string) {
    this.user$ = this.firestore
      .collection('users')
      .doc<User>(userId)
      .valueChanges();
  }
  readGuildData(guildId: string) {
    this.guildData$ = this.firestore
      .collection('guilds')
      .doc<GuildData>(guildId)
      .valueChanges();
  }
  readUserGuilds(userId: string) {
    this.usersGuilds$ = this.firestore
      .collection('users')
      .doc(userId)
      .collection('guilds')
      .doc<Guilds>('Guilds')
      .valueChanges();
  }
  readRaidsListData(guildId: string) {
    this.raids$ = this.firestore
      .collection('guilds')
      .doc(guildId)
      .collection<Raid>('raids')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Raid;
            return data;
          })
        )
      );
  }
  uploadSelectedRaidData(guildId, raidId, data) {
    return this.firestore
      .collection('guilds')
      .doc(guildId)
      .collection('raids')
      .doc(raidId)
      .set(data, { merge: true });
  }
  uploadGuildRoles(guildId, data) {
    return this.firestore
      .collection('guilds')
      .doc(guildId)
      .set(data, { merge: true });
  }
  readSelectedRaidData(guildId: string, raidId: string) {
    return lastValueFrom(
      this.firestore
        .collection('guilds')
        .doc(guildId)
        .collection('raids')
        .doc(raidId)
        .get()
    );
  }
}
