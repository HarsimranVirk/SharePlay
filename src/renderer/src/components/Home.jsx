import {
  Grid,
  Sheet,
  Card,
  CardContent,
  CardActions,
  Input,
  Button,
  ButtonGroup,
  Tooltip,
  Snackbar,
  Stepper,
  Step,
  StepIndicator,
  StepButton,
  Typography,
  List,
  Skeleton,
  ListItem,
  ListItemContent,
  ListItemButton,
  Stack,
  Tab,
  Tabs,
  TabList,
  TabPanel
} from '@mui/joy'
import Check from '@mui/icons-material/Check'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import wavy_lines from '../assets/wavy-lines.svg'
import useSnackbar from '../hooks/useSnackbar'
import { useContext, useState } from 'react'
import { HostContext } from '../App'
import { AddAPhoto, Delete, Download } from '@mui/icons-material'

const steps = ['Host or Join', 'Add videos', "Let's go!"]

export default function () {
  const snackbar = useSnackbar(1500)
  const [activeStep, setActiveStep] = useState(1)
  const [serverLink, setServerLink] = useState('http://0.0.0.0:8196')
  const { host, setHost } = useContext(HostContext)
  const [allFiles, setAllFiles] = useState(null)
  const [allFilesLoading, setAllFilesLoading] = useState()

  const showSnackbar = (message, color) => {
    snackbar.setMessage(message)
    snackbar.setColor(color)
    snackbar.setOpen(true)
  }

  const fetchAllFiles = () => {
    setAllFilesLoading(true)
    fetch(`${serverLink}/videos`, {
      method: "GET",
    })
      .then(res => res.json())
      .then(res => {
        setAllFiles(res)
        setAllFilesLoading(false)
      })
  }

  return (
    <>
      <Grid container >
        <Tabs
          variant='solid'
          orientation='vertical'
          sx={{
            height: '100vh',
            overflow: "hidden",
            width: "100vw"
          }}>
          <Grid xs={4} md={3}>
            <TabList variant='solid' sx={{ width: '100%' }}>
              <Tab>
                <Typography>Home</Typography>
              </Tab>
            </TabList>
          </Grid>
          <Grid xs={8} md={9}>
            <TabPanel variant='soft' sx={{ height: "100%" }} >
              <Sheet variant="soft" size="lg" sx={{ p: 4 }}>
                <Stepper sx={{ marginBottom: '1.25em' }}>
                  {steps.map((step, index) => (
                    <Step
                      key={step}
                      indicator={
                        <StepIndicator
                          variant={activeStep <= index ? 'soft' : 'solid'}
                          color={activeStep <= index ? 'neutral' : 'primary'}
                        >
                          {activeStep - 1 <= index ? index + 1 : <Check />}
                        </StepIndicator>
                      }
                    >
                      <StepButton
                        onClick={() => {
                          if (index < activeStep) {
                            setActiveStep(index + 1)
                            if (index == 0) {
                              window.api.closeServer()
                            }
                          }
                        }}
                      >
                        {step}
                      </StepButton>
                    </Step>
                  ))}
                </Stepper>

                {activeStep == 1 && (
                  <>
                    <Stack sx={{ p: 4 }} alignItems="center">
                      <Typography color="warning" startDecorator={<InfoOutlined />}>
                        Share-Play works only if you can directly connect to the peers.
                      </Typography>
                      <Typography color="neutral">
                        Consider using <a href="https://tailscale.com/">tailscale</a> if you are behind a
                        NAT/firewall.
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} justifyContent="center">
                      <Input
                        size='lg'
                        placeholder="Server link"
                        value={serverLink}
                        onChange={(e) => setServerLink(e.target.value)}
                      ></Input>
                      <ButtonGroup variant='solid' spacing={1}>
                        <Tooltip title="Host the session if you have the file.">
                          <Button
                            onClick={() =>
                              window.api
                                .createServer(serverLink)
                                .then((s) => {
                                  showSnackbar(s, 'success')
                                  setHost(true)
                                  setActiveStep(2)
                                  fetchAllFiles()
                                })
                                .catch((e) => {
                                  if (e.message.includes('Invalid URL')) {
                                    showSnackbar('Invalid URL, please try again!', 'danger')
                                  }
                                })
                            }
                          >
                            Host
                          </Button>
                        </Tooltip>
                        <Tooltip title="Join a session">
                          <Button
                            onClick={() => {
                              fetch(serverLink)
                                .then((res) => res.json())
                                .then((res) => {
                                  showSnackbar("Connected successfully!", "success")
                                  setHost(false)
                                  setActiveStep(2)
                                  fetchAllFiles()
                                })
                                .catch((e) => {
                                  showSnackbar("Something went wrong", "danger")
                                })
                            }}
                          >
                            Join
                          </Button>
                        </Tooltip>
                      </ButtonGroup>
                    </Stack>
                  </>
                )}

                {activeStep == 2 && (
                  <>
                    {host && (
                      <Stack spacing={2}>
                        <Typography>
                          {host && "Add videos to share"}
                        </Typography>
                        {allFiles && Object.entries(allFiles).map(([chksum, fileData]) => (
                          <Stack direction="row" spacing={3} justifyContent="space-between">
                            <Typography>{fileData.filepath}</Typography>
                            <Button variant='outlined'>
                              <Delete />
                            </Button>
                          </Stack>
                        ))}
                        <Stack sx={{ flexDirection: "row-reverse" }}>
                          <ButtonGroup variant='solid' spacing={1}>
                            <Button
                              startDecorator={<AddAPhoto />}
                              onClick={() => {
                                window.electron.ipcRenderer.invoke("dialog:open")
                                  .then(res => {
                                    if (!res.canceled) {
                                      res.filePaths.forEach(filepath => {
                                        console.log(filepath)
                                        fetch(`${serverLink}/videos`, {
                                          method: "POST",
                                          cors: `${serverLink}`,
                                          headers: {
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify({ filepath })
                                        })
                                          .then(() => fetchAllFiles())
                                          .catch(e => {
                                            showSnackbar("Something went wrong", "danger")
                                          })
                                      })
                                    }
                                  })

                              }}
                            >
                              Add
                            </Button>
                            <Button >
                              Continue
                            </Button>
                          </ButtonGroup>
                        </Stack>
                      </Stack>
                    )}
                    {!host && (
                      <CardContent>
                        <Typography>
                          {host && "Videos added by the host"}
                        </Typography>
                        {allFiles && Object.entries(allFiles).map(([chksum, fileData]) => (
                          <CardActions sx={{ flexDirection: "row", justifyContent: "space-between" }} key={chksum}>
                            <Typography sx={{ wordBreak: "break-all" }}>{fileData.filepath}</Typography>
                            <Button>
                              <Download />
                            </Button>
                          </CardActions>
                        ))}
                        <CardActions sx={{ flexDirection: "row-reverse" }} buttonFlex="0 1 120px">
                          <ButtonGroup variant='solid' spacing={1}>
                            <Button
                              startDecorator={<AddAPhoto />}
                              onClick={() => {
                                window.electron.ipcRenderer.invoke("dialog:open")
                                  .then(res => {
                                    if (!res.canceled) {
                                      res.filePaths.forEach(filepath => {
                                        console.log(filepath)
                                        fetch(`${serverLink}/videos`, {
                                          method: "POST",
                                          cors: `${serverLink}`,
                                          headers: {
                                            'Content-Type': 'application/json'
                                          },
                                          body: JSON.stringify({ filepath })
                                        })
                                          .then(() => fetchAllFiles())
                                          .catch(e => {
                                            showSnackbar("Something went wrong", "danger")
                                          })
                                      })
                                    }
                                  })

                              }}
                            >
                              Add
                            </Button>
                            <Button >
                              Continue
                            </Button>
                          </ButtonGroup>
                        </CardActions>
                      </CardContent>
                    )}
                  </>
                )}
              </Sheet>

            </TabPanel>

          </Grid>
        </Tabs>
      </Grid>

      <Snackbar
        variant="soft"
        color={snackbar.color}
        autoHideDuration={1000}
        resumeHideDuration={snackbar.left}
        onMouseEnter={snackbar.handlePause}
        onMouseLeave={snackbar.handleResume}
        onFocus={snackbar.handlePause}
        onBlur={snackbar.handleResume}
        onUnmount={() => snackbar.setLeft(undefined)}
        open={snackbar.open}
        onClose={() => snackbar.setOpen(false)}
      >
        {snackbar.message}
      </Snackbar>
    </>
  )
}
