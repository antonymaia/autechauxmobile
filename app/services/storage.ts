import { MMKV } from "react-native-mmkv";

let storage: MMKV | null = null;

export function getStorage() {
  if (!storage) {
    storage = new MMKV({ id: "app-storage" });
  }
  return storage;
}