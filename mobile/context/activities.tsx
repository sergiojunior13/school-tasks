import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ActivityData,
  createAPIActivity,
  deleteAPIActivity,
  editAPIActivity,
  getAllAPIActivities,
  replaceAllAPIActivitiesWithActivitiesFromStorage,
} from "../services/tasks";

import NetInfo, { useNetInfo } from "@react-native-community/netinfo";

import {
  editActivityInStorage,
  getActivitiesInStorage,
  registerActivitiesInStorage,
  removeActivityInStorage,
} from "../utils/local-storage";
import { ErrorModalContext } from "./error-modal";

interface ActivitiesContextProps {
  activities: ActivityData[];
  addActivity(activityData: Omit<ActivityData, "id">): Promise<void>;
  removeActivity(activityIndex: number): Promise<void>;
  changeActivity(newActivityData: ActivityData): Promise<void>;
}

export const ActivitiesContext = createContext<ActivitiesContextProps>(null);

interface ActivitiesContextProviderProps {
  children: React.ReactNode;
}

export function ActivitiesContextProvider({ children }: ActivitiesContextProviderProps) {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const { tryFunctionOrThrowError } = useContext(ErrorModalContext);

  const isConnectedToInternet = useNetInfo({
    reachabilityUrl: process.env.EXPO_PUBLIC_API_URL,
    reachabilityRequestTimeout: 15 * 1000,
  }).isInternetReachable;

  useEffect(() => {
    async function getActivities(isInternetReachable: boolean) {
      const storageActivities = await getActivitiesInStorage();

      if (!isInternetReachable) {
        setActivities(storageActivities);
        return;
      }

      if (storageActivities.length === 0) {
        const apiActivities = await getAllAPIActivities();
        await registerActivitiesInStorage(apiActivities);
        setActivities(apiActivities);
      } else {
        await replaceAllAPIActivitiesWithActivitiesFromStorage(storageActivities);
        setActivities(storageActivities);
      }
    }

    NetInfo.fetch().then(({ isInternetReachable }) =>
      tryFunctionOrThrowError(() => getActivities(isInternetReachable))
    );
  }, []);

  async function addActivity(activityData: ActivityData) {
    await tryFunctionOrThrowError(async () => {
      let addedActivity: ActivityData;

      if (isConnectedToInternet) {
        addedActivity = await createAPIActivity(activityData);
      } else {
        addedActivity = activityData;
        addedActivity.id = activities.length + 1;
      }

      await registerActivitiesInStorage([...activities, addedActivity]);
      setActivities(prevActivity => [...prevActivity, addedActivity]);
    });
  }

  async function removeActivity(activityId: number) {
    await tryFunctionOrThrowError(async () => {
      if (isConnectedToInternet) await deleteAPIActivity(activityId);

      await removeActivityInStorage(activityId);

      setActivities(prevActivities => prevActivities.filter(({ id }) => id !== activityId));
    });
  }

  async function changeActivity(newActivityData: ActivityData) {
    await tryFunctionOrThrowError(async () => {
      let changedActivities: ActivityData[];

      if (isConnectedToInternet) {
        await editAPIActivity(newActivityData);
      }

      await editActivityInStorage(newActivityData);

      const activityIndex = activities.findIndex(({ id }) => id === newActivityData.id);
      changedActivities = [...activities];
      changedActivities[activityIndex] = newActivityData;

      setActivities(changedActivities);
    });
  }

  return (
    <ActivitiesContext.Provider value={{ activities, addActivity, removeActivity, changeActivity }}>
      {children}
    </ActivitiesContext.Provider>
  );
}
