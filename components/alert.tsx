import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    severity: 'error' | 'warning' | 'info' | 'success';
    message: string;
    open: boolean;
    setAlertOpen: (open: boolean) => void;
}

export default function MyAlert({ severity, message, open, setAlertOpen }: Props) {
  return (
    <Collapse in={open}>
        <Alert
            severity={ severity }
            action={
            <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                setAlertOpen(false);
                }}
            >
                <CloseIcon fontSize="inherit" />
            </IconButton>
            }
            sx={{ mb: 2 }}
        >
            { message }
        </Alert>
    </Collapse>
  );
}
