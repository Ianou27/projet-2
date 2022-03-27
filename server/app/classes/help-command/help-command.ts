export class HelpCommand {
    static verifyFormat(commandInformations: string[]): boolean {
        if (commandInformations.length !== 1) return false;
        const commandFormat = /^!aide$/;
        return commandFormat.test(commandInformations[0]);
    }
}
