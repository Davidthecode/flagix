import axios from "axios";
import { env } from "@/config/env";

export const api = axios.create({
  baseURL: env.apiBase ?? "http://localhost:5000",
  withCredentials: true,
});
