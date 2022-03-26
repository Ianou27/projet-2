export class HelpCommand {
    static validatedFormat(commandInformations: string[]): boolean {
        if (commandInformations.length !== 1) return false;
        const command: string = commandInformations[0];
        const passValidation = /^!aide$/;
        return passValidation.test(command);
    }
}
