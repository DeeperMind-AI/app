import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })

export class DataService {


    constructor(private http: HttpClient) {
    }

    

    /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */
    getProjects() {
        return this.http.post(environment.ekitServer + '/projects/getLibs/'+"fr", {});
    }

    getUsers() {
        return this.http.get(environment.ekitServer + '/users/find/');
    }
    
}

