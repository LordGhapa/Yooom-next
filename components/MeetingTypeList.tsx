"use client";

import React, { useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "./ui/textarea";

import DatePicker, { registerLocale } from "react-datepicker";

import { ptBR } from "date-fns/locale";
import { Input } from "./ui/input";
registerLocale("ptBR", ptBR);

export default function MeetingTypeList() {
  const { toast } = useToast();
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: " ",
  });
  const [callDetails, setCallDetails] = useState<Call>();
  const { user } = useUser();
  const client = useStreamVideoClient();

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({
          title: "Escolha uma data e hora validas",
        });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) throw new Error("failed to create call");
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();

      const description = values.description || "Reunião instantânea";

      await call.getOrCreate({
        data: { starts_at: startsAt, custom: { description } },
      });
      setCallDetails(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }

      toast({
        title: "Sala de Reunião criada com sucesso",
      });
 
    } catch (error) {
      console.log(error);
      toast({
        title: "Falha ao tenta criar a reunião",
      });
    }
  };
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        title={"Nova Reunião"}
        description={"Inicie uma chamade de video"}
        handleClick={() => setMeetingState("isInstantMeeting")}
        img={"/icons/add-meeting.svg"}
        className="bg-orange-1"
      />
      <HomeCard
        title={"Juntar-se a uma Reunião"}
        description={"Via link de convite"}
        handleClick={() => setMeetingState("isJoiningMeeting")}
        img={"/icons/join-meeting.svg"}
        className="bg-blue-1"
      />
      <HomeCard
        title={"Agendar uma Reunião"}
        description={"Planeje suas Reuniões "}
        handleClick={() => setMeetingState("isScheduleMeeting")}
        img={"/icons/schedule.svg"}
        className="bg-purple-1"
      />
      <HomeCard
        img={"/icons/recordings.svg"}
        title={"Gravações"}
        description={"Veja suas gravações"}
        handleClick={() => router.push("/recordings")}
        className="bg-yellow-1"
      />

      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Agende uma Reunião"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label
              htmlFor="desc"
              className="text-base font-normal leading-[22px] text-sky-2"
            >
              Crie uma Descrição
            </label>
            <Textarea
              id="desc"
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5 ">
            <label
              htmlFor="date"
              className="text-base font-normal leading-[22px] text-sky-2"
            >
              Escolha uma data e hora
            </label>
            <DatePicker
              locale="ptBR"
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Hora"
              dateFormat="MMMM d, yyyy h:mm aa"
              // selected={values.dateTime}
              selected={new Date(values.dateTime.getTime() + 15 * 60000)}
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
              onChange={(date) =>
                setValues({
                  ...values,
                  dateTime: date!,
                })
              }
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Reunião Criada"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: "Link Copiado" });
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText="Copiar link da reunião"
        />
      )}

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Inicie uma Reunião"
        className="text-center"
        buttonText="Iniciar"
        handleClick={createMeeting}
      />
      <MeetingModal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Copie o link aqui"
        className="text-center"
        buttonText="Juntar-se a uma Reunião"
        handleClick={()=>router.push(values.link)}
      >
        <Input placeholder="Link para Reunião" className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        onChange={(e)=>setValues({...values,link:e.target.value})}
        />
      </MeetingModal>
    </section>
  );
}
