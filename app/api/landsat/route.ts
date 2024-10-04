export const runtime = 'edge'; 
import { NextRequest, NextResponse } from "next/server";

const urls = {
    LANDSAT_DATA_URL: "https://landsat.usgs.gov/sites/default/files/landsat_acq/assets/json/cycles_full.json",
    USGS_URL: "https://nimbus.cr.usgs.gov/arcgis/rest/services/LLook_Outlines/MapServer/1/query",
    TLE_API_URL: "https://tle.ivanstanojevic.me/api/tle/49260"
};

export const GET = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const app = searchParams.get('app') as string; 
    const query = searchParams.toString(); 

    console.log(app, query);

    const url = urls[app] ? `${urls[app]}?${query}` : `${app}`;
    console.log(`Main Query : ${url}`);

    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
}