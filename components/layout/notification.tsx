/* eslint-disable import/no-unresolved */
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "../icons";
import { trpc } from "@/utils/trpc";
import { Loader2 } from "lucide-react";
import { notification } from "@prisma/client";

interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdat: string;
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const { data, status, refetch } = trpc.getNotifications.useQuery( { limit: 7 } )
  const markAsReadMutation = trpc.markAsRead.useMutation();
  const markAllAsReadMutation = trpc.markAllAsRead.useMutation();

 
  // const {d : d} = trpc.onNewNotification.useSubscription(
  //   undefined,
  //   {
  //     onData(notification) {
  //       console.log("New notification received:", notification);
  //       setNotifications(prev => [{ ...notification, read: false }, ...prev]);
  //     },
  //     onError(err) {
  //       console.error("Subscription error:", err);
  //     },
  //   }
  // );


  // refetch() after 2 minutes
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refetch();
  //   }, 120000);
  //   return () => clearInterval(interval);
  // }, []);

 


  // useEffect(() => {
  //   console.log("Subscription status:", status);
  // }, [status]);
 

  // useEffect(() => {
  //   if (data) {
  //     setNotifications(data.notifications);
  //   }
  // }, [data]);

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    if (!currentStatus) {
      try {
        await markAsReadMutation.mutateAsync({ id });
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        );
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const unreadCount = data?.unread ?? 0;

  return (  
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-2">
          <Icons.bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 md:w-96" align="end">
        <div className="flex items-center justify-between px-4 py-2 font-semibold border-b">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          {status === "loading" ? (
            <div className="flex justify-center items-center h-20">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : data?.notifications.length > 0 ? (
            data?.notifications.map((notification: notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex items-start p-4 space-x-3 border-b last:border-b-0 ${
                  notification.read ? "bg-white dark:bg-black" : "bg-blue-50 dark:bg-gray-900"
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  <Icons.info className={`h-5 w-5 ${notification.read ? "text-gray-400" : "text-blue-500"}`} />
                </div>
                <div className="flex-grow">
                  <p
                    className={`text-sm ${
                      notification.read ? "text-gray-600" : "text-gray-900 font-medium"
                    }`}
                    dangerouslySetInnerHTML={{ __html: notification.message }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdat).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-shrink-0 text-xs"
                    onClick={() => toggleReadStatus(notification.id, notification.read)}
                  >
                    Mark as read
                  </Button>
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-20 text-gray-500">
              <Icons.inbox className="h-8 w-8 mb-2" />
              <p className="text-sm">No notifications</p>
            </div>
          )}
        </div>
        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                // Here you would typically navigate to a full notifications page
                console.log("View all notifications");
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}