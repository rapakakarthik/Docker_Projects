import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, OnInit } from "@angular/core";
declare var rec_embed_js: {
  load: (config: {
    widget_id: string;
    page_name: string;
    source: string;
    site: string;
    empty_job_msg: string;
  }) => void;
};
@Component({
  selector: "app-careers",
  templateUrl: "./careers.component.html",
  styleUrls: ["./careers.component.scss"],
})
export class CareersComponent implements OnInit, AfterViewInit {
  jobListings: any[] = [];
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    // this.loadJobListings();
    // Code executed during component initialization
    rec_embed_js.load({
      widget_id: "rec_job_listing_div",
      page_name: "Careers",
      source: "CarrerSite",
      site: "https://myverkoper.zohorecruit.in",
      empty_job_msg: "No current Openings",
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      const jobTitles = document.querySelectorAll(".rec-job-title a");
      console.log(jobTitles);
      jobTitles.forEach((title) => {
        console.log(title);
        title.addEventListener("click", this.openJobInNewTab.bind(this));
      });
    }, 1000);
  }
  openJobInNewTab(event: Event): void {
    event.preventDefault();
    const jobURL = (<HTMLAnchorElement>event.target).href;
    window.open(jobURL, "_blank");
  }

  loadJobListings(): void {
    const apiUrl =
      "https://recruit.zoho.com/recruit/private/json/JobOpenings/searchRecords";
    const sortColumn = "Created Time";
    const sortOrder = "desc";

    const requestParams = {
      sortColumn: sortColumn,
      sortOrder: sortOrder,
      // Add any other necessary parameters for your request
    };

    this.http
      .get(apiUrl, { params: requestParams })
      .subscribe((response: any) => {
        this.jobListings = response.response.result.JobOpenings;
        console.log(response);
      });
  }
}
