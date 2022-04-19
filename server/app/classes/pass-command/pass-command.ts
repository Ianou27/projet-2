export class PassCommand {
    static validatedPassCommandFormat(commandInformations: string[]): boolean {
        const command: string = commandInformations[0];
        const passValidation = /^!passer$/;
        return commandInformations.length === 1 && passValidation.test(command);
    }
}
