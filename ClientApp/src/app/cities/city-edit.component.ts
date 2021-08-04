import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseFormComponent } from '../base.form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { City } from './City';
import { Country } from './../countries/Country';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.css']
})
export class CityEditComponent extends BaseFormComponent implements OnInit {
  // the view title
  title: string;
  // the form model
  form: FormGroup;
  // the city object to edit
  city: City;
  // city object id, fetched from the active route
  // null when adding a new city;
  // not null if editing an existing city;
  id?: number;
  // countries array for select element in component
  countries: Country[];
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
    super();
  }
  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      lat: new FormControl('', Validators.required),
      lon: new FormControl('', Validators.required),
      countryId: new FormControl('', Validators.required)
    });
    this.loadData();
  }
  loadData() {
    // load countries
    this.loadCountries();
    // retrieve the ID from the 'id' parameter
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');

    // edit mode
    if (this.id) {
      // fetch the city from the server
      var url = this.baseUrl + "api/Cities/" + this.id;
      this.http.get<City>(url).subscribe(result => {
        this.city = result;
        this.title = "Edit - " + this.city.name;
        // update the form with the city value
        this.form.patchValue(this.city);
      }, error => console.error(error));
    }
    // add new city mode
    else {
      this.title = "Create a new city";
    }
  }
  loadCountries() {
    // fetch all the countries from server
    var url = this.baseUrl + "api/Countries";
    var params = new HttpParams().set("pageIndex", "0")
      .set("pageSize", "300")
      .set("sortColumn", "name");
    this.http.get<any>(url, { params }).subscribe(result => { this.countries = result.data; },
      error => console.error(error));
  }
  onSubmit() {
    var city = (this.id) ? this.city : <City>{};
    city.name = this.form.get("name").value;
    city.lat = +this.form.get("lat").value;
    city.lon = +this.form.get("lon").value;
    city.countryId = +this.form.get("countryId").value;
    // edit mode
    if (this.id) {
      var url = this.baseUrl + "api/Cities/" + this.city.id;
      this.http
        .put<City>(url, city)
        .subscribe(result => {
          console.log("City " + city.id + " has been updated.");
          // go back to cities view
          this.router.navigate(['/cities']);
        }, error => console.error(error));
    }
    // add
    else {
      var url = this.baseUrl + "api/Cities";
      this.http
        .post<City>(url, city)
        .subscribe(result => {
          console.log("City " + result.id + " has been created.");
          // go back to cities view
          this.router.navigate(['/cities']);
        }, error => console.error(error));
    }
  }
  isDupeCity(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {

      var city = <City>{};
      city.id = (this.id) ? this.id : 0;
      city.name = this.form.get("name").value;
      city.lat = +this.form.get("lat").value;
      city.lon = +this.form.get("lon").value;
      city.countryId = +this.form.get("countryId").value;

      var url = this.baseUrl + "api/Cities/IsDupeCity";
      return this.http.post<boolean>(url, city).pipe(map(result => {
        return (result ? { isDupeCity: true } : null);
      }));
    }
  }
}
