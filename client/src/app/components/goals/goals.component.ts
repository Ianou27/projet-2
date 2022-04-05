import { Component } from '@angular/core';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';
import { GoalInformations } from './../../../../../common/constants/goal-information';
import { GoalType } from './../../../../../common/constants/goal-type';

@Component({
    selector: 'app-goals',
    templateUrl: './goals.component.html',
    styleUrls: ['./goals.component.scss'],
})
export class GoalsComponent {
    goals: GoalInformations[];
    constructor(public clientSocketHandler: ClientSocketHandler) {
        this.goals = clientSocketHandler.goals;
    }

    getType(goal: GoalInformations) {
        if (goal.type === GoalType.Public) {
            return 'Public';
        }
        return 'Privé';
    }
}
