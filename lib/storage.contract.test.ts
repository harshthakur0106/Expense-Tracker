import { useTransactions } from "./storage";

const result = useTransactions;

if (typeof result !== "function") {
  throw new Error("useTransactions hook should exist");
}
