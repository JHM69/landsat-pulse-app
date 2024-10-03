import { Icons } from "@/components/icons";
import { NavItem, SidebarNavItem } from "@/types";

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};

export type Stock = { 
  symbol: string;
  name: string;
  price: number;
  change: number;
  changesPercentage: number;
};


export type Order = {
  id : string;
  symbol : string;
  side : string;
  type : string; 
  qty : number;
  avg_cost : number;
  amount : number; 
  status : string;
  date : string;
  limit_price : number;
  stop_price : number;
  filled_qty? : number;
  filled_avg_price? : number;
};
  
  
 

export const navItems: NavItem[] = [
  
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Landsat Tracker",
    href: "/dashboard/tracker",
    icon: "tracker",
    label: "Landsat Tracker",
  },
  {
    title: "Places",
    href: "/dashboard/place",
    icon: "places",
    label: "Places",
  },
  {
    title: "Validate Data",
    href: "/dashboard/validate",
    icon: "validate",
    label: "validate",
  },
  {
    title: "Ai Analysis",
    href: "/dashboard/analysis",
    icon: "analysis",
    label: "Ai Analysis",
  },

  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "settings",
    label: "settings",
  }, 

  {
    title: "Block",
    href: "/dashboard/block",
    icon: "scan",
    label: "block",
  }, 

  {
    title: "Shape",
    href: "/dashboard/shape",
    icon: "pentagon",
    label: "shape",
  }, 

  {
    title: "Landsat Map",
    href: "/dashboard/landsatmap",
    icon: "map",
    label: "landsat map",
  }, 
 
];


export let initialData = [
  {
    date: "2021-02-02 16:00:00",
    open: 134.9307,
    low: 134.9105,
    high: 135.4215,
    close: 135.0087,
    volume: 73591581
  },
  {
    date: "2021-02-02 15:45:00",
    open: 134.9707,
    low: 134.9307,
    high: 134.9707,
    close: 134.9307,
    volume: 67639193
  },
  {
    date: "2021-02-02 15:30:00",
    open: 134.6608,
    low: 134.6608,
    high: 134.975,
    close: 134.975,
    volume: 64815258
  },
  {
    date: "2021-02-02 15:15:00",
    open: 134.8585,
    low: 134.6237,
    high: 134.9716,
    close: 134.6608,
    volume: 62892896
  },
  {
    date: "2021-02-02 15:00:00",
    open: 134.985,
    low: 134.78,
    high: 135.0,
    close: 134.8585,
    volume: 60880828
  },
  {
    date: "2021-02-02 14:45:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 58880828
  },
  {
    date: "2021-02-02 14:30:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 56880828
  },
  {
    date: "2021-02-02 14:15:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 54880828
  },
  {
    date: "2021-02-02 14:00:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 52880828
  },
  {
    date: "2021-02-02 13:45:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 50880828
  },
  {
    date: "2021-02-02 13:30:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 48880828
  },
  {
    date: "2021-02-02 13:15:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 46880828
  },
  {
    date: "2021-02-02 13:00:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 44880828
  },
  {
    date: "2021-02-02 12:45:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 42880828
  },
  {
    date: "2021-02-02 12:30:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 40880828
  },
  {
    date: "2021-02-02 12:15:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 38880828
  },
  {
    date: "2021-02-02 12:00:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 36880828
  },
  {
    date: "2021-02-02 11:45:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 34880828
  },
  {
    date: "2021-02-02 11:30:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 32880828
  },
  {
    date: "2021-02-02 11:15:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 30880828
  },
  {
    date: "2021-02-02 11:00:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 28880828
  },
  {
    date: "2021-02-02 10:45:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 26880828
  },
  {
    date: "2021-02-02 10:30:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 24880828
  },
  {
    date: "2021-02-02 10:15:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 22880828
  },
  {
    date: "2021-02-02 10:00:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 20880828
  },
  {
    date: "2021-02-02 09:45:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 18880828
  },
  {
    date: "2021-02-02 09:30:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 16880828
  },
  {
    date: "2021-02-02 09:15:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 14880828
  },
  {
    date: "2021-02-02 09:00:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 12880828
  },
  {
    date: "2021-02-02 08:45:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 10880828
  },
  {
    date: "2021-02-02 08:30:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 8880828
  },
  {
    date: "2021-02-02 08:15:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 6880828
  },
  {
    date: "2021-02-02 08:00:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 4880828
  },
  {
    date: "2021-02-02 07:45:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 2880828
  },
  {
    date: "2021-02-02 07:30:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 1880828
  },
  {
    date: "2021-02-02 07:15:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 880828
  },
  {
    date: "2021-02-02 07:00:00",
    open: 134.96,
    low: 134.93,
    high: 134.985,
    close: 134.985,
    volume: 80828
  }
]