import {Component, QueryList, ViewChildren, OnInit} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray, UntypedFormControl, Validators } from '@angular/forms';


import { userListModel } from './userlist.model';
import { userList } from './data';
import { userListService } from './userlist.service';
import { NgbdUserListSortableHeader, SortEvent } from './userlist-sortable.directive';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss'],
  providers: [userListService, DecimalPipe]
})

/**
 * Contacts user-list component
 */
export class UserlistComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  users: any;
  // Table data
  contactsList!: Observable<userListModel[]>;
  total: Observable<number>;
  @ViewChildren(NgbdUserListSortableHeader) headers!: QueryList<NgbdUserListSortableHeader>;

  // constructor(){}

  constructor(private modalService: BsModalService,
    public service: userListService, private formBuilder: UntypedFormBuilder, private dataService:DataService) {
    this.contactsList = service.countries$;
    this.total = service.total$;        
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Contacts' }, { label: 'Users List', active: true }];
    this.initialize();
  }
  initialize(): void {
    //CHARGEMENT DES PROJETS
    this.dataService.getUsers()
      .subscribe((data:any) => 
      {
        console.log(data.items);
        this.users = data.items;
      }
    );

  }
  
}
