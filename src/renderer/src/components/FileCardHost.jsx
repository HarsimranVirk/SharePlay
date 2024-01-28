import { Delete, Download } from '@mui/icons-material'
import { Button, Card, CardActions, CardContent, Typography } from '@mui/joy'

export default function ({ filename, deleteFile }) {
  return (
    <Card orientation="horizontal" size="lg">
      <CardContent>
        <Typography sx={{ wordBreak: 'break-all' }}>{filename}</Typography>
      </CardContent>
      <CardActions>
        <Button variant="outlined" onClick={deleteFile}>
          <Delete />
        </Button>
      </CardActions>
    </Card>
  )
}
