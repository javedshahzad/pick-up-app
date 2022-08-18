import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  isConnctedNetwork:boolean;
  constructor(
    private network: Network,
    private util:UtilsService
  ) { }
  watchNetwork(){
      // watch network for a disconnection
     this.network.onDisconnect().subscribe(() => {
      this.isConnctedNetwork=false;
        setTimeout(() => {
          this.util.toast('Network disconnected');
        }, 3000);
      console.log('Network disconnected!');
      });
      // watch network for a connection
 this.network.onConnect().subscribe(() => {
  this.isConnctedNetwork=true;
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
