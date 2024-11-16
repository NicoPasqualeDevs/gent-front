import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { languages } from "@/utils/Traslations";
import { useAppContext } from "@/context";
import { ActionAllowerProps } from "./types";

const ActionAllower: React.FC<ActionAllowerProps> = ({ 
  allowerStateCleaner, 
  actionToDo, 
  actionParams 
}) => {
  const { language } = useAppContext();
  const [confirmText, setConfirmText] = useState("");
  const t = languages[language as keyof typeof languages];

  const handleClose = () => {
    allowerStateCleaner(false);
  };

  const handleConfirm = async () => {
    if (confirmText === t.actionAllower.confirm) {
      await actionToDo(actionParams);
    }
  };

  return (
    <Dialog open={true} onClose={handleClose}>
      <DialogTitle>{t.actionAllower.confirmation}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={`${t.actionAllower.write} "${t.actionAllower.confirm}"`}
          type="text"
          fullWidth
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t.actionAllower.cancel}</Button>
        <Button 
          onClick={handleConfirm} 
          disabled={confirmText !== t.actionAllower.confirm}
        >
          {t.actionAllower.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActionAllower;
