export class Constants {
  public static TIMESTAMP_PATTERN = /^\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*(\d{1,2})\s*,?\s*(\d{4})\s*(\d{1,2})\s*:?\s*(\d{1,2})\s*(am|pm)\s*$/i;
  public static MONTHS: string[] = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  //public static STUDENT_NOTES_SERVICE_URL = 'http://localhost:8080/StudentNotesService';  // URL to web api
  public static APPLICATION_PROPERTIES_FILE = 'assets/application.properties.json';
}