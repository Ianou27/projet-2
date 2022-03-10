export class PassCommand {
    static validatedPassCommandFormat(commandInformations: string[]) {
        if (commandInformations.length !== 1) return false;
        const command: string = commandInformations[0];
        const passValidation = /^!passer$/;
        return passValidation.test(command);
    }
}
