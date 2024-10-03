'use client';
import React, { useState } from "react";
import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [{ title: "Block", link: "/dashboard/block" }];

export default function Page() {
    const [path, setPath] = useState("137");
    const [row, setRow] = useState("44");
    const [iframeSrc, setIframeSrc] = useState(process.env.NEXT_PUBLIC_PYTHON_URL+`/api/landsat/block?path=${path}&row=${row}`);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIframeSrc(process.env.NEXT_PUBLIC_PYTHON_URL+`/api/landsat/block?path=${path}&row=${row}`);
    };

    return (
        <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <BreadCrumb items={breadcrumbItems} />
                <div className="flex">
                    <div className="w-1/4 p-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="path" className="block text-sm font-medium text-gray-700">
                                    Path
                                </label>
                                <input
                                    type="text"
                                    id="path"
                                    value={path}
                                    onChange={(e) => setPath(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="row" className="block text-sm font-medium text-gray-700">
                                    Row
                                </label>
                                <input
                                    type="text"
                                    id="row"
                                    value={row}
                                    onChange={(e) => setRow(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                    <div className="w-3/4 p-4">
                        <iframe
                            src={iframeSrc}
                            className="w-full h-full"
                            title="Settings"
                            style={{ height: "850px" }}
                        ></iframe>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}
