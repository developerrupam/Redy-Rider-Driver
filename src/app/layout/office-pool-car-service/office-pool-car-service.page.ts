import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { LoginRegisterService } from '../../core/services/login-register.service';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ToasterService } from '../../core/services/toaster.service';
import { Device } from '@ionic-native/device/ngx';
import { ModalService } from '../../core/services/modal.service';
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { LoadingService } from '../../core/services/loading.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';

declare var google;
@Component({
  selector: 'app-office-pool-car-service',
  templateUrl: './office-pool-car-service.page.html',
  styleUrls: ['./office-pool-car-service.page.scss'],
})
export class OfficePoolCarServicePage implements OnInit {
  form: FormGroup;
  net_connection_check: boolean = false;
  select_pickup_location: any;
  select_drop_location: any;
  userId: string;
  minDate = new Date().toISOString();
  maxDate: any;
  myDate = new Date().toISOString();
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  geoAddress: string;
  today = new Date();
  myReturnDate = new Date().toISOString();
  roundTripDiv: boolean = false;
  singleTripDiv: boolean = false;
  constructor(
    private loginRegisterService: LoginRegisterService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private device: Device,
    public modalService: ModalService,
    public office_pool_car_service_event: Events,
    public storage: Storage,
    private loadingService: LoadingService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
  ) {


    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(resp => {
      console.log('resp', resp)
      this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  ionViewDidEnter() {
    //console.log('check.................')
    this.storage.get('select_location').then((val) => {
      //console.log('select_location_11', val)
      if (val) {
        this.select_pickup_location = val['pickup_location'];
        this.select_drop_location = val['drop_location'];
      }
    });
    this.storage.get('USER_INFO').then((val) => {
      //console.log('USER_INFO', val)
      this.userId = val.id;
    });

  }
  ngOnInit() {
    this.office_pool_car_service_event.subscribe('check_net_connection', (data) => {
      if (data == 'connect') this.net_connection_check = false;
      if (data == 'disconnect') this.net_connection_check = true;
    });
    this.maxDate = this.today.getFullYear() + 1;
    this.form = this.formBuilder.group({
      pick_up: ['', Validators.required],
      drop_off: ['', Validators.required],
      trip: ['', Validators.required],
      journey_date: [''],
      return_date: ['']
    });

  }
  //geocoder method to fetch address from coordinates passed as arguments
  getGeoencoder(latitude, longitude) {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.select_pickup_location = this.generateAddress(result[0]);
      })
      .catch((error: any) => {
        alert('Error getting location' + JSON.stringify(error));
      });
  }

  //Return Comma saperated address
  generateAddress(addressObj) {
    let obj = [];
    let address = "";
    for (let key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if (obj[val].length)
        address += obj[val] + ', ';
    }
    return address.slice(0, -2);
  }
  savaData() {
    let route_search_parameters = {
      'user_id': this.userId,
      'type': 'src',
      'pickup_location': this.form.value.pick_up,
      'drop_location': this.form.value.drop_off,
      'single_or_round': this.form.value.trip,
      'traval_date': this.form.value.journey_date,
      'traval_time': '',
      'return_date': this.form.value.return_date,
      'return_time': '',
      'cars_details': []
      // 'car_id': '',
      // 'route_master_id': ''
    };
    //console.log('route_search_parameters', route_search_parameters);
    this.storage.set('route_search_parameters', route_search_parameters);
    //this.loadingService.present();
    this.router.navigateByUrl('bus-route-details');
    //this.loadingService.dismiss();
  }
  openSearchPage(type: any) {
    this.router.navigate(['search-location', { type: type }]);
  }
  changeLocation(c_pickup_location, c_drop_location) {
    //console.log('checkkkkkkkkkkkkkkk');
    this.select_drop_location = c_pickup_location;
    this.select_pickup_location = c_drop_location;
    this.storage.get('select_location').then((val) => {
      if (val != null) {
        //console.log('ifeeeeeeeeeeeee')
        let val1 = val;
        val1['pickup_location'] = c_drop_location;
        this.storage.set('select_location', val1)
        val1['drop_location'] = c_pickup_location;
        this.storage.set('select_location', val1);

      }
    });
  }
  tripSelect(trip_val) {
    console.log('trip_val', trip_val)
    if (trip_val == '1') {
      this.roundTripDiv = true;
      this.singleTripDiv = true;
    } else {
      this.roundTripDiv = false;
      this.singleTripDiv = true;
    }
  }
}
