import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import {
  NavController
} from '@ionic/angular';

@Component({
  selector: 'app-photo-step1',
  templateUrl: './photo-step1.page.html',
  styleUrls: ['./photo-step1.page.scss'],
})
export class PhotoStep1Page implements OnInit {
  data: any;
  vehicleDetails: any;

  constructor(
      private active: ActivatedRoute,
      private nav: NavController
  ) {
      this.active.queryParams.subscribe((res: any) => {
          this.vehicleDetails = res.data;
      })

  }

  ngOnInit() {}
  damagedCar(eve) {
      this.data = eve;;
  }
  photoStep2() {
      this.nav.navigateForward("/photo-step2", {
          queryParams: {
              data: this.data,
              vehicleDetails: this.vehicleDetails
          }
      });
  }
}