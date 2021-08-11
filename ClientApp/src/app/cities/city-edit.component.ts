import { Component, Inject, OnInit } from '@angular/core';
import { BaseFormComponent } from '../base.form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { City } from './City';
import { CityService } from './city.service';
import { ApiResult } from '../base.service';
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
    private cityService: CityService)
    {
    super();
  }
  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      lat: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)
      ]),
      lon: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)
      ]),
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
      this.cityService.get<City>(this.id).subscribe(result => {
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
    this.cityService.getCountries<ApiResult<Country>>(0, 9999, "name",
      null, null, null,).subscribe(result => { this.countries = result.data; },
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
      this.cityService
        .put<City>(city)
        .subscribe(result => {
          console.log("City " + city.id + " has been updated.");
          // go back to cities view
          this.router.navigate(['/cities']);
        }, error => console.error(error));
    }
    // add
    else {
      this.cityService
        .post<City>(city)
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

      return this.cityService.isDupeCity(city).pipe(map(result => {
        return (result ? { isDupeCity: true } : null);
      }));
    }
  }
}
