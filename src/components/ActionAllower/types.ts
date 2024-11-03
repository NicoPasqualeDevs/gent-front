export interface ActionAllowerProps {
  allowerStateCleaner: (value: boolean) => void;
  actionToDo: (params: string) => Promise<void>;
  actionParams: string;
} 