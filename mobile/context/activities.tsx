import React, { createContext, useEffect, useState } from "react";
import {
  ActivityData,
  createActivity,
  deleteActivity,
  editActivity,
  getAllActivities,
} from "../services/tasks";

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

  useEffect(() => {
    getAllActivities().then(setActivities);
  }, []);

  async function addActivity(activityData: ActivityData) {
    const addedActivity = await createActivity(activityData);

    setActivities(prevActivity => [...prevActivity, addedActivity]);
  }

  async function removeActivity(activityId: number) {
    await deleteActivity(activityId);

    setActivities(prevActivities => prevActivities.filter(({ id }) => id !== activityId));
  }

  async function changeActivity(newActivityData: ActivityData) {
    await editActivity(newActivityData);

    const activityIndex = activities.findIndex(({ id }) => id === newActivityData.id);
    const changedActivities = [...activities];
    changedActivities[activityIndex] = newActivityData;

    setActivities(changedActivities);
  }

  return (
    <ActivitiesContext.Provider value={{ activities, addActivity, removeActivity, changeActivity }}>
      {children}
    </ActivitiesContext.Provider>
  );
}
