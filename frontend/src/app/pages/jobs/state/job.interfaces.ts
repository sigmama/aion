export interface Job {
  system: String;
  category: String;
  name: string;
  desc: string;
  isFirstSystem?: boolean;
  isFirstJobCategory?: boolean;
}

export interface JobInstance {
  id?: string;
  system: String;
  category: String;
  name: string;
  cron?: string;
  timeZone?: string;
  lastFinishedAt?: Date;
  lastRunAt?: Date;
  nextRunAt?: Date;
}
