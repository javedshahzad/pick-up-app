import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(
    private network: Network,
    private util:UtilsService
  ) { }
  watchNetwork(){
      // watch network for a disconnection
      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        setTimeout(() => {
          this.util.toast('Network disconnected');
        }, 3000);
      console.log('Network disconnected!');
      });
      // watch network for a connection
let connectSubscription = this.network.onConnect().subscribe(() => {
  console.log('network connected!');
  // We just got a connection but we need to wait briefly
   // before we determine the connection type. Might need to wait.
  // prior to doing any api requests as well.
  setTimeout(() => {
    console.log('We got a connection, woohoo!');
    this.util.toast("Network connected");
  }, 3000);
});
  }
}
