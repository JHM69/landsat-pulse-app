'use client';
import React, { useState } from "react";
import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [
    { title: "Shape", link: "/dashboard/shape" },
];

export default function Page() {
    const [geoJson, setGeoJson] = useState("");
    const [iframeUrl, setIframeUrl] = useState(
        process.env.NEXT_PUBLIC_PYTHON_URL+"/api/landsat/shape?cloud=20&geojson=%7B%0A%20%20%22type%22%3A%20%22FeatureCollection%22%2C%0A%20%20%22features%22%3A%20%5B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22type%22%3A%20%22Feature%22%2C%0A%20%20%20%20%20%20%22properties%22%3A%20%7B%7D%2C%0A%20%20%20%20%20%20%22geometry%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%22coordinates%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%2088.64494099888088%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%2024.609112156818384%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%2088.32741154253256%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%2023.815878161285042%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%2089.19716425099114%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%2023.499741525059548%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%2088.64494099888088%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%2024.609112156818384%0A%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%22type%22%3A%20%22Polygon%22%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%5D%0A%7D"
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const encodedGeoJson = encodeURIComponent(geoJson);
        setIframeUrl(process.env.NEXT_PUBLIC_PYTHON_URL+`/api/landsat/shape?cloud=20&geojson=${encodedGeoJson}`);
    };

    return (
        <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <BreadCrumb items={breadcrumbItems} />
                <div className="flex">
                    <div className="w-1/4 p-4">
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={geoJson}
                                onChange={(e) => setGeoJson(e.target.value)}
                                className="w-full h-64 p-2 border"
                                placeholder="Enter GeoJSON here"
                            />
                            <button type="submit" className="mt-2 p-2 bg-blue-500 text-white">
                                Submit
                            </button>
                        </form>
                    </div>
                    <div className="w-3/4 p-4">
                        <iframe
                            src={iframeUrl}
                            className="w-full h-full"
                            title="Settings"
                            style={{ height: "700px" }}
                        ></iframe>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}
