import { Component } from '@angular/core';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';
import { Goals } from './../../../../../common/constants/goals';

@Component({
    selector: 'app-goals',
    templateUrl: './goals.component.html',
    styleUrls: ['./goals.component.scss'],
})
export class GoalsComponent {
    goals: Goals;
    goalsList: string[];
    constructor(public clientSocketHandler: ClientSocketHandler) {
        this.goals = clientSocketHandler.goals;
        this.goalsList = Object.keys(this.goals);
    }
}
