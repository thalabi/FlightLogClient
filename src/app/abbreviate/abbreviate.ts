export class Abbreviate {

    static readonly MAX_LENGTH: number = 100;

    static abbreviateText(inputText: string, maxLength: number = Abbreviate.MAX_LENGTH): string {
        if (inputText && inputText.length > maxLength) {
            let lastIndex: number = inputText.lastIndexOf(' ', maxLength);
            return inputText.substr(0, lastIndex == -1 ? maxLength : lastIndex) + ' ...';
        } else {
            return inputText;
        }
    }

}