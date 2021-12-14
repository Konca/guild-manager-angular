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
  readGuildData() {
    return lastValueFrom(this.firestore.collection("guilds").get())
  }
  readRaidData(guildId){
    return lastValueFrom(this.firestore.collection("guilds").doc(guildId).collection("raids").get())
  }
}
