import {
  HttpClient
} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  BehaviorSubject
} from 'rxjs';
import {
  environment
} from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public baseUrl = environment.BaseUrl;
  userData: any;
  public picturesUrlOld = "https://digital-lab.lu/pick-up/admin/user/pics/";
  public picturesUrl = "https://digital-lab.lu/pick-up/admin/app/user/pics/";
  public isupdateData = new BehaviorSubject(true);
  public updatedListings = new BehaviorSubject(true);
  constructor(
      public http: HttpClient
  ) {
      this.userData = JSON.parse(localStorage.getItem("userData"));
  }
  setDriver() {
      this.userData = JSON.parse(localStorage.getItem("userData"));
  }
  loginAuth(phone) {
      return this.http.get(this.baseUrl + "check-num.php?mobile=" + phone);
  }
  getListings(day) {
      return this.http.get(this.baseUrl + "get-vehicles.php?driver_id=" + this.userData?.driver_id + "&token=" + this.userData?.token + "&date=" + day)
  }
  pickupAndBringBack(body) {
      return this.http.post(this.baseUrl + "set-driver.php?driver_id=" + this.userData?.driver_id + "&token=" + this.userData?.token, body)
  }
  getCheckup(vehcileId) {
      return this.http.get(this.baseUrl + "get-check.php?driver_id=" + this.userData?.driver_id + "&token=" + this.userData?.token + "&vehicle_id=" + vehcileId)
  }
  setCheckup(vehcileId, body) {
      return this.http.post(this.baseUrl + "set-check.php?driver_id=" + this.userData?.driver_id + "&token=" + this.userData?.token + "&vehicle_id=" + vehcileId, body)
  }
  getNotes(vehcileId) {
      return this.http.get(this.baseUrl + "get-note.php?driver_id=" + this.userData?.driver_id + "&token=" + this.userData?.token + "&vehicle_id=" + vehcileId)
  }
  SetNote(vehcileId, body) {
      return this.http.post(this.baseUrl + "set-note.php?driver_id=" + this.userData?.driver_id + "&token=" + this.userData?.token + "&vehicle_id=" + vehcileId, body)
  }
  SetNotePictures(vehcileId, body) {
      return this.http.post(this.baseUrl + "set-note-pictures.php?driver_id=" + this.userData?.driver_id + "&token=" + this.userData?.token + "&vehicle_id=" + vehcileId, body)
  }
  SetVehiclePictures(vehcileId, body) {
      return this.http.post(this.baseUrl + "set-vehicle-pictures.php?driver_id=" + this.userData?.driver_id + "&token=" + this.userData?.token + "&vehicle_id=" + vehcileId, body)
  }

  GetDamagedData(vehcileId) {
      return this.http.get(this.baseUrl + "get-vehicle-pictures.php?driver_id=" + this.userData?.driver_id + "&token=" + this.userData?.token + "&vehicle_id=" + vehcileId)
  }
}