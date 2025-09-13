import { Redirect } from "expo-router";
import { getStorage } from "./services/storage";


export default function Index() {
  const storage = getStorage();
  const jwt = storage.getString("jwt");

  if (jwt) {
    return <Redirect href="/(internal)/home" />;
  }

  return <Redirect href="/login" />;
}