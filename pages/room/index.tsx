import React, { useContext, useEffect, useRef, useState } from "react";
import { RoomContext } from "@/components/RoomContext";
import VideoPlayer from "@/components/VideoPlayer";
import { useForm } from "react-hook-form";
import axios from "axios";
import Loader from "@/components/Loader";
import { CheckIcon, XMarkIcon } from "@heroicons/react/16/solid";

export default function RoomLayout() {
  const { ws, stream, startWebSocketConnection, setStartWebSocketConnection } =
    useContext(RoomContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [meetingDetails, setMeetingDetails] = useState<any>(null);
  const timeout = useRef<NodeJS.Timeout | undefined>();
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm();
  const onSubmit = (values: any) => {
    console.log("form submitted", values);
  };
  const checkRoomValidity = (e: any) => {
    if (!e.target.value) {
      if (isLoading) setIsLoading(false);
      return;
    }
    if (!isLoading) setIsLoading(true);
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    console.log("MAIN_API_URL:");

    timeout.current = setTimeout(async () => {
      try {
        const getMeetingInfo = await axios.get(
          `http://localhost:3030/meeting/${e.target.value}`
        );
        if (getMeetingInfo?.data?.data) {
          setMeetingDetails({
            details: getMeetingInfo?.data?.data,
            status: true,
          });
        } else {
          setMeetingDetails({
            status: false,
          });
        }
      } catch (e) {
        setMeetingDetails({
          status: false,
        });

        console.log("Error in fetching meeting details");
      } finally {
        setIsLoading(false);
      }
    }, 3000);
  };
  useEffect(() => {
    if (!startWebSocketConnection) {
      setStartWebSocketConnection(true);
    }
  });
  return (
    <div className="flex flex-row max-md:flex-wrap-reverse items-center justify-between gap-10 min-h-screen px-[10%]">
      <VideoPlayer
        stream={stream}
        fullWidth={false}
        videoClassName="md:w-[580px] w-[400px]"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="md:min-h-80 max-md:w-80 w-100 flex flex-col items-center justify-center md:gap-8 p-10 border-2"
      >
        <p className="md:text-2xl text-xl">Enter the Details below</p>
        <div className="w-full flex-col items-center">
          <label className="text-lg text-gray-500">
            MEETING ID <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            {...register("roomId", {
              required: "RoomId is required",
            })}
            placeholder="Enter Meeting Id"
            className="w-full p-2 rounded-xl border-2"
            onChange={checkRoomValidity}
          />
          {errors.roomId && (
            <p className="text-red-500 text-sm">
              {(errors.roomId as { message: string }).message}
            </p>
          )}
          {isLoading && (
            <div className="flex flex-row gap-2 items-center">
              <Loader size="h-5 w-5" />
              <b className="text-gray-500 font-extralight ">
                Checking meeting validity
              </b>
            </div>
          )}
          {!isLoading && meetingDetails?.status && (
            <div className="flex flex-row items-center">
              <CheckIcon className="w-5 h-5 text-green-600" />
              <b className="text-gray-500 font-extralight ">
                Id Verified Click "Join Room" to join meeting
              </b>
            </div>
          )}
          {!isLoading && meetingDetails?.status == false && (
            <div className="flex flex-row items-center">
              <XMarkIcon className="w-5 h-5 text-red-600 font-bold" />
              <b className="text-gray-500 font-extralight ">Wrong Meeting Id</b>
            </div>
          )}
        </div>

        <div className="w-full">
          <label className="text-lg text-gray-500">
            NAME <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            {...register("name", {
              required: "Name is required",
            })}
            placeholder="Enter your name"
            className="w-full p-3 rounded-xl border-2"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">
              {(errors.name as { message: string }).message}
            </p>
          )}
        </div>
        <button
          disabled={isLoading || meetingDetails?.status == false}
          type="submit"
          className="bg-green-500 p-2 rounded-lg w-full font-bold text-white hover:bg-green-600 disabled:opacity-70"
        >
          Join Room
        </button>
      </form>
    </div>
  );
}
