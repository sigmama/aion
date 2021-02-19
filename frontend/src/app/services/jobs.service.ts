import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.siteUrl}:4000/api`;
  }

  getAvailableJobs(): Observable<any> {
    return this.http.get(`${this.baseUrl}/jobs`);
  }

  getCronInstances(): Observable<any> {
    return this.http.get(`${this.baseUrl}/job-instances/cron`);
  }

  getSystems(): Observable<any> {
    return this.http.get(`${this.baseUrl}/systems`);
  }

  scheduleCronJobInstance(job): Observable<any> {
    return this.http.post(`${this.baseUrl}/job-instances/cron`, job);
  }

  scheduleImmediateJobInstance(job): Observable<any> {
    return this.http.post(`${this.baseUrl}/job-instances/immediate`, job);
  }

  cancelCronJobInstance(id) {
    return this.http.delete(`${this.baseUrl}/job-instances/cron/${id}`);
  }
}
