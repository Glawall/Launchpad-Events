"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
_dotenv.default.config();
if (!process.env.ADMIN_PASSWORD || !process.env.USER_PASSWORD) {
  throw new Error("Missing required password environment variables");
}
module.exports = [{
  name: "Sarah Johnson",
  email: "sarahjohnsontest84@gmail.com",
  password: process.env.ADMIN_PASSWORD,
  role: "admin",
  company: "TechEvents UK"
}, {
  name: "Michael Chen",
  email: "michael.chen@techevents.com",
  password: process.env.ADMIN_PASSWORD,
  role: "admin",
  company: "TechEvents UK"
}, {
  name: "Emma Wilson",
  email: "emmawilsontest84@gmail.com",
  password: process.env.USER_PASSWORD,
  role: "user",
  company: "Startup Labs"
}, {
  name: "James Smith",
  email: "james.smith@outlook.com",
  password: process.env.USER_PASSWORD,
  role: "user",
  company: "Digital Solutions"
}, {
  name: "Priya Patel",
  email: "priya.p@gmail.com",
  password: process.env.USER_PASSWORD,
  role: "user",
  company: "Tech Innovators"
}, {
  name: "David Brown",
  email: "david.b@outlook.com",
  password: process.env.USER_PASSWORD,
  role: "user",
  company: "Code Masters"
}, {
  name: "Lisa Anderson",
  email: "lisa.a@gmail.com",
  password: process.env.USER_PASSWORD,
  role: "user",
  company: "Web Wizards"
}, {
  name: "Tom Wilson",
  email: "tom.w@outlook.com",
  password: process.env.USER_PASSWORD,
  role: "user",
  company: "Data Dynamics"
}, {
  name: "Sophie Taylor",
  email: "sophie.t@gmail.com",
  password: process.env.USER_PASSWORD,
  role: "user",
  company: "Cloud Systems"
}, {
  name: "Ryan Martinez",
  email: "ryan.m@outlook.com",
  password: process.env.USER_PASSWORD,
  role: "user",
  company: "Mobile Masters"
}];