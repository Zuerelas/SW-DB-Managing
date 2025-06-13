import { type RouteConfig, index } from "@react-router/dev/routes";
import React from "react";

export default [
  index("routes/home.tsx"),
  { path: "login", component: "routes/login.tsx" },
  { 
    path: "admin",
    component: "routes/admin/index.tsx",
    children: [
      { index: true, component: "routes/admin/dashboard.tsx" },
      { path: "users", component: "routes/admin/users.tsx" },
      //{ path: "events", component: "routes/admin/events.tsx" },
      //{ path: "photos", component: "routes/admin/photos.tsx" },
      //{ path: "photographers", component: "routes/admin/photographers.tsx" },
      //{ path: "settings", component: "routes/admin/settings.tsx" }
    ]
  }
] satisfies RouteConfig;
