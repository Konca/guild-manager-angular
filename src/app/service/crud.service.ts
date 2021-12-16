import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { lastValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CrudService {
  constructor(private firestore: AngularFirestore) {}

  uploadGuildData(record) {
    return this.firestore.collection('guilds').doc('123').set(record);
  }
  readGuildsListData() {
    return lastValueFrom(this.firestore.collection("guilds").get())
  }
  readRaidsListData(guildId:string){
    return lastValueFrom(this.firestore.collection("guilds").doc(guildId).collection("raids").get())
  }
  readSelectedRaidData(guildId:string,raidId:string){
    return lastValueFrom(this.firestore.collection("guilds").doc(guildId).collection("raids").doc(raidId).get())
  }
}
