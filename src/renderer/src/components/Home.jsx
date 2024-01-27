import {
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
    Typography
} from "@mui/joy";
import Check from '@mui/icons-material/Check';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import wavy_lines from "../assets/wavy-lines.svg"
import useSnackbar from "../hooks/useSnackbar";
import { useState } from "react";

const steps = ["Host or Join", "Add videos", "Let's go!"]

export default function () {
    const snackbar = useSnackbar(1500)
    const [activeStep, setActiveStep] = useState(1)
    const [serverLink, setServerLink] = useState("http://0.0.0.0:8196")
    const [message, setMessage] = useState();
    const [color, setColor] = useState();

    return (
        <Sheet sx={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundImage: `url(${wavy_lines})`,
            backgroundColor: "#282828",
        }}>
            <Card invertedColors={true} variant="soft" size="lg">
                <Stepper sx={{ marginBottom: '1.25em' }}>
                    {steps.map((step, index) => (
                        <Step
                            key={step}
                            indicator={
                                <StepIndicator
                                    variant={activeStep <= index ? 'soft' : 'solid'}
                                    color={activeStep <= index ? 'neutral' : 'primary'}
                                >
                                    {(activeStep - 1) <= index ? index + 1 : <Check />}
                                </StepIndicator>
                            }
                        >
                            <StepButton
                                
                                onClick={() => {
                                    if (index < activeStep) setActiveStep(index + 1)
                                }}
                            >{step}</StepButton>
                        </Step>
                    ))}
                </Stepper>
                {activeStep == 1 && (
                    <>
                        <CardContent>
                            <Typography color="warning" startDecorator={<InfoOutlined/>}>
                                Share-Play works only if you can directly connect to the peers.
                            </Typography>
                            <Typography color="neutral">
                                Consider using <a href="https://tailscale.com/">tailscale</a> if you are behind a NAT/firewall.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Input
                                sx={{ width: "100%" }}
                                placeholder="Server link"
                                value={serverLink}
                                onChange={(e) => setServerLink(e.target.value)}
                            ></Input>
                            <ButtonGroup spacing={1}>
                                <Tooltip title="Host the session if you have the file.">
                                    <Button onClick={
                                        () => window.api.createServer(serverLink)
                                            .then(s => {
                                                snackbar.setMessage(s)
                                                snackbar.setColor("success")
                                                snackbar.setOpen(true)
                                                setActiveStep(2)
                                            })
                                            .catch(e => {
                                                if (e.message.includes("Invalid URL"))
                                                    snackbar.setMessage("Invalid URL, please try again!")
                                                snackbar.setColor("danger")
                                                snackbar.setOpen(true)
                                            })
                                    }>Host</Button>
                                </Tooltip>
                                <Tooltip title="Join a session">
                                    <Button
                                        onClick={() => {
                                            fetch(serverLink).then(res => res.json()).then(res => console.log(res))
                                        }}
                                    >Join</Button>
                                </Tooltip>
                            </ButtonGroup>
                        </CardActions>
                    </>
                )}

            </Card>


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
        </Sheet>
    )
}