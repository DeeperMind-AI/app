import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ChartType } from './jobs.model';
import { ressourcesChart, QueriesChart, SizeOnDiskChart, RejectedChart, fileTypePie} from './data';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})

/**
 * Jobs Component
 */
export class JobsComponent implements OnInit {

  constructor(private http: HttpClient,private loaderService:LoaderService,) { }

  uri = environment.tradBotServer;


  ressourcesChart: ChartType;
  QueriesChart: ChartType;
  SizeOnDiskChart: ChartType;


  RejectedChart:ChartType;
  emailSentBarChart: ChartType;
  showNavigationArrows: any;
  showNavigationIndicators: any;
  vacancyData;
  receivedTimeChart:ChartType;
  recentJobsData;

  ngOnInit(): void {
    //this.loaderService.isLoading.subscribe((v) => {
      this._fetchData();
    //});
  }

  private _fetchData() {

    
    
    this.SizeOnDiskChart = SizeOnDiskChart;
    this.RejectedChart = RejectedChart;
    this.emailSentBarChart = fileTypePie;

    const ask$ = this.http.post(this.uri+"getDashboard",{ownerUID:JSON.parse(localStorage.getItem('currentUser'))["email"]}).pipe(
        map((result:any) => {
          console.log(result);
          ressourcesChart.count = result.sumMetas;
          ressourcesChart.series[0].data = result.graphmetas;
          this.ressourcesChart = ressourcesChart;    
          //
          QueriesChart.count = result.sumQueries;
          QueriesChart.series[0].data = result.graphQueries;    
          this.QueriesChart = QueriesChart;    
          //
          SizeOnDiskChart.count = result.fullDiskUsage;
          SizeOnDiskChart.series[0].data = result.graphDiskUsage;    
          this.SizeOnDiskChart = SizeOnDiskChart;    

          fileTypePie.series = [];
          fileTypePie.labels = [];

          for(var reliStats=0;reliStats<result.graphFileType.length;reliStats++)
          {
            fileTypePie.series.push(result.graphFileType[reliStats].count);
            fileTypePie.labels.push(result.graphFileType[reliStats]._id);
          }

        }), 
          catchError(err => throwError(err))
        )
        ask$.subscribe();

    
  }

}
