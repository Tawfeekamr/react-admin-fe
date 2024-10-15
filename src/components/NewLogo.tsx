import Box from "@mui/material/Box";

export default function NewLogo({ alt = "New Logo" }: { alt?: string }) {
    return (
        <div>
            <Box sx={{ mb: 2 }}>
                <img width="193" height="96" src="/assets/assisi_hospice.png" alt={alt} />
            </Box>
        </div>
    );
}