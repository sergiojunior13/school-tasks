import React, { createContext, useEffect, useState } from "react";
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
  const isConnectedToInternet = useNetInfo({
    reachabilityUrl: process.env.EXPO_PUBLIC_API_URL,
    reachabilityRequestTimeout: 15 * 1000,
  }).isInternetReachable;

  useEffect(() => {
    NetInfo.fetch().then(({ isInternetReachable }) => {
      getActivitiesInStorage().then(async storageActivities => {
        if (isInternetReachable) {
          if (storageActivities.length === 0) {
            getAllAPIActivities().then(async apiActivities => {
              setActivities(apiActivities);
              await registerActivitiesInStorage(apiActivities);
            });
          } else {
            await replaceAllAPIActivitiesWithActivitiesFromStorage(storageActivities);
            setActivities(storageActivities);
          }
        } else {
          setActivities(storageActivities);
        }
      });
    });
  }, []);

  async function addActivity(activityData: ActivityData) {
    let addedActivity: ActivityData;

    if (isConnectedToInternet) {
      addedActivity = await createAPIActivity(activityData);
    } else {
      addedActivity = activityData;
      addedActivity.id = activities.length + 1;
    }

    await registerActivitiesInStorage([...activities, addedActivity]);
    setActivities(prevActivity => [...prevActivity, addedActivity]);
  }

  async function removeActivity(activityId: number) {
    if (isConnectedToInternet) await deleteAPIActivity(activityId);

    await removeActivityInStorage(activityId);

    setActivities(prevActivities => prevActivities.filter(({ id }) => id !== activityId));
  }

  async function changeActivity(newActivityData: ActivityData) {
    let changedActivities: ActivityData[];

    if (isConnectedToInternet) {
      await editAPIActivity(newActivityData);
    }

    await editActivityInStorage(newActivityData);

    const activityIndex = activities.findIndex(({ id }) => id === newActivityData.id);
    changedActivities = [...activities];
    changedActivities[activityIndex] = newActivityData;

    setActivities(changedActivities);
  }

  return (
    <ActivitiesContext.Provider value={{ activities, addActivity, removeActivity, changeActivity }}>
      {children}
    </ActivitiesContext.Provider>
  );
}
