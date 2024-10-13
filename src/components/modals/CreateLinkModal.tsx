import {useState} from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {BASE_URL} from "../../utils/statics";

type CreateLinkModalProps = {
    open: boolean;
    onClose: () => void;
    onLinkCreated: (newLink: any) => void;
};


export function CreateLinkModal({ open, onClose, onLinkCreated }: CreateLinkModalProps) {
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateLink = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/api/dashboards`, {
                data: {
                    name,
                    link,
                },
            });
            onLinkCreated(response.data); // Notify parent component of the newly created link
            onClose(); // Close the modal
        } catch (error) {
            console.error('Failed to create link:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create New Link</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    type="text"
                    size="small"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Link"
                    type="text"
                    size="small"
                    fullWidth
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button onClick={handleCreateLink} color="inherit" variant="contained" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Link'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
