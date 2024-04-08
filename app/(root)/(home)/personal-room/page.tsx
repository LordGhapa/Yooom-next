"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";


import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useGetCallById from "@/hooks/useGetCallById";

type TableProps = {
  title: string;
  description: string | undefined;
};
const Table = ({ title, description }: TableProps) => {
  return (
    <div className="flex flex-col items-start gap-2 xl:flex-row">
      <h1 className=" text-base font-medium text-sky-1 xl:min-w-32 xl:text-xl ">
        {title}
      </h1>
      <h2 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
        {description}
      </h2>
    </div>
  );
};

export default function PersonalRoom() {
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const { toast } = useToast();

  const meetingId = user?.id;

  const { call } = useGetCallById(meetingId!);

  const startRoom = async () => {
    if (!client || !user) return;

    const newCall = client.call("default", meetingId!);

    if (!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }

    router.push(`/meeting/${meetingId}?personal=true`);
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold ">Sala Pessoal</h1>
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <Table
          title="Assunto:"
          description={`Sala Pessoal ${user?.username}`}
        />
        <Table title="ID:" description={meetingId} />
        <Table title="Link de Convite:" description={meetingLink} />
      </div>
      <div className="flex gap-5 ">
        {" "}
        <Button className="bg-blue-1" onClick={startRoom}>
          Começar Reunião
        </Button>
        <Button
          className="bg-dark-3"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: "Link Copiado" });
          }}
        >
          Copiar Link
        </Button>
      </div>
    </section>
  );
}
