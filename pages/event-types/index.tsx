import Head from "next/head";
import Link from "next/link";
import prisma from "../../lib/prisma";
import Shell from "../../components/Shell";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/client";
import React, { Fragment, useRef } from "react";
import { Menu, Transition } from "@headlessui/react";

import {
  ClockIcon,
  DotsHorizontalIcon,
  ExternalLinkIcon,
  InformationCircleIcon,
  LinkIcon,
  PlusIcon,
  UserIcon,
} from "@heroicons/react/solid";
import Loader from "@components/Loader";
import classNames from "@lib/classNames";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@components/Dialog";

export default function Availability({ user, types }) {
  const [session, loading] = useSession();
  const router = useRouter();

  const titleRef = useRef<HTMLInputElement>();
  const slugRef = useRef<HTMLInputElement>();
  const descriptionRef = useRef<HTMLTextAreaElement>();
  const lengthRef = useRef<HTMLInputElement>();

  async function createEventTypeHandler(event) {
    event.preventDefault();

    const enteredTitle = titleRef.current.value;
    const enteredSlug = slugRef.current.value;
    const enteredDescription = descriptionRef.current.value;
    const enteredLength = lengthRef.current.value;

    // TODO: Add validation
    await fetch("/api/availability/eventtype", {
      method: "POST",
      body: JSON.stringify({
        title: enteredTitle,
        slug: enteredSlug,
        description: enteredDescription,
        length: enteredLength,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (enteredTitle && enteredLength) {
      await router.replace(router.asPath);
    }
  }

  function autoPopulateSlug() {
    let t = titleRef.current.value;
    t = t.replace(/\s+/g, "-").toLowerCase();
    slugRef.current.value = t;
  }

  if (loading) {
    return <Loader />;
  }

  const CreateNewEventDialog = () => (
    <Dialog>
      <DialogTrigger className="py-2 px-4 mt-6 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900">
        <PlusIcon className="w-5 h-5 mr-1 inline" />
        New event type
      </DialogTrigger>
      <DialogContent>
        <div className="mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
            Add a new event type
          </h3>
          <div>
            <p className="text-sm text-gray-500">Create a new event type for people to book times with.</p>
          </div>
        </div>
        <form onSubmit={createEventTypeHandler}>
          <div>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <div className="mt-1">
                <input
                  onChange={autoPopulateSlug}
                  ref={titleRef}
                  type="text"
                  name="title"
                  id="title"
                  required
                  className="shadow-sm focus:ring-neutral-900 focus:border-neutral-900 block w-full sm:text-sm border-gray-300 rounded-sm"
                  placeholder="Quick Chat"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                URL
              </label>
              <div className="mt-1">
                <div className="flex rounded-sm shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    {location.hostname}/{user.username}/
                  </span>
                  <input
                    ref={slugRef}
                    type="text"
                    name="slug"
                    id="slug"
                    required
                    className="flex-1 block w-full focus:ring-neutral-900 focus:border-neutral-900 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  ref={descriptionRef}
                  name="description"
                  id="description"
                  className="shadow-sm focus:ring-neutral-900 focus:border-neutral-900 block w-full sm:text-sm border-gray-300 rounded-sm"
                  placeholder="A quick video meeting."></textarea>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="length" className="block text-sm font-medium text-gray-700">
                Length
              </label>
              <div className="mt-1 relative rounded-sm shadow-sm">
                <input
                  ref={lengthRef}
                  type="number"
                  name="length"
                  id="length"
                  required
                  className="focus:ring-neutral-900 focus:border-neutral-900 block w-full pr-20 sm:text-sm border-gray-300 rounded-sm"
                  placeholder="15"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 text-sm">
                  minutes
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button type="submit" className="btn btn-primary">
              Continue
            </button>
            <DialogClose as="button" className="btn btn-white mx-2">
              Cancel
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div>
      <Head>
        <title>Event Types | Calendso</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Shell
        heading="Event Types"
        subtitle="Create events to share for people to book on your calendar."
        CTA={types.length !== 0 && <CreateNewEventDialog />}>
        <div className="bg-white shadow overflow-hidden sm:rounded-sm -mx-4 sm:mx-0">
          <ul className="divide-y divide-neutral-200">
            {types.map((type) => (
              <li key={type.id}>
                <Link href={"/event-types/" + type.id}>
                  <a className="block hover:bg-neutral-50">
                    <div className="px-4 py-4 flex items-center sm:px-6">
                      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                        <div className="truncate">
                          <div className="flex text-sm">
                            <p className="font-medium text-neutral-900 truncate">{type.title}</p>
                            {type.hidden && (
                              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs font-medium bg-yellow-100 text-yellow-800">
                                Hidden
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex space-x-4">
                            <div className="flex items-center text-sm text-neutral-500">
                              <ClockIcon
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-neutral-400"
                                aria-hidden="true"
                              />
                              <p>{type.length}m</p>
                            </div>
                            <div className="flex items-center text-sm text-neutral-500">
                              <UserIcon
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-neutral-400"
                                aria-hidden="true"
                              />
                              <p>1-on-1</p>
                            </div>
                            <div className="flex items-center text-sm text-neutral-500">
                              <InformationCircleIcon
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-neutral-400"
                                aria-hidden="true"
                              />
                              <p>{type.description.substring(0, 100)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                          <div className="flex overflow-hidden space-x-5">
                            <Link href={"/" + session.user.username + "/" + type.slug}>
                              <a className="text-neutral-400">
                                <ExternalLinkIcon className="w-5 h-5" />
                              </a>
                            </Link>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  window.location.hostname + "/" + session.user.username + "/" + type.slug
                                );
                              }}
                              className="text-neutral-400">
                              <LinkIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="ml-5 flex-shrink-0">
                        <Menu as="div" className="inline-block text-left">
                          {({ open }) => (
                            <>
                              <div>
                                <Menu.Button className="text-neutral-400 mt-1">
                                  <span className="sr-only">Open options</span>
                                  <DotsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
                                </Menu.Button>
                              </div>

                              <Transition
                                show={open}
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95">
                                <Menu.Items
                                  static
                                  className="origin-top-right absolute right-0 mt-2 w-56 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-neutral-100">
                                  <div className="py-1">
                                    <Menu.Item>
                                      {({ active }) => (
                                        <a
                                          href={"/" + session.user.username + "/" + type.slug}
                                          target="_blank"
                                          rel="noreferrer"
                                          className={classNames(
                                            active ? "bg-neutral-100 text-neutral-900" : "text-neutral-700",
                                            "group flex items-center px-4 py-2 text-sm font-medium"
                                          )}>
                                          <ExternalLinkIcon
                                            className="mr-3 h-5 w-5 text-neutral-400 group-hover:text-neutral-500"
                                            aria-hidden="true"
                                          />
                                          Preview
                                        </a>
                                      )}
                                    </Menu.Item>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={() => {
                                            navigator.clipboard.writeText(
                                              window.location.hostname +
                                                "/" +
                                                session.user.username +
                                                "/" +
                                                type.slug
                                            );
                                          }}
                                          className={classNames(
                                            active ? "bg-neutral-100 text-neutral-900" : "text-neutral-700",
                                            "group flex items-center px-4 py-2 text-sm w-full font-medium"
                                          )}>
                                          <LinkIcon
                                            className="mr-3 h-5 w-5 text-neutral-400 group-hover:text-neutral-500"
                                            aria-hidden="true"
                                          />
                                          Copy link to event
                                        </button>
                                      )}
                                    </Menu.Item>
                                    {/*<Menu.Item>*/}
                                    {/*  {({ active }) => (*/}
                                    {/*    <a*/}
                                    {/*      href="#"*/}
                                    {/*      className={classNames(*/}
                                    {/*        active ? "bg-neutral-100 text-neutral-900" : "text-neutral-700",*/}
                                    {/*        "group flex items-center px-4 py-2 text-sm font-medium"*/}
                                    {/*      )}>*/}
                                    {/*      <DuplicateIcon*/}
                                    {/*        className="mr-3 h-5 w-5 text-neutral-400 group-hover:text-neutral-500"*/}
                                    {/*        aria-hidden="true"*/}
                                    {/*      />*/}
                                    {/*      Duplicate*/}
                                    {/*    </a>*/}
                                    {/*  )}*/}
                                    {/*</Menu.Item>*/}
                                  </div>
                                  {/*<div className="py-1">*/}
                                  {/*  <Menu.Item>*/}
                                  {/*    {({ active }) => (*/}
                                  {/*      <a*/}
                                  {/*        href="#"*/}
                                  {/*        className={classNames(*/}
                                  {/*          active ? "bg-red-100 text-red-900" : "text-red-700",*/}
                                  {/*          "group flex items-center px-4 py-2 text-sm font-medium"*/}
                                  {/*        )}>*/}
                                  {/*        <TrashIcon*/}
                                  {/*          className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-700"*/}
                                  {/*          aria-hidden="true"*/}
                                  {/*        />*/}
                                  {/*        Delete*/}
                                  {/*      </a>*/}
                                  {/*    )}*/}
                                  {/*  </Menu.Item>*/}
                                  {/*</div>*/}
                                </Menu.Items>
                              </Transition>
                            </>
                          )}
                        </Menu>
                      </div>
                    </div>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {types.length === 0 && (
          <div className="md:py-20">
            <svg
              className="w-1/2 md:w-32 mx-auto block mb-4"
              viewBox="0 0 132 132"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <rect
                x="1.48387"
                y="1.48387"
                width="129.032"
                height="129.032"
                rx="64.5161"
                fill="white"
                stroke="white"
                strokeWidth="1.03226"
              />
              <mask
                id="mask0"
                mask-type="alpha"
                maskUnits="userSpaceOnUse"
                x="2"
                y="2"
                width="128"
                height="128">
                <rect x="2" y="2" width="128" height="128" rx="64" fill="white" />
              </mask>
              <g mask="url(#mask0)">
                <rect x="56.1936" y="40.1936" width="20.129" height="2.06452" rx="0.516129" fill="#708097" />
                <rect x="47.9355" y="44.8387" width="36.6452" height="2.06452" rx="0.516129" fill="#C6CCD5" />
                <g filter="url(#filter0_dd)">
                  <rect width="115.84" height="83.2303" transform="translate(8.07983 53.52)" fill="#F7F8F9" />
                  <path
                    d="M15.7699 61.589V63.5013H16.1023V62.1847H16.1201L16.6486 63.4957H16.8969L17.4254 62.1875H17.4432V63.5013H17.7756V61.589H17.3517L16.7839 62.9747H16.7615L16.1938 61.589H15.7699ZM19.993 62.5451C19.993 61.927 19.6158 61.5628 19.1144 61.5628C18.612 61.5628 18.2357 61.927 18.2357 62.5451C18.2357 63.1623 18.612 63.5274 19.1144 63.5274C19.6158 63.5274 19.993 63.1633 19.993 62.5451ZM19.6447 62.5451C19.6447 62.9803 19.4262 63.2165 19.1144 63.2165C18.8034 63.2165 18.584 62.9803 18.584 62.5451C18.584 62.11 18.8034 61.8738 19.1144 61.8738C19.4262 61.8738 19.6447 62.11 19.6447 62.5451Z"
                    fill="#657388"
                  />
                  <path
                    d="M32.1112 61.8794H32.7022V63.5013H33.0459V61.8794H33.6369V61.589H32.1112V61.8794ZM35.268 61.589V62.8094C35.268 63.0494 35.1008 63.2212 34.8385 63.2212C34.5751 63.2212 34.4089 63.0494 34.4089 62.8094V61.589H34.0625V62.8383C34.0625 63.2492 34.3706 63.5302 34.8385 63.5302C35.3044 63.5302 35.6144 63.2492 35.6144 62.8383V61.589H35.268Z"
                    fill="#657388"
                  />
                  <path
                    d="M48.3554 63.5013H48.6971L49.0809 62.1595H49.0958L49.4786 63.5013H49.8204L50.3601 61.589H49.9875L49.643 62.9952H49.6262L49.2573 61.589H48.9184L48.5505 62.9943H48.5328L48.1882 61.589H47.8157L48.3554 63.5013ZM50.7318 63.5013H51.983V63.2109H51.0782V62.6889H51.9111V62.3985H51.0782V61.8794H51.9755V61.589H50.7318V63.5013Z"
                    fill="#657388"
                  />
                  <path
                    d="M64.1925 61.8794H64.7836V63.5013H65.1272V61.8794H65.7183V61.589H64.1925V61.8794ZM66.1439 63.5013H66.4903V62.6889H67.3764V63.5013H67.7237V61.589H67.3764V62.3985H66.4903V61.589H66.1439V63.5013Z"
                    fill="#657388"
                  />
                  <path
                    d="M80.545 63.5013H80.8914V62.6889H81.686V62.3985H80.8914V61.8794H81.7701V61.589H80.545V63.5013ZM82.2171 63.5013H82.5636V62.801H82.9165L83.2919 63.5013H83.6784L83.2648 62.7431C83.4898 62.6525 83.6084 62.4602 83.6084 62.2006C83.6084 61.8355 83.3731 61.589 82.9342 61.589H82.2171V63.5013ZM82.5636 62.5134V61.8784H82.881C83.1397 61.8784 83.2555 61.997 83.2555 62.2006C83.2555 62.4041 83.1397 62.5134 82.8829 62.5134H82.5636Z"
                    fill="#657388"
                  />
                  <path
                    d="M97.4678 62.1147H97.8011C97.7946 61.7916 97.5191 61.5628 97.112 61.5628C96.7105 61.5628 96.4089 61.7888 96.4098 62.1268C96.4098 62.4013 96.605 62.5591 96.9197 62.6404L97.1372 62.6964C97.3436 62.7487 97.4799 62.8131 97.4808 62.9616C97.4799 63.125 97.3249 63.2342 97.0989 63.2342C96.8823 63.2342 96.7142 63.1371 96.7002 62.9364H96.3594C96.3734 63.3164 96.6563 63.5302 97.1017 63.5302C97.5602 63.5302 97.8263 63.3015 97.8273 62.9644C97.8263 62.6329 97.5527 62.4816 97.2651 62.4135L97.0859 62.3687C96.929 62.3313 96.7591 62.265 96.7609 62.1053C96.7619 61.9615 96.8907 61.856 97.1073 61.856C97.3137 61.856 97.45 61.9522 97.4678 62.1147ZM98.4823 63.5013L98.6401 63.0297H99.3591L99.5178 63.5013H99.8876L99.2134 61.589H98.7858L98.1126 63.5013H98.4823ZM98.7335 62.7515L98.9921 61.9812H99.0071L99.2657 62.7515H98.7335Z"
                    fill="#657388"
                  />
                  <path
                    d="M113.487 62.1147H113.82C113.814 61.7916 113.538 61.5628 113.131 61.5628C112.73 61.5628 112.428 61.7888 112.429 62.1268C112.429 62.4013 112.624 62.5591 112.939 62.6404L113.157 62.6964C113.363 62.7487 113.499 62.8131 113.5 62.9616C113.499 63.125 113.344 63.2342 113.118 63.2342C112.902 63.2342 112.734 63.1371 112.72 62.9364H112.379C112.393 63.3164 112.676 63.5302 113.121 63.5302C113.58 63.5302 113.846 63.3015 113.847 62.9644C113.846 62.6329 113.572 62.4816 113.285 62.4135L113.105 62.3687C112.948 62.3313 112.778 62.265 112.78 62.1053C112.781 61.9615 112.91 61.856 113.127 61.856C113.333 61.856 113.469 61.9522 113.487 62.1147ZM115.492 61.589V62.8094C115.492 63.0494 115.325 63.2212 115.063 63.2212C114.8 63.2212 114.633 63.0494 114.633 62.8094V61.589H114.287V62.8383C114.287 63.2492 114.595 63.5302 115.063 63.5302C115.529 63.5302 115.839 63.2492 115.839 62.8383V61.589H115.492Z"
                    fill="#657388"
                  />
                  <rect x="9.83276" y="70.2902" width="112.334" height="0.516129" fill="white" />
                  <path
                    d="M66.3454 77.5155H66.0366L65.3992 77.9388V78.2525L66.0217 77.8392H66.0366V80.0652H66.3454V77.5155Z"
                    fill="#9BA6B6"
                  />
                  <path
                    d="M81.2501 80.0652H82.8586V79.7913H81.6734V79.7714L82.2461 79.1588C82.6843 78.6895 82.8138 78.4704 82.8138 78.1877C82.8138 77.7943 82.4951 77.4806 82.0469 77.4806C81.6 77.4806 81.2601 77.7844 81.2601 78.2326H81.5539C81.5539 77.9425 81.7419 77.7495 82.0369 77.7495C82.3133 77.7495 82.525 77.9188 82.525 78.1877C82.525 78.4231 82.3868 78.5973 82.0917 78.9198L81.2501 79.8411V80.0652Z"
                    fill="#9BA6B6"
                  />
                  <path
                    d="M98.1047 80.1C98.599 80.1 98.9662 79.79 98.9662 79.373C98.9662 79.0493 98.7745 78.814 98.4533 78.7604V78.7405C98.711 78.6621 98.8716 78.4504 98.8716 78.1628C98.8716 77.8018 98.5865 77.4806 98.1147 77.4806C97.6739 77.4806 97.3079 77.752 97.293 78.1529H97.5918C97.603 77.8989 97.8445 77.7495 98.1097 77.7495C98.3911 77.7495 98.5728 77.9201 98.5728 78.1778C98.5728 78.4467 98.3624 78.621 98.0599 78.621H97.8557V78.8949H98.0599C98.4471 78.8949 98.6625 79.0916 98.6625 79.373C98.6625 79.6431 98.4272 79.8261 98.0997 79.8261C97.8047 79.8261 97.5706 79.6743 97.5519 79.4278H97.2382C97.2569 79.8286 97.6105 80.1 98.1047 80.1Z"
                    fill="#9BA6B6"
                  />
                  <path
                    d="M113.222 79.5423H114.423V80.0652H114.716V79.5423H115.065V79.2684H114.716V77.5155H114.343L113.222 79.2883V79.5423ZM114.423 79.2684H113.556V79.2485L114.403 77.9089H114.423V79.2684Z"
                    fill="#9BA6B6"
                  />
                  <path
                    d="M17.8508 96.1477C18.3364 96.1477 18.6925 95.7892 18.6925 95.3011C18.6925 94.8069 18.3488 94.4446 17.8807 94.4446C17.7089 94.4446 17.5421 94.5056 17.4375 94.589H17.4226L17.5122 93.837H18.5779V93.5631H17.2533L17.0989 94.8181L17.3877 94.8529C17.4935 94.777 17.6741 94.7222 17.8309 94.7235C18.1559 94.7259 18.3937 94.9724 18.3937 95.3061C18.3937 95.6335 18.1646 95.8738 17.8508 95.8738C17.5894 95.8738 17.3815 95.7057 17.3578 95.4754H17.059C17.0777 95.8639 17.4126 96.1477 17.8508 96.1477Z"
                    fill="#9BA6B6"
                  />
                  <rect x="26.3188" y="87.2924" width="15.1717" height="15.1717" fill="#DBEAFE" />
                  <path
                    d="M33.9284 96.1478C34.4786 96.1516 34.8484 95.7731 34.8472 95.2689C34.8484 94.7871 34.5048 94.4385 34.0578 94.4385C33.7839 94.4385 33.5424 94.5717 33.4204 94.7908H33.403C33.4042 94.2542 33.6009 93.928 33.9545 93.928C34.1736 93.928 34.3218 94.055 34.3691 94.2505H34.8235C34.7687 93.8384 34.4363 93.5284 33.9545 93.5284C33.342 93.5284 32.9548 94.0388 32.9548 94.9103C32.9535 95.8453 33.4391 96.1453 33.9284 96.1478ZM33.9259 95.7743C33.6532 95.7743 33.454 95.549 33.4528 95.2826C33.4553 95.0149 33.6619 94.7908 33.9321 94.7908C34.2023 94.7908 34.4002 95.0049 34.399 95.2788C34.4002 95.5577 34.196 95.7743 33.9259 95.7743Z"
                    fill="#3B82F6"
                  />
                  <circle cx="34.1386" cy="99.9637" r="0.657352" fill="#3B82F6" />
                  <rect x="42.3665" y="87.2924" width="15.1717" height="15.1717" fill="#DBEAFE" />
                  <path
                    d="M49.2434 96.113H49.7228L50.8059 93.9579V93.5632H49.0691V93.9492H50.3278V93.9666L49.2434 96.113Z"
                    fill="#3B82F6"
                  />
                  <rect x="58.4143" y="87.2924" width="15.1717" height="15.1717" fill="#DBEAFE" />
                  <path
                    d="M66.0013 96.1478C66.5528 96.1478 66.9475 95.8441 66.9487 95.4295C66.9475 95.1108 66.7122 94.8443 66.4159 94.7945V94.7771C66.6736 94.7198 66.8529 94.4883 66.8541 94.2119C66.8529 93.8197 66.4918 93.5284 66.0013 93.5284C65.5071 93.5284 65.146 93.8185 65.1473 94.2119C65.146 94.4883 65.3228 94.7198 65.5855 94.7771V94.7945C65.2842 94.8443 65.0514 95.1108 65.0526 95.4295C65.0514 95.8441 65.4448 96.1478 66.0013 96.1478ZM66.0013 95.7918C65.7125 95.7918 65.5257 95.6324 65.5282 95.3971C65.5257 95.1531 65.7262 94.98 66.0013 94.98C66.2727 94.98 66.4719 95.1543 66.4744 95.3971C66.4719 95.6324 66.2864 95.7918 66.0013 95.7918ZM66.0013 94.6302C65.7648 94.6302 65.5955 94.4771 65.5979 94.2555C65.5955 94.0363 65.7598 93.8894 66.0013 93.8894C66.2391 93.8894 66.4022 94.0363 66.4047 94.2555C66.4022 94.4783 66.2341 94.6302 66.0013 94.6302Z"
                    fill="#3B82F6"
                  />
                  <rect x="74.4617" y="87.2924" width="15.1717" height="15.1717" fill="#DBEAFE" />
                  <path
                    d="M82.0226 93.5284C81.4698 93.5247 81.1026 93.9044 81.1026 94.4024C81.1038 94.8829 81.4462 95.2303 81.8931 95.2303C82.1683 95.2303 82.4073 95.0971 82.5306 94.878H82.548C82.5468 95.4233 82.3488 95.7482 81.9965 95.7482C81.7761 95.7482 81.628 95.6212 81.5819 95.4183H81.1275C81.1798 95.8403 81.5134 96.1478 81.9965 96.1478C82.6078 96.1478 82.9974 95.6374 82.9962 94.7597C82.995 93.8309 82.5119 93.5309 82.0226 93.5284ZM82.0239 93.9019C82.2965 93.9019 82.497 94.1285 82.497 94.3887C82.4982 94.6526 82.2878 94.8792 82.0189 94.8792C81.7475 94.8792 81.552 94.6651 81.5508 94.3924C81.5508 94.1185 81.7537 93.9019 82.0239 93.9019Z"
                    fill="#3B82F6"
                  />
                  <rect x="90.5098" y="87.2924" width="15.1717" height="15.1717" fill="#DBEAFE" />
                  <path
                    d="M97.3476 93.5632H96.9081L96.2744 93.9704V94.3937L96.8708 94.0127H96.8857V96.113H97.3476V93.5632ZM98.9375 96.1615C99.5525 96.1628 99.9197 95.6772 99.9197 94.8406C99.9197 94.009 99.55 93.5284 98.9375 93.5284C98.3249 93.5284 97.9564 94.0077 97.9552 94.8406C97.9552 95.676 98.3224 96.1615 98.9375 96.1615ZM98.9375 95.7719C98.62 95.7719 98.4208 95.4531 98.422 94.8406C98.4233 94.233 98.6212 93.9131 98.9375 93.9131C99.2549 93.9131 99.4529 94.233 99.4541 94.8406C99.4541 95.4531 99.2562 95.7719 98.9375 95.7719Z"
                    fill="#3B82F6"
                  />
                  <path
                    d="M113.674 93.5632H113.365L112.727 93.9865V94.3003L113.35 93.8869H113.365V96.113H113.674V93.5632ZM115.303 93.5632H114.995L114.357 93.9865V94.3003L114.98 93.8869H114.995V96.113H115.303V93.5632Z"
                    fill="#9BA6B6"
                  />
                  <rect x="10.2712" y="103.34" width="15.1717" height="15.1717" fill="#DBEAFE" />
                  <path
                    d="M17.1895 109.611H16.7501L16.1164 110.018V110.441L16.7127 110.06H16.7276V112.161H17.1895V109.611ZM17.8369 112.161H19.5849V111.775H18.4744V111.757L18.9138 111.31C19.4093 110.835 19.5463 110.603 19.5463 110.316C19.5463 109.889 19.1989 109.576 18.686 109.576C18.1805 109.576 17.822 109.89 17.822 110.374H18.2615C18.2615 110.114 18.4258 109.951 18.6798 109.951C18.9226 109.951 19.1031 110.099 19.1031 110.339C19.1031 110.552 18.9736 110.704 18.7221 110.959L17.8369 111.827V112.161Z"
                    fill="#3B82F6"
                  />
                  <rect x="26.3188" y="103.34" width="15.1717" height="15.1717" fill="#DBEAFE" />
                  <path
                    d="M33.1843 109.611H32.7448L32.1111 110.018V110.441L32.7075 110.06H32.7224V112.161H33.1843V109.611ZM34.7468 112.196C35.2921 112.196 35.6892 111.883 35.688 111.452C35.6892 111.134 35.49 110.905 35.1327 110.853V110.834C35.4091 110.774 35.5946 110.568 35.5934 110.282C35.5946 109.894 35.2634 109.576 34.7542 109.576C34.2587 109.576 33.8753 109.871 33.8653 110.298H34.3098C34.3173 110.084 34.5165 109.951 34.7518 109.951C34.9895 109.951 35.1477 110.095 35.1464 110.309C35.1477 110.532 34.9634 110.68 34.6995 110.68H34.4741V111.036H34.6995C35.0219 111.036 35.2136 111.198 35.2124 111.429C35.2136 111.654 35.0182 111.808 34.7455 111.808C34.4891 111.808 34.2911 111.675 34.2799 111.467H33.8118C33.8242 111.898 34.2089 112.196 34.7468 112.196Z"
                    fill="#3B82F6"
                  />
                  <rect x="42.3665" y="103.34" width="15.1717" height="15.1717" fill="#DBEAFE" />
                  <path
                    d="M49.2063 109.611H48.7668L48.1331 110.018V110.441L48.7294 110.06H48.7444V112.161H49.2063V109.611ZM49.8076 111.688H51.0239V112.161H51.4647V111.688H51.7908V111.308H51.4647V109.611H50.8895L49.8076 111.32V111.688ZM51.0289 111.308H50.2807V111.288L51.009 110.134H51.0289V111.308Z"
                    fill="#3B82F6"
                  />
                  <path
                    d="M65.2789 109.611H64.9702L64.3327 110.034V110.348L64.9552 109.935H64.9702V112.161H65.2789V109.611ZM66.809 112.196C67.2945 112.196 67.6506 111.837 67.6506 111.349C67.6506 110.855 67.307 110.492 66.8389 110.492C66.6671 110.492 66.5002 110.553 66.3957 110.637H66.3807L66.4704 109.885H67.5361V109.611H66.2114L66.057 110.866L66.3459 110.901C66.4517 110.825 66.6322 110.77 66.7891 110.771C67.114 110.774 67.3518 111.02 67.3518 111.354C67.3518 111.681 67.1227 111.922 66.809 111.922C66.5476 111.922 66.3396 111.754 66.316 111.523H66.0172C66.0359 111.912 66.3708 112.196 66.809 112.196Z"
                    fill="#9BA6B6"
                  />
                  <rect x="74.4617" y="103.34" width="15.1717" height="15.1717" fill="#DBEAFE" />
                  <path
                    d="M81.3323 109.611H80.8928L80.2591 110.018V110.441L80.8554 110.06H80.8704V112.161H81.3323V109.611ZM82.9134 112.196C83.4637 112.199 83.8335 111.821 83.8322 111.317C83.8335 110.835 83.4898 110.486 83.0429 110.486C82.769 110.486 82.5275 110.619 82.4055 110.839H82.388C82.3893 110.302 82.586 109.976 82.9396 109.976C83.1587 109.976 83.3068 110.103 83.3541 110.298H83.8086C83.7538 109.886 83.4214 109.576 82.9396 109.576C82.327 109.576 81.9398 110.087 81.9398 110.958C81.9386 111.893 82.4241 112.193 82.9134 112.196ZM82.9109 111.822C82.6383 111.822 82.4391 111.597 82.4378 111.33C82.4403 111.063 82.647 110.839 82.9171 110.839C83.1873 110.839 83.3853 111.053 83.384 111.327C83.3853 111.605 83.1811 111.822 82.9109 111.822Z"
                    fill="#3B82F6"
                  />
                  <path
                    d="M97.4394 109.611H97.1307L96.4932 110.034V110.348L97.1157 109.935H97.1307V112.161H97.4394V109.611ZM98.2524 112.161H98.5761L99.7115 109.9V109.611H98.0781V109.885H99.3928V109.905L98.2524 112.161Z"
                    fill="#9BA6B6"
                  />
                  <path
                    d="M113.408 109.611H113.1L112.462 110.034V110.348L113.085 109.935H113.1V112.161H113.408V109.611ZM114.958 112.196C115.467 112.196 115.822 111.898 115.825 111.483C115.822 111.161 115.607 110.887 115.332 110.836V110.821C115.571 110.759 115.728 110.525 115.73 110.253C115.728 109.865 115.402 109.576 114.958 109.576C114.51 109.576 114.184 109.865 114.186 110.253C114.184 110.525 114.341 110.759 114.585 110.821V110.836C114.305 110.887 114.089 111.161 114.092 111.483C114.089 111.898 114.444 112.196 114.958 112.196ZM114.958 111.922C114.608 111.922 114.393 111.742 114.396 111.469C114.393 111.181 114.631 110.976 114.958 110.976C115.281 110.976 115.519 111.181 115.521 111.469C115.519 111.742 115.303 111.922 114.958 111.922ZM114.958 110.712C114.679 110.712 114.483 110.537 114.485 110.273C114.483 110.014 114.672 109.845 114.958 109.845C115.24 109.845 115.429 110.014 115.431 110.273C115.429 110.537 115.232 110.712 114.958 110.712Z"
                    fill="#9BA6B6"
                  />
                  <rect x="10.2712" y="119.388" width="15.1717" height="15.1717" fill="#DBEAFE" />
                  <path
                    d="M17.1416 125.659H16.7021L16.0684 126.066V126.489L16.6648 126.108H16.6797V128.208H17.1416V125.659ZM18.6742 125.624C18.1214 125.62 17.7541 126 17.7541 126.498C17.7554 126.978 18.0978 127.326 18.5447 127.326C18.8198 127.326 19.0589 127.192 19.1821 126.973H19.1996C19.1983 127.519 19.0004 127.844 18.648 127.844C18.4277 127.844 18.2795 127.717 18.2335 127.514H17.779C17.8313 127.936 18.165 128.243 18.648 128.243C19.2593 128.243 19.649 127.733 19.6478 126.855C19.6465 125.926 19.1635 125.626 18.6742 125.624ZM18.6754 125.997C18.9481 125.997 19.1485 126.224 19.1485 126.484C19.1498 126.748 18.9394 126.975 18.6704 126.975C18.399 126.975 18.2036 126.76 18.2023 126.488C18.2023 126.214 18.4053 125.997 18.6754 125.997Z"
                    fill="#3B82F6"
                  />
                  <rect x="26.3188" y="119.388" width="15.1717" height="15.1717" fill="#DBEAFE" />
                  <path
                    d="M31.8734 128.208H33.6213V127.822H32.5108V127.805L32.9503 127.358C33.4458 126.882 33.5827 126.651 33.5827 126.363C33.5827 125.936 33.2354 125.624 32.7224 125.624C32.217 125.624 31.8584 125.937 31.8584 126.422H32.2979C32.2979 126.162 32.4622 125.998 32.7162 125.998C32.959 125.998 33.1395 126.147 33.1395 126.387C33.1395 126.6 33.01 126.752 32.7585 127.007L31.8734 127.875V128.208ZM34.9933 128.257C35.6083 128.258 35.9756 127.773 35.9756 126.936C35.9756 126.104 35.6058 125.624 34.9933 125.624C34.3808 125.624 34.0122 126.103 34.011 126.936C34.011 127.771 34.3783 128.257 34.9933 128.257ZM34.9933 127.867C34.6758 127.867 34.4766 127.548 34.4779 126.936C34.4791 126.328 34.6771 126.008 34.9933 126.008C35.3108 126.008 35.5087 126.328 35.51 126.936C35.51 127.548 35.312 127.867 34.9933 127.867Z"
                    fill="#3B82F6"
                  />
                  <rect x="42.3665" y="119.388" width="15.1717" height="15.1717" fill="#DBEAFE" />
                  <path
                    d="M48.2479 128.208H49.9959V127.822H48.8854V127.805L49.3248 127.358C49.8203 126.882 49.9573 126.651 49.9573 126.363C49.9573 125.936 49.6099 125.624 49.097 125.624C48.5915 125.624 48.233 125.937 48.233 126.422H48.6725C48.6725 126.162 48.8368 125.998 49.0908 125.998C49.3335 125.998 49.5141 126.147 49.5141 126.387C49.5141 126.6 49.3846 126.752 49.1331 127.007L48.2479 127.875V128.208ZM51.4625 125.659H51.023L50.3893 126.066V126.489L50.9856 126.108H51.0006V128.208H51.4625V125.659Z"
                    fill="#3B82F6"
                  />
                  <rect x="58.4143" y="119.388" width="15.1717" height="15.1717" fill="#DBEAFE" />
                  <path
                    d="M64.049 128.208H65.797V127.822H64.6865V127.805L65.1259 127.358C65.6214 126.882 65.7584 126.651 65.7584 126.363C65.7584 125.936 65.411 125.624 64.8981 125.624C64.3926 125.624 64.0341 125.937 64.0341 126.422H64.4736C64.4736 126.162 64.6379 125.998 64.8919 125.998C65.1347 125.998 65.3152 126.147 65.3152 126.387C65.3152 126.6 65.1857 126.752 64.9342 127.007L64.049 127.875V128.208ZM66.2265 128.208H67.9745V127.822H66.8639V127.805L67.3034 127.358C67.7989 126.882 67.9359 126.651 67.9359 126.363C67.9359 125.936 67.5885 125.624 67.0756 125.624C66.5701 125.624 66.2116 125.937 66.2116 126.422H66.651C66.651 126.162 66.8154 125.998 67.0694 125.998C67.3121 125.998 67.4927 126.147 67.4927 126.387C67.4927 126.6 67.3632 126.752 67.1117 127.007L66.2265 127.875V128.208Z"
                    fill="#3B82F6"
                  />
                  <rect x="74.4617" y="119.388" width="15.1717" height="15.1717" fill="#DBEAFE" />
                  <path
                    d="M80.0436 128.208H81.7915V127.822H80.681V127.805L81.1205 127.358C81.616 126.882 81.7529 126.651 81.7529 126.363C81.7529 125.936 81.4056 125.624 80.8926 125.624C80.3872 125.624 80.0286 125.937 80.0286 126.422H80.4681C80.4681 126.162 80.6324 125.998 80.8864 125.998C81.1292 125.998 81.3097 126.147 81.3097 126.387C81.3097 126.6 81.1802 126.752 80.9287 127.007L80.0436 127.875V128.208ZM83.1361 128.243C83.6814 128.243 84.0786 127.931 84.0773 127.5C84.0786 127.181 83.8794 126.952 83.5221 126.901V126.881C83.7984 126.821 83.9839 126.616 83.9827 126.33C83.9839 125.941 83.6528 125.624 83.1436 125.624C82.6481 125.624 82.2646 125.919 82.2547 126.346H82.6991C82.7066 126.132 82.9058 125.998 83.1411 125.998C83.3789 125.998 83.537 126.143 83.5357 126.357C83.537 126.58 83.3527 126.728 83.0888 126.728H82.8635V127.084H83.0888C83.4112 127.084 83.603 127.246 83.6017 127.476C83.603 127.702 83.4075 127.856 83.1349 127.856C82.8784 127.856 82.6804 127.723 82.6692 127.515H82.2011C82.2136 127.946 82.5983 128.243 83.1361 128.243Z"
                    fill="#3B82F6"
                  />
                  <path
                    d="M96.2007 128.208H97.8092V127.934H96.624V127.914L97.1967 127.302C97.6349 126.833 97.7644 126.613 97.7644 126.331C97.7644 125.937 97.4456 125.624 96.9975 125.624C96.5505 125.624 96.2106 125.928 96.2106 126.376H96.5044C96.5044 126.086 96.6924 125.893 96.9875 125.893C97.2639 125.893 97.4755 126.062 97.4755 126.331C97.4755 126.566 97.3373 126.74 97.0423 127.063L96.2007 127.984V128.208ZM98.2088 127.685H99.409V128.208H99.7028V127.685H100.051V127.412H99.7028V125.659H99.3293L98.2088 127.431V127.685ZM99.409 127.412H98.5425V127.392L99.3891 126.052H99.409V127.412Z"
                    fill="#9BA6B6"
                  />
                  <path
                    d="M112.279 128.208H113.888V127.934H112.702V127.914L113.275 127.302C113.713 126.833 113.843 126.613 113.843 126.331C113.843 125.937 113.524 125.624 113.076 125.624C112.629 125.624 112.289 125.928 112.289 126.376H112.583C112.583 126.086 112.771 125.893 113.066 125.893C113.342 125.893 113.554 126.062 113.554 126.331C113.554 126.566 113.416 126.74 113.121 127.063L112.279 127.984V128.208ZM115.199 128.243C115.684 128.243 116.04 127.885 116.04 127.397C116.04 126.902 115.697 126.54 115.228 126.54C115.057 126.54 114.89 126.601 114.785 126.684H114.77L114.86 125.932H115.926V125.659H114.601L114.447 126.914L114.735 126.948C114.841 126.872 115.022 126.818 115.179 126.819C115.504 126.821 115.741 127.068 115.741 127.402C115.741 127.729 115.512 127.969 115.199 127.969C114.937 127.969 114.729 127.801 114.706 127.571H114.407C114.425 127.959 114.76 128.243 115.199 128.243Z"
                    fill="#9BA6B6"
                  />
                </g>
              </g>
              <g clipPath="url(#clip0)">
                <path
                  d="M54.1289 22.6026C54.1289 16.0129 59.4709 10.671 66.0605 10.671C72.6502 10.671 77.9922 16.0129 77.9922 22.6026C77.9922 29.1923 72.6502 34.5342 66.0605 34.5342C59.4709 34.5342 54.1289 29.1923 54.1289 22.6026Z"
                  fill="#F4F5F6"
                />
                <path
                  d="M77.7885 31.2806C77.9226 31.4509 77.9922 31.6625 77.9922 31.8793V33.5352C77.9922 34.0875 77.5445 34.5352 76.9922 34.5352H55.1289C54.5766 34.5352 54.1289 34.0875 54.1289 33.5352V31.889C54.1289 31.673 54.198 31.4621 54.3312 31.2921C55.6901 29.5582 57.4178 28.1462 59.3905 27.1595C61.4626 26.1232 63.7478 25.5845 66.0645 25.5865C70.8206 25.5865 75.0583 27.8133 77.7885 31.2806ZM70.0397 19.6197C70.0397 20.6745 69.6207 21.6861 68.8748 22.432C68.129 23.1779 67.1173 23.5969 66.0625 23.5969C65.0077 23.5969 63.9961 23.1779 63.2502 22.432C62.5043 21.6861 62.0853 20.6745 62.0853 19.6197C62.0853 18.5648 62.5043 17.5532 63.2502 16.8074C63.9961 16.0615 65.0077 15.6425 66.0625 15.6425C67.1173 15.6425 68.129 16.0615 68.8748 16.8074C69.6207 17.5532 70.0397 18.5648 70.0397 19.6197Z"
                  fill="#708097"
                />
              </g>
              <defs>
                <filter
                  id="filter0_dd"
                  x="5.49919"
                  y="53.0038"
                  width="121.001"
                  height="88.3916"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feMorphology
                    radius="0.516129"
                    operator="erode"
                    in="SourceAlpha"
                    result="effect1_dropShadow"
                  />
                  <feOffset dy="1.03226" />
                  <feGaussianBlur stdDeviation="1.03226" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feMorphology
                    radius="0.516129"
                    operator="erode"
                    in="SourceAlpha"
                    result="effect2_dropShadow"
                  />
                  <feOffset dy="2.06452" />
                  <feGaussianBlur stdDeviation="1.54839" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                  <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
                </filter>
                <clipPath id="clip0">
                  <path
                    d="M54.1289 22.6026C54.1289 16.0129 59.4709 10.671 66.0605 10.671C72.6502 10.671 77.9922 16.0129 77.9922 22.6026C77.9922 29.1923 72.6502 34.5342 66.0605 34.5342C59.4709 34.5342 54.1289 29.1923 54.1289 22.6026Z"
                    fill="white"
                  />
                </clipPath>
              </defs>
            </svg>
            <div className="text-center block md:max-w-screen-sm mx-auto">
              <h3 className="mt-2 text-xl font-bold text-neutral-900">Create your first event type</h3>
              <p className="mt-1 text-md text-neutral-600">
                Event types enable you to share links that show available times on your calendar and allow
                people to make bookings with you.
              </p>
              <CreateNewEventDialog />
            </div>
          </div>
        )}
      </Shell>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { permanent: false, destination: "/auth/login" } };
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      username: true,
      startTime: true,
      endTime: true,
      bufferTime: true,
    },
  });

  const types = await prisma.eventType.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      length: true,
      hidden: true,
    },
  });
  return {
    props: { user, types }, // will be passed to the page component as props
  };
}
