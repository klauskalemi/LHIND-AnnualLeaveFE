export interface Report {
  name: string;
  description: string;
  reportFunction: () => void;
}
