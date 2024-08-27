export interface ActionAllowerProps<T, U> {
  allowerStateCleaner: React.Dispatch<React.SetStateAction<boolean>>;
  actionToDo: (args: T) => U;
  actionParams: T;
  confirmWord?: string;
  alertText?: string;
}

export interface ConfirmData {
  confirm: string;
}
