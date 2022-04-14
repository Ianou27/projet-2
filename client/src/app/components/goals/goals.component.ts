import { Component, OnInit } from '@angular/core';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';
import { GoalInformations } from './../../../../../common/constants/goal-information';
import { GoalType } from './../../../../../common/constants/goal-type';

@Component({
    selector: 'app-goals',
    templateUrl: './goals.component.html',
    styleUrls: ['./goals.component.scss'],
})
export class GoalsComponent implements OnInit {
    goals: GoalInformations[];
    constructor(public clientSocketHandler: ClientSocketHandler) {
        // this.goals = clientSocketHandler.goals;
    }

    ngOnInit(): void {
        this.goals = this.clientSocketHandler.goals;
    }

    getType(goal: GoalInformations): string {
        if (goal.type === GoalType.Public) {
            return 'Public';
        }
        return 'Privé';
    }
}
