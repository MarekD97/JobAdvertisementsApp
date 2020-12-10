import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import * as moment from 'moment';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  dataList: Array<any>;
  dataAll: Array<any>;
  userList: Array<any>;
  filters: any;
  constructor(public fs: FirebaseService, public router: Router) {
    this.fs.fs.collection('users').valueChanges({idField: 'id'}).subscribe(data => {
      this.userList = data;
    });
    this.fs.getAdvertisements().subscribe((data) => {
      this.dataList = data;
      this.dataAll = data;
      this.dataList.map(item => {
        item.author = this.userList.find(element => element.id === item.userAccountId);
      });
    });
  }

  ngOnInit(): void {
  }

  formatDate(dateToFormat): string {
    moment.locale('pl');
    const date = moment(dateToFormat.toDate());
    return date.format('HH:mm, DD MMMM yyyy');
  }

  // sortData(type: string): void {
  //   switch (type) {
  //     case 'latest': {
  //       this.dataList = this.dataList.sort((a, b) => {
  //         return b.updatedAt - a.updatedAt;
  //       });
  //       break;
  //     }
  //     case 'oldest': {
  //       this.dataList = this.dataList.sort((a, b) => {
  //         return a.updatedAt - b.updatedAt;
  //       });
  //       break;
  //     }
  //     case 'alphabetically': {
  //       this.dataList = this.dataList.sort((a, b) => a.title.localeCompare(b.title));
  //       break;
  //     }
  //     case 'highest': {
  //       this.dataList = this.dataList.sort((a, b) => {
  //         return parseFloat(b.expectedPrice) - parseFloat(a.expectedPrice);
  //       });
  //       break;
  //     }
  //   }
  // }

  // filterCategory(category: string): void {
  //   this.dataList = this.dataAll.filter(item => {
  //     if (category === 'all') {
  //       return item;
  //     } else {
  //       return item.category === category;
  //     }
  //   });
  // }

  // filterAge(age: boolean): void {
  //   if(age) {
  //     this.dataList = this.dataAll.filter(item => {
  //       return item.isAgeOfMajorityRequired !== age;
  //     });
  //   } else {
  //     this.dataList = this.dataAll;
  //   }
  // }

  onFilterChange({searchText, category, age, sort}): void {
    this.dataList = this.dataAll.filter(item => {
      const searchInTitle = item.title.toLowerCase().includes(searchText.toLowerCase());
      const searchInDetail = item.detail.toLowerCase().includes(searchText.toLowerCase());
      const searchInCategory = item.category.toLowerCase().includes(searchText.toLowerCase());
      const searchInPrice = item.expectedPrice.toLowerCase().includes(searchText.toLowerCase());
      return  searchInTitle || searchInDetail || searchInCategory || searchInPrice;
    });
    this.dataList = this.dataList.filter(item => {
      if (category === 'all') {
        return item;
      } else {
        return item.category === category;
      }
    });
    this.dataList = this.dataList.filter(item => {
      if (age) {
        return item.isAgeOfMajorityRequired !== age;
      } else {
        return item;
      }
    });
    this.dataList = this.dataList.sort((a, b) => {
      switch(sort) {
        case 'latest': return b.updatedAt - a.updatedAt;
        case 'oldest': return a.updatedAt - b.updatedAt;
        case 'alphabetically': {
          if(a.title < b.title) { return -1; }
          if(a.title > b.title) { return 1; }
          return 0;
        }
        case 'highest': {
          if(parseFloat(a.expectedPrice) > parseFloat(b.expectedPrice)) { return -1; }
          if(parseFloat(a.expectedPrice) < parseFloat(b.expectedPrice)) { return 1; }
          return 0;
        }
        default: return b.updatedAt - a.updatedAt;
      }
    });

  }

}
