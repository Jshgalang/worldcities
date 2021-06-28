import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { City } from './city';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})

export class CitiesComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'lat', 'lon'];  
  public cities: City[];

  constructor(private hthtp: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
  }

  ngOnInit(){
    this.hthtp.get<City[]>(this.baseUrl + 'api/Cities').subscribe(result => {
      this.cities = result;
    }, error => console.error(error));
  }
}
