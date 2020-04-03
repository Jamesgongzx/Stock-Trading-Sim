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
import DashboardPage from "views/Dashboard/dashboard.jsx";
import UserProfile from "views/UserProfile/userprofile.jsx";
import TableList from "views/TableList/TableList.js";
import MyStocks from "views/TableList/MyStocks";
import TradeStocks from "./views/TableList/TradeStocks";
import ManageStocks from "./views/TableList/ManageStocks";

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
    icon: Person,
    component: UserProfile,
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
    path: "/stocks-management",
    name: "Manage Stocks (Admin)",
    icon: Business,
    component: ManageStocks,
    layout: "/user",
    type: "admin"
  }
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
