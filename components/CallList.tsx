"use client";
import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MetingCard from "./MetingCard";
import Loader from "./Loader";
import { useToast } from "./ui/use-toast";

type CallListProps = {
  type: "ended" | "upcoming" | "recordings";
};
export default function CallList({ type }: CallListProps) {
  const { callRecordings, endedCalls, isLoading, upcomingCalls } =
    useGetCalls();

  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const router = useRouter();
  const { toast } = useToast();
  useEffect(() => {
    try {
    } catch (error) {}

    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings.map((meeting) => meeting.queryRecordings()),
        );

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
      } catch (error) {
        toast({ title: "Tente novamente mais Tarde" });
      }
    };
    if (type === "recordings") fetchRecordings();
  }, [callRecordings, toast, type]);

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recordings":
        return recordings;
      case "upcoming":
        return upcomingCalls;
      default:
        return [];
    }
  };
  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "Não possui Reuniões anteriores";
      case "recordings":
        return "Não possui Gravações ";
      case "upcoming":
        return "Não possui Reuniões Agendadas";
      default:
        return "";
    }
  };
  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 ">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MetingCard
            key={(meeting as Call)?.id}
            icon={
              type === "ended"
                ? "/icons/previous.svg"
                : type === "upcoming"
                  ? "/icons/upcoming.svg"
                  : "/icons/recordings.svg"
            }
            title={
              (meeting as Call).state?.custom?.description
                ?.substring(0, 26)
                .trim() ||
              (meeting as CallRecording)?.filename?.substring(0, 20) ||
              "sem descrição..."
            }
            date={
              /* @ts-ignore */
              meeting?.state?.startsAt.toLocaleString() ||
              (meeting as CallRecording)?.start_time.toLocaleString()
            }
            isPreviousMeeting={type === "ended"}
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
            buttonText={type === "recordings" ? "play" : "Iniciar"}
            link={
              type === "recordings"
                ? (meeting as CallRecording).url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call)?.id}`
            }
            handleClick={
              type === "recordings"
                ? () => router.push(`${(meeting as CallRecording).url}`)
                : () => router.push(`/meeting/${(meeting as Call)?.id}`)
            }
          />
        ))
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
}
