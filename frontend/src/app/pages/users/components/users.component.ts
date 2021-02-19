import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'ngx-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  userFilter = '';
  rowsOnPage = 10;
  @Input() loggedAccount: any;
  @Input() users: any[];
  @Input() allRoles: string[];
  @Input() allSystems: string[];
  @Output() handleUserModalOpen = new EventEmitter<any>();
  @Output() handleUserDeletion = new EventEmitter<string>();

  showUserModal(mode, eid) {
    let selectedUser: any = {};
    if (mode === 'add') {
      selectedUser = {
        userEid: '',
        role: null,
        systems: [],
        isActive: true,
      };
    } else {
      selectedUser = this.users.find((u) => u.userEid === eid);
    }

    this.handleUserModalOpen.emit({
      mode,
      selectedUser,
      loggedAccount: this.loggedAccount,
      allRoles: this.allRoles,
      allSystems: this.allSystems,
    });
  }

  deleteUser(eid) {
    if (confirm('Confirm to delete this user?')) {
      this.handleUserDeletion.emit(eid);
    }
  }
}
