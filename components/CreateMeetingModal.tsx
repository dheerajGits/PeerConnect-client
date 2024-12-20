import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { useForm } from "react-hook-form";

export default function CreateMeetingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { register, setValue, handleSubmit } = useForm();
  const onSubmit = (data: any) => {};
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Schedule Meeting{" "}
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-3 mt-5"
                >
                  <div className="flex flex-col">
                    <label className="text-base text-gray-300">
                      Meeting Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Name of the Meeting"
                      {...register("name", {
                        required: {
                          value: true,
                          message: "Title is required",
                        },
                      })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-base text-gray-300">
                      Start Time{" "}
                    </label>
                    <input
                      type="datetime-local"
                      placeholder="Enter Start Date"
                      {...register("name", {
                        required: {
                          value: true,
                          message: "Start date is required",
                        },
                      })}
                    />{" "}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-base text-gray-300">End Time</label>
                    <input
                      type="datetime-local"
                      placeholder="Enter End Time"
                      {...register("name", {
                        required: {
                          value: true,
                          message: "End Date Time",
                        },
                      })}
                    />{" "}
                  </div>
                  <div className="flex justify-between p-4">
                    <button type="button" onClick={onClose}>
                      Cancel
                    </button>
                    <button type="submit">Schedule</button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
