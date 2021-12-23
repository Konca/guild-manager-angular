import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from 'firebase/firestore';
import { lastValueFrom, Observable, map } from 'rxjs';

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
export interface Article {
  title: string;
  img: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  constructor(private firestore: AngularFirestore) {}
  raids$: Observable<Raid[]>;

  uploadGuildData(record) {
    return this.firestore.collection('guilds').doc('123').set(record);
  }
  readGuildsListData() {
    return lastValueFrom(this.firestore.collection('guilds').get());
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
            return data ;
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
