import { Download } from "@mui/icons-material"
import { Button, Card, CardActions, CardContent, Typography } from "@mui/joy"

export default function ({filename}) {
    return (
        <Card orientation="horizontal" size="lg">
            <CardContent>
                <Typography sx={{ wordBreak: "break-all" }}>
                    {filename}
                </Typography>
            </CardContent>
            <CardActions>
                <Button variant="outlined">
                    <Download />
                </Button>
            </CardActions>
        </Card>
    )
}