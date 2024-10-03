"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  PersonIcon,
  Pencil1Icon,
  SpeakerLoudIcon,
  ImageIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import MessageBoxChat from "../MessageBoxChat";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { OpenAIModel, ChatBody } from "@/types/types";

export default function Chat() {
  const { theme, setTheme } = useTheme();
  const [inputOnSubmit, setInputOnSubmit] = useState<string>("");
  const [inputMessage, setInputMessage] = useState<string>("");
  const [outputCode, setOutputCode] = useState<string>("");
  const [model, setModel] = useState<OpenAIModel>("gpt-3.5-turbo");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<
    Array<{ type: "user" | "ai"; content: string }>
  >([]);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState<boolean>(false);

  const handleTranslate = async () => {
    const maxCodeLength = 700;

    if (!inputMessage) {
      alert("Please enter your message.");
      return;
    }

    if (inputMessage.length > maxCodeLength) {
      alert(
        `Please enter a message less than ${maxCodeLength} characters. You are currently at ${inputMessage.length} characters.`,
      );
      return;
    }

    setInputOnSubmit(inputMessage);
    setMessages([...messages, { type: "user", content: inputMessage }]);
    setOutputCode(" ");
    setLoading(true);

    const controller = new AbortController();
    const body: ChatBody = {
      inputMessage,
      model,
    };

    try {
      const response = await fetch("/api/chatAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = response.body;
      if (!data) {
        throw new Error("No data received");
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedResponse = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        accumulatedResponse += chunkValue;
        setOutputCode((prevCode) => prevCode + chunkValue);
      }

      setMessages([
        ...messages,
        { type: "user", content: inputMessage },
        { type: "ai", content: accumulatedResponse },
      ]);
      setInputMessage("");
    } catch (error) {
      console.error("Error in API call:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle image upload logic here
      console.log("Image uploaded:", file);
      setIsImageUploadOpen(false);
    }
  };

  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <div className="text-center text-gray-500 dark:text-gray-400 my-8">
          <p className="mb-4">No messages yet. Try one of these prompts:</p>
          <Button
            onClick={() =>
              setInputMessage("When did the rainforest get Alligators?")
            }
            className="m-2"
          >
            When did the rainforest get Alligators?
          </Button>
          <Button
            onClick={() =>
              setInputMessage(
                "What are the main reasons for the recent Teesta Flood?",
              )
            }
            className="m-2"
          >
            What are the main reasons for the recent Teesta Flood?
          </Button>
          <Button
            onClick={() =>
              setInputMessage("Will the temperature increase by next week?")
            }
            className="m-2"
          >
            Will the temperature increase by next week?
          </Button>
        </div>
      );
    }

    return messages.map((message, index) => (
      <div
        key={index}
        className={`flex w-full mb-4 ${
          message.type === "user" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-3/4 p-3 rounded-lg ${
            message.type === "user"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          {message.content}
        </div>
      </div>
    ));
  };

  return (
    <div className="relative flex w-full flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto flex min-h-[75vh] w-full max-w-[1000px] flex-col xl:min-h-[85vh]">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="px-4 py-2 bg-white dark:bg-gray-800 text-center">
              <p className="text-sm font-medium text-zinc-950 dark:text-zinc-400">
                Analyze Landsat Data with Generative AI
              </p>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2 bg-white dark:bg-gray-800">
              <p className="text-sm font-medium text-zinc-950 dark:text-zinc-400">
                This is a cool text example.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex-grow overflow-auto px-4 py-2">
          {renderMessages()}
          {outputCode && (
            <div className="flex w-full">
              <div className="mr-5 flex h-10 min-h-[40px] min-w-[40px] items-center justify-center rounded-full bg-zinc-950 dark:border dark:border-zinc-800">
                <SpeakerLoudIcon className="h-4 w-4 text-white" />
              </div>
              <MessageBoxChat output={outputCode} />
            </div>
          )}
        </div>

        <div className="p-4 bg-white dark:bg-gray-800">
          <div className="flex w-full flex-row items-center justify-between">
            <Input
              className=" w-[800px] mr-2 p-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:purple-2 focus:purple-blue-500"
              placeholder="Type your message here..."
              value={inputMessage}
              onChange={handleChange}
            />
           
            <div className="items-center flex flex-row">
            <Button
              onClick={() => setIsImageUploadOpen(!isImageUploadOpen)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 mr-2"
            >
              <ImageIcon className="w-6 h-6" />
            </Button>{" "}
              <Button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleTranslate}
                disabled={loading}
              >
                {loading ? "Processing..." : "Submit"}
              </Button>
            </div>
          </div>
          {isImageUploadOpen && (
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
