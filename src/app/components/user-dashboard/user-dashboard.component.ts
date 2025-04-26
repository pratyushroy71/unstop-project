
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService, User } from '../../services/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Chart, ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, PieController } from 'chart.js';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  users: User[] = [];
  displayedUsers: User[] = []; 
  currentPage: number = 0;
  pageSize: number = 2; 

  chart: Chart | undefined;
  @ViewChild('addUserButton') addUserButton!: ElementRef;

  constructor(private userService: UserService, private dialog: MatDialog) {}

  ngOnInit() {
    Chart.register(ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, PieController);

    this.userService.users$.subscribe(users => {
      this.users = users;
      this.updateChart();
      this.updateDisplayedUsers(); 
    });
  }

  openAddUser() {
    const buttonPosition = this.addUserButton.nativeElement.getBoundingClientRect();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.position = {
      top : '10px'
    };
    dialogConfig.width = '400px'
  
    const dialofRef  = this.dialog.open(UserFormComponent,dialogConfig)
    dialofRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.addUser(result);
        this.updateChart();
        this.updateDisplayedUsers();
      }
    });
  }

  updateChart() {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    const roles = { Admin: 0, Editor: 0, Viewer: 0 };
    this.users.forEach(user => roles[user.role]++);

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Admin', 'Editor', 'Viewer'],
        datasets: [{
          data: [roles.Admin, roles.Editor, roles.Viewer],
          backgroundColor: ['#383838', '#1c4980', '#7ca1ff'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: { enabled: true },
          legend: { position: 'top' }
        }
      }
    });
  }

  updateDisplayedUsers() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedUsers = this.users.slice(startIndex, endIndex);
  }

  nextPage() {
    if ((this.currentPage + 1) * this.pageSize < this.users.length) {
      this.currentPage++;
      this.updateDisplayedUsers();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedUsers();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.users.length / this.pageSize);
  }
}
