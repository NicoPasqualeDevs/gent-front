export interface PathData {
  label: string;
  current_path: string;
  preview_path: string;
  translationKey: string;
  extraData?: Record<string, string | number | boolean>;
}

interface PathbarAction {
  label: string;
  path: string;
  callback?: () => void;
}

export interface PathbarProps {
  actions: PathbarAction[];
}
