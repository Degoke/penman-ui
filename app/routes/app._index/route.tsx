import React, { useEffect, useState } from "react";
// import { FFmpeg } from "../../node_modules/@ffmpeg/ffmpeg/dist/esm";
// import { toBlobURL, fetchFile } from "../../node_modules/@ffmpeg/util/dist/esm";
import type { ActionFunctionArgs, UploadHandler } from "@remix-run/node";
import { Notification } from "@mantine/core"
import {
 json,
 unstable_composeUploadHandlers as composeUploadHandlers,
 unstable_createMemoryUploadHandler as createMemoryUploadHandler,
 unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";


import { s3UploadHandler } from "@/lib/s3-server";
import { Record } from "./record";
import CodeViewer from "./editor";
import {
 Card,
 CardContent,
 CardFooter,
 CardHeader,
 CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ActionData = {
 errorMsg?: string;
 audioSrc?: string;
 audioId?: string;
 data: any
};

export const action = async ({ request }: ActionFunctionArgs) => {
 const { STORAGE_BUCKET, SERVER_URL } = process.env
 console.log(STORAGE_BUCKET, SERVER_URL)

 const uploadHandler: UploadHandler = composeUploadHandlers(
   s3UploadHandler,
   createMemoryUploadHandler()
 );


 console.log(uploadHandler);
 const formData = await parseMultipartFormData(request, uploadHandler);
 console.log(formData);
 const audioSrc = formData.get("audio");
 const audioId = formData.get("audioId");
 if (!audioSrc) {
   return json({
     errorMsg: "Something went wrong while uploading",
   });
 }

 const response = await fetch(`${SERVER_URL}/transcribe`, 
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({
            key: audioId,
            bucket: STORAGE_BUCKET
        })
    }
 )

 const data = await response.json()
 console.log(data)
 return json({
   audioSrc,
   audioId,
   data
 });
};
export default function Page() {
 const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
   null
 );
 const [chunks, setChunks] = useState<Blob[]>([]);
 const [recording, setRecording] = useState(false);
 //   const [clipName, setClipName] = useState('');
 const [soundClips, setSoundClips] = useState<JSX.Element[]>([]);
 const [awaiting, setAwaiting] = useState<JSX.Element[]>([])

 const [content, setContent] =  useState('');


 //   const [loaded, setLoaded] = useState(false);
 //   const ffmpegRef = useRef(new FFmpeg());
 const fetcher = useFetcher<ActionData>();

 useEffect(() => {
    if (fetcher.data) {
        console.log({
            data: fetcher.data.data
                //    value: {
                //        id: fetcher.data.audioId,
                //        url: fetcher.data.audioSrc
                //     }
        })
    }

    setContent(fetcher.data?.data.transcription)
    
 }, [fetcher.data])


//  if (fetcher.data?.audioSrc) {
// //    socket?.emit("transcribe", {
// //        key: fetcher.data.audioId,
// //        value: {
// //            id: fetcher.data.audioId,
// //            url: fetcher.data.audioSrc
// //        }
// //    })

// console.log({
//     key: fetcher.data.audioId,
//     bucket: STORAGE_BUCKET,
//     data: fetcher.data.data
//         //    value: {
//         //        id: fetcher.data.audioId,
//         //        url: fetcher.data.audioSrc
//         //     }
// })

//    const notifiction = (
//        <Notification
//                loading
//                title="Uploading data to the server"
//                withCloseButton={false}
//              >
//                Your file {fetcher.data.audioId} is beign transcribed, you cannot close this notification yet
//              </Notification>
//    )


//    setAwaiting(
//            [...awaiting, notifiction]
//        )
  
//  }


 //   const load = async () => {
 //     const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.2/dist/esm";
 //     const ffmpeg = ffmpegRef.current;
 //     ffmpeg.on("log", ({ message }: any) => {
 //       if (messageRef.current) messageRef.current.innerHTML = message;
 //     });
 //     // toBlobURL is used to bypass CORS issue, urls with the same
 //     // domain can be used directly.
 //     await ffmpeg.load({
 //       coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
 //       wasmURL: await toBlobURL(
 //         `${baseURL}/ffmpeg-core.wasm`,
 //         "application/wasm"
 //       )
 //     });
 //     setLoaded(true);
 //   };


 //   const transcode = async (videoURL: string) => {
 //     console.log("startingg")
 //     const ffmpeg = ffmpegRef.current;
 //     console.log("writing")
 //     await ffmpeg.writeFile("input.avi", await fetchFile(videoURL));
 //     console.log("execing")
 //     await ffmpeg.exec(["-i", "input.avi", "output.mp3"]);
 //     console.log("filing")
 //     const fileData = await ffmpeg.readFile('output.mp3');
 //     const data = new Uint8Array(fileData as ArrayBuffer);


 //     return URL.createObjectURL(
 //         new Blob([data.buffer], { type: 'audio/mp3' })
 //       )
 //   };


 const handleStartRecording = () => {
   if (!mediaRecorder) return;


   mediaRecorder.start();
   console.log(mediaRecorder.state);
   console.log("recorder started");
   setRecording(true);
 };


 const handleStopRecording = () => {
   if (!mediaRecorder) return;


   mediaRecorder.stop();
   console.log(mediaRecorder.state);
   console.log("recorder stopped");
   setRecording(false);
   //
 };


 const handleDataAvailable = (e: BlobEvent) => {
   if (e.data.size > 0) {
     setChunks([...chunks, e.data]);
   }
 };


 const handleViewRecord = async () => {
   console.log("saving");
   if (chunks.length > 0) {
     const clipName = "record" + Date.now();
     const blob = new Blob(chunks, { type: "audio/mp3" });
     const blobURL = URL.createObjectURL(blob);
     console.log(blobURL);


     //   setAudioURL(audioURL);


     //   const audioURL = await transcode(blobURL)
     // //   const audioURL = URL.createObjectURL(mp3Blob);
     //   console.log(audioURL)


     const upload = () => {
       const audioFile = new File([blob], clipName, { type: "audio/mp3" });
       console.log(audioFile);
       const formData = new FormData();
       formData.append("audio", audioFile);
       formData.append("audioId", clipName);
       console.log(formData);
       console.log(formData.get("audio"));
       // return
       fetcher.submit(formData, {
         method: "post",
         encType: "multipart/form-data",
       });
     };


     const newClip = (
       <Card>
         <CardHeader>
           <CardTitle>{clipName}</CardTitle>
         </CardHeader>
         <CardContent>
           <article className="clip" key={clipName}>
             <audio controls src={blobURL} />
           </article>
         </CardContent>
         <CardFooter>
           <Button onClick={() => handleDeleteClip(clipName)}>Delete</Button>
           <Button onClick={upload}>Transcribe</Button>
         </CardFooter>
       </Card>
     );


     setSoundClips([...soundClips, newClip]);
     //   setClipName('');
     setChunks([]);
   }
 };


 const handleDeleteClip = (clipNameToDelete: string) => {
   const updatedClips = soundClips.filter(
     (clip) => clip.key !== clipNameToDelete
   );


   setSoundClips(updatedClips);
 };


 //   const handleClipNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 //     setClipName(e.target.value);
 //   };


 const initMediaRecorder = async () => {
   if (navigator.mediaDevices) {
     console.log("getUserMedia supported.");


     try {
       const stream = await navigator.mediaDevices.getUserMedia({
         audio: true,
       });
       const recorder = new MediaRecorder(stream);


       recorder.ondataavailable = handleDataAvailable;
       recorder.onstop = () => {
         console.log("data available after MediaRecorder.stop() called.");
       };


       setMediaRecorder(recorder);
     } catch (err) {
       console.error(`The following error occurred: ${err}`);
     }
   }
 };


 useEffect(() => {
   initMediaRecorder();
 }, []);


 return (
   <div>
     <Record
       handleViewRecord={handleViewRecord}
       handleStartRecording={handleStartRecording}
       handleStopRecording={handleStopRecording}
       soundClips={soundClips}
       recording={recording}
       loading={fetcher.state === "submitting"}
     />
     {content && (
        <CodeViewer content={content} />
     )}
   </div>
 );
}
