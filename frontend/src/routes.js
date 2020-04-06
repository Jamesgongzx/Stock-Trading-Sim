/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import ShowChart from "@material-ui/icons/ShowChart"
import Business from "@material-ui/icons/Business"
import Group from "@material-ui/icons/Group"
import TableChart from "@material-ui/icons/TableChart"
import Store from "@material-ui/icons/Store"
import LocalMall from "@material-ui/icons/LocalMall"

import DashboardPage from "views/Dashboard/dashboard.jsx";
import UserProfile from "views/UserProfile/userprofile.jsx";
import TableList from "views/TableList/TableList.js";
import MyStocks from "views/TableList/MyStocks";
import TradeStocks from "./views/TableList/TradeStocks";
import ManagePlayers from "./views/TableList/ManagePlayers";
import ManageStocks from "./views/TableList/ManageStocks";
import ManageTables from "./views/TableList/ManageTables";
import MarketPlace from "./views/TableList/MarketPlace";
import MyItems from "./views/TableList/MyItems";
import History from "./views/TableList/History";
import ManageItems from "./views/TableList/ManageItems";


const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/user",
    type: "user"
  },
  {
    path: "/profile",
    name: "User Profile",
    icon: null,
    component: UserProfile,
    layout: "/user",
    type: "user"
  },
  {
    path: "/marketplace",
    name: "Marketplace",
    icon: Store,
    component: MarketPlace,
    layout: "/user",
    type: "user"
  },
  {
    path: "/trade",
    name: "Trade Stocks",
    icon: ShowChart,
    component: TradeStocks,
    layout: "/user",
    type: "user"
  },
  // {
  //   path: "/table",
  //   name: "Table List",
  //   icon: "content_paste",
  //   component: TableList,
  //   layout: "/user"
  // },
  {
    path: "/stocks",
    name: "My Stocks",
    icon: null,
    component: MyStocks,
    layout: "/user",
    type: "user"
  },
  {
    path: "/items",
    name: "My Items",
    icon: null,
    component: MyItems,
    layout: "/user",
    type: "user"
  },
  {
    path: "/history",
    name: "History",
    icon: null,
    component: History,
    layout: "/user",
    type: "user"
  },
  {
    path: "/players-management",
    name: "Manage Players (Admin)",
    icon: Group,
    component: ManagePlayers,
    layout: "/user",
    type: "admin"
  },
  {
    path: "/items-management",
    name: "Manage Items (Admin)",
    icon: LocalMall,
    component: ManageItems,
    layout: "/user",
    type: "admin"
  },
  {
    path: "/stocks-management",
    name: "Manage Stocks (Admin)",
    icon: Business,
    component: ManageStocks,
    layout: "/user",
    type: "admin"
  },
  {
    path: "/tables-management",
    name: "Manage Tables (Admin)",
    icon: TableChart,
    component: ManageTables,
    layout: "/user",
    type: "admin"
  },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   icon: LibraryBooks,
  //   component: Typography,
  //   layout: "/admin"
  // },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: BubbleChart,
  //   component: Icons,
  //   layout: "/admin"
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: LocationOn,
  //   component: Maps,
  //   layout: "/admin"
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: Notifications,
  //   component: NotificationsPage,
  //   layout: "/admin"
  // },
  // {
  //   path: "/rtl-page",
  //   name: "RTL Support",
  //   rtlName: "پشتیبانی از راست به چپ",
  //   icon: Language,
  //   component: RTLPage,
  //   layout: "/rtl"
  // }
];

export default dashboardRoutes;
