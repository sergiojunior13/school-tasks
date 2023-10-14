import React, { createContext, useEffect, useState } from "react";
import { ActivityData, getAllActivities } from "../services/tasks";

interface ActivitiesContextProps {
  activities: ActivityData[];
  addActivity(activityData: Omit<ActivityData, "id">): void;
  removeActivity(activityIndex: number): void;
  changeActivity(newActivityData: ActivityData): void;
}

export const ActivitiesContext = createContext<ActivitiesContextProps>(null);

interface ActivitiesContextProviderProps {
  children: React.ReactNode;
}

export function ActivitiesContextProvider({ children }: ActivitiesContextProviderProps) {
  const [activities, setActivities] = useState<ActivityData[]>([]);

  function addActivity(activityData: ActivityData) {
    setActivities(prevActivity => [...prevActivity, activityData]);
  }

  function removeActivity(activityId: number) {
    setActivities(prevActivities => prevActivities.filter(({ id }) => id !== activityId));
  }

  function changeActivity(newActivityData: ActivityData) {
    const activityIndex = activities.findIndex(({ id }) => id === newActivityData.id);
    const changedActivities = [...activities];
    changedActivities[activityIndex] = newActivityData;

    setActivities(changedActivities);
  }

  useEffect(() => {
    getAllActivities()
      .then(setActivities)
      .catch(err => console.log(err));
  }, []);

  return (
    <ActivitiesContext.Provider value={{ activities, addActivity, removeActivity, changeActivity }}>
      {children}
    </ActivitiesContext.Provider>
  );
}
