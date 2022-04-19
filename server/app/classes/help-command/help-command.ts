export class HelpCommand {
    static validatedFormat(commandInformations: string[]): boolean {
        const command: string = commandInformations[0];
        const passValidation = /^!aide$/;
        return commandInformations.length === 1 && passValidation.test(command);
    }
}
