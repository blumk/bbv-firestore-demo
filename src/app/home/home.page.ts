import { Component } from "@angular/core";
import { map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  rooms: Room[];
  savingRoomId: string;

  constructor(public firestore: AngularFirestore) {
    this.firestore
      .collection<Room>("/rooms")
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as Room;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      )
      .subscribe((rooms) => {
        this.rooms = rooms;
      });
  }

  async update(id: string, room: Room) {
    const doc = this.firestore.collection<Room>("/rooms").doc<Room>(id);
    await doc.update({ occupancy: room.occupancy });

    this.savingRoomId = id;
    setTimeout(() => {
      this.savingRoomId = null;
    }, 2000);
  }
}
