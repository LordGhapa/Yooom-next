import MeetingTypeList from "@/components/MeetingTypeList";
import React from "react";



export default function Home() {
  function getTime() {
    const currentTime = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const timeString = new Intl.DateTimeFormat(undefined, options).format(
      currentTime,
    );
      console.log(currentTime);
      console.log(timeString);
    return timeString;
  }
  
function getDate() {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
  };

  const dateString = new Intl.DateTimeFormat("pt-BR", options).format(
    currentDate,
  );
  return dateString;
}



  const time = getTime();
  const date = getDate();
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="bg-hero sm:h-[300px] w-full rounded-[20px] bg-cover">
        <div className="flex h-full flex-col justify-between max-xl:px-5 max-xl:py-8 lg:p-11">
          {/* <h2 className="glassmorphism max-w-[270px] rounded py-2 text-center text-xs font-normal ">
            Upcoming Meeting at 11:30 AM
          </h2> */}
          <div
            className="flex flex-col gap-2
          "
          >
            <h1 className="text-4xl font-extrabold lg:text-7xl ">{time}</h1>
            <p className="text-sky-1 text-lg font-medium lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>
      <MeetingTypeList />
    </section>
  );
}
