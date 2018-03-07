export class StringUtils{
    static capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.substr(1);
    }
}