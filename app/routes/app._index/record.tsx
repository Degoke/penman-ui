import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DEFAULT_THEME, LoadingOverlay } from '@mantine/core';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  handleStopRecording: () => void
  handleStartRecording: () => void
  handleViewRecord: () => void
  soundClips: JSX.Element[]
  recording: boolean
  loading: boolean
}


export function Record({ handleStartRecording, handleStopRecording, handleViewRecord, soundClips, recording, loading }: Props) {
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-10 w-10 text-muted-foreground"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="11" r="1" />
          <path d="M11 17a1 1 0 0 1 2 0c0 .5-.34 3-.5 4.5a.5.5 0 0 1-1 0c-.16-1.5-.5-4-.5-4.5ZM8 14a5 5 0 1 1 8 0" />
          <path d="M17 18.5a9 9 0 1 0-10 0" />
        </svg>

        <h3 className="mt-4 text-lg font-semibold">No episodes added</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          You have not added any podcasts. Add one below.
        </p>
        <Dialog>
          <DialogTrigger>
            <Button size="sm" className="relative">
              Add Podcast
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Audio</DialogTitle>
              <DialogDescription>
                Click Start too start recording
              </DialogDescription>
            </DialogHeader>
            {recording && (
              <Card>
              <CardHeader>
                <CardTitle>Recording</CardTitle>
              </CardHeader>
              <CardContent>
              {/* <LoadingOverlay loaderProps={{
                children: customLoader
              }} visible /> */}
              </CardContent>
            </Card>
            )}
            {loading && (
              <Card>
              <CardHeader>
                <CardTitle>Preparing your file for transcription</CardTitle>
              </CardHeader>
              <CardContent>
              <LoadingOverlay loaderProps={{
                children: customLoader
              }} visible />
              </CardContent>
            </Card>
            )}
            {(!recording && !loading) && (
              <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                {soundClips}
              </div>
            </div>
            )}
            <DialogFooter>
              <Button onClick={handleStartRecording} disabled={recording}>Start Record</Button>
              <Button onClick={handleStopRecording} disabled={!recording}>Stop Record</Button>
              <Button onClick={handleViewRecord} disabled={recording}>View Record</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

const customLoader = (
  <svg
    width="54"
    height="54"
    viewBox="0 0 38 38"
    xmlns="http://www.w3.org/2000/svg"
    stroke={DEFAULT_THEME.colors.blue[6]}
  >
    <g fill="none" fillRule="evenodd">
      <g transform="translate(1 1)" strokeWidth="2">
        <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
        <path d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 18 18"
            to="360 18 18"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </g>
  </svg>
);
