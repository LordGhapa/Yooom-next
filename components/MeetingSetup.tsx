"use client";
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

type MeetingSetupProps = {
  setIsSetupComplete: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function MeetingSetup({
  setIsSetupComplete,
}: MeetingSetupProps) {
  const [isMicCamToggled, setIsMicCamToggled] = useState(false);

  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  const call = useCall();
  if (!call) {
    // throw new Error("useCall deve ser usado com component StreamCall ");
    return(
      <div>error</div>
    )
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isMicCamToggled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.microphone.enable();
      call.camera.enable();
    }
  }, [isMicCamToggled, call.camera, call.microphone]);

  // if (callTimeNotArrived)
  //   return (
  //     <Alert
  //       title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
  //     />
  //   );

  // if (callHasEnded)
  //   return (
  //     <Alert
  //       title="The call has been ended by the host"
  //       iconUrl="/icons/call-ended.svg"
  //     />
  //   );

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold ">Configurações</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3 ">
        <label
          htmlFor=""
          className="flex items-center justify-center gap-2 font-medium "
        >
          <input
            type="checkbox"
            checked={isMicCamToggled}
            onChange={(e) => setIsMicCamToggled(e.target.checked)}
          />
          Junte-se com microfone e camera desligados
        </label>
        <DeviceSettings />
      </div>
      <Button
        onClick={() => {
          call.join();
          setIsSetupComplete(true);
        }}
        className="rounded-md bg-green-500 px-4 py-2.5 "
      >
        Junte-se a Reunião
      </Button>
    </div>
  );
}
