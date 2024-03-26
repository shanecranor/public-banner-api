export type Term = {
  code: string;
  description: string;
};
export type Subject = {
  code: string;
  description: string;
};

export type ApiResponse = {
  success: boolean;
  totalCount: number;
  data: Course[];
  pageOffset: number;
  pageMaxSize: number;
  sectionsFetchedCount: number;
  pathMode: string;
  searchResultsConfigs: any;
  ztcEncodedImage?: any;
};

export type Course = {
  id: number;
  term: string;
  termDesc: string;
  courseReferenceNumber: string;
  partOfTerm: string;
  courseNumber: string;
  subject: string;
  subjectDescription: string;
  sequenceNumber: string;
  campusDescription: string;
  scheduleTypeDescription: string;
  courseTitle: string;
  creditHours: null | number;
  maximumEnrollment: number;
  enrollment: number;
  seatsAvailable: number;
  waitCapacity: number;
  waitCount: number;
  waitAvailable: number;
  crossList: null | string;
  crossListCapacity: null | number;
  crossListCount: null | number;
  crossListAvailable: null | number;
  creditHourHigh: null | number;
  creditHourLow: null | number;
  creditHourIndicator: null | string;
  openSection: boolean;
  linkIdentifier: null | string;
  isSectionLinked: boolean;
  subjectCourse: string;
  faculty: Faculty[];
  meetingsFaculty: MeetingFaculty[];
  reservedSeatSummary: null | any; // Replace 'any' with a more specific type if the structure is known
  sectionAttributes: SectionAttribute[];
};

export type Faculty = {
  bannerId: string;
  category: null | string;
  class: string;
  courseReferenceNumber: string;
  displayName: string;
  emailAddress: null | string;
  primaryIndicator: boolean;
  term: string;
};

export type MeetingFaculty = {
  category: string;
  class: string;
  courseReferenceNumber: string;
  faculty: Faculty[];
  meetingTime: MeetingTime;
  term: string;
};

export type MeetingTime = {
  beginTime: string;
  building: string;
  buildingDescription: string;
  campus: string;
  campusDescription: string;
  category: string;
  class: string;
  courseReferenceNumber: string;
  creditHourSession: number;
  endDate: string;
  endTime: string;
  friday: boolean;
  hoursWeek: number;
  meetingScheduleType: string;
  meetingType: string;
  meetingTypeDescription: string;
  monday: boolean;
  room: string;
  saturday: boolean;
  startDate: string;
  sunday: boolean;
  term: string;
  thursday: boolean;
  tuesday: boolean;
  wednesday: boolean;
};

export type SectionAttribute = {
  class: string;
  code: string;
  courseReferenceNumber: string;
  description: string;
  isZTCAttribute: boolean;
  termCode: string;
};
