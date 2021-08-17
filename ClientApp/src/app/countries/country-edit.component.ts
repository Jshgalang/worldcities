import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseFormComponent } from '../base.form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Country } from './../countries/Country';
import { CountryService } from './country.service';
import { ApiResult } from '../base.service';


@Component({
  selector: 'app-country-edit',
  templateUrl: './country-edit.component.html',
  styleUrls: ['./country-edit.component.css']
})
export class CountryEditComponent extends BaseFormComponent implements OnInit {
  // the view title
  title: string;
  // the form model
  form: FormGroup;
  // the country object to edit
  country: Country;
  // city object id, fetched from the active route
  // null when adding a new city;
  // not null if editing an existing city;
  id?: number;
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private countryService: CountryService) {
    super();
    this.loadData();
  }
  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required, this.isDupeField("name")],
      iso2: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]{2}$/)], this.isDupeField("iso2")],
      iso3: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]{3}$/)], this.isDupeField("iso3")]
    });
    this.loadData();
  }
  loadData() {
    // load countries
    //this.loadCountries();
    // retrieve the ID from the 'id' parameter
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');

    // edit mode
    if (this.id) {
      // fetch the country from the server
      this.countryService.get<Country>(this.id).subscribe(result => {
        this.country = result;
        this.title = "Edit - " + this.country.name //+ this.country.id + this.country.ISO3
        // update the form with the country value
        this.form.patchValue(this.country);
        //this.form.patchValue({
        //  name: this.country.name,
        //  iso2: this.country.ISO2,
        //  iso3: this.country.ISO3,
        //});
      }, error => console.error(error));
    }
    // add new country mode
    else {
      this.title = "Create a new country";
    }
  }
  onSubmit() {
    var country = (this.id) ? this.country : <Country>{};
    country.name = this.form.get("name").value;
    country.iso2 = this.form.get("iso2").value;
    country.iso3 = this.form.get("iso3").value;
    // edit mode
    if (this.id) {
      this.countryService
        .put<Country>(country)
        .subscribe(result => {
          console.log("Country" + country.id + " has been updated.");
          // go back to countries view
          this.router.navigate(['/countries']);
        }, error => console.error(error));
    }
    // add
    else {
      this.countryService
        .post<Country>(country)
        .subscribe(result => {
          console.log("Country " + result.id + " has been created.");
          // go back to countries view
          this.router.navigate(['/countries']);
        }, error => console.error(error));
    }
  }
  isDupeField(fieldName: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {

      var countryId = (this.id) ? this.id.toString() : "()";

      return this.countryService.isDupeField(
        countryId)
        // fieldName,
        // control.value)
        .pipe(map(result => {
          return (result ? { isDupeField: true } : null);
        }));
    }
  }
}
