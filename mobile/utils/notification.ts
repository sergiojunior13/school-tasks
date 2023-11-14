import * as Notifications from "expo-notifications";

import { getHoursToNotify } from "./local-storage";

import dayjs from "dayjs";
import { ActivityData } from "../services/tasks";

interface NotificationContent {
  title: string;
  channel?: { id: "activities" | string; name?: string };
  body?: string;
  date: dayjs.Dayjs | string | Date;
}

export async function notify(activities: ActivityData[]) {
  await cancelAllNotifications();

  await notifyAllNextWeekActivities(activities);
  await notifyWhenActivityDeliveryDateArrives(activities);
  await notifyTomorrowActivities(activities);
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

async function notifyAllNextWeekActivities(activities: ActivityData[]) {
  const todayIsSunday = dayjs().day() === 0;

  const startOfNextWeekDate = dayjs().add(1, "week").startOf("week");
  const nextWeekPendingActivities = activities.filter(
    isActivityFromNextWeekOrIfTodayIsSundayActivityIsFromCurrentWeek
  );

  if (nextWeekPendingActivities.length === 0) return;

  await createNotification({
    title: "Atividades desta semana 📅",
    body: `Você possui ${nextWeekPendingActivities.length} atividades para entregar esta semana.`,
    date: todayIsSunday ? dayjs() : startOfNextWeekDate,
  });
}

function isActivityFromNextWeekOrIfTodayIsSundayActivityIsFromCurrentWeek(activity: ActivityData) {
  if (activity.status === "finalized") return false;

  const todayIsSunday = dayjs().day() === 0;

  const endOfCurrentWeekDate = dayjs().endOf("week");
  const endOfNextWeekDate = dayjs().add(1, "week").endOf("week");

  if (todayIsSunday) {
    const endOfLastWeek = dayjs().subtract(1, "week").endOf("week");

    const activityDateIsAfterStartOfCurrentWeek = dayjs(activity.deliveryDate).isAfter(
      endOfLastWeek
    );
    const activityDateIsBeforeEndOfCurrentWeek = dayjs(activity.deliveryDate).isBefore(
      endOfCurrentWeekDate
    );

    return activityDateIsAfterStartOfCurrentWeek && activityDateIsBeforeEndOfCurrentWeek;
  }

  const activityDateIsAfterStartOfNextWeek = dayjs(activity.deliveryDate).isAfter(
    endOfCurrentWeekDate
  );
  const activityDateIsBeforeEndOfNextWeek = dayjs(activity.deliveryDate).isBefore(
    endOfNextWeekDate
  );

  return activityDateIsAfterStartOfNextWeek && activityDateIsBeforeEndOfNextWeek;
}

async function notifyWhenActivityDeliveryDateArrives(activities: ActivityData[]) {
  const today = dayjs().startOf("day");

  const pendingActivitiesFromToday = activities.filter(
    ({ deliveryDate, status }) =>
      status === "pending" &&
      (dayjs(deliveryDate).isSame(today) || dayjs(deliveryDate).isAfter(today))
  );

  const noRepeatedActivitiesFromTodayDates = [
    ...new Set(pendingActivitiesFromToday.map(({ deliveryDate }) => deliveryDate)),
  ];
  const activitiesFromTodayDatesAndActivitiesLengthPerDate = noRepeatedActivitiesFromTodayDates.map(
    activityDate => {
      return {
        date: activityDate,
        activitiesLength: pendingActivitiesFromToday.filter(
          activity => activity.deliveryDate === activityDate
        ).length,
      };
    }
  );

  activitiesFromTodayDatesAndActivitiesLengthPerDate.forEach(activityDate => {
    createNotification({
      title: "Atividades para hoje 📝",
      body: `Você possui ${activityDate.activitiesLength} atividades para fazer hoje (${dayjs(
        activityDate.date
      ).format("DD/MM")}).`,
      date: activityDate.date,
    });
  });
}

async function notifyTomorrowActivities(activities: ActivityData[]) {
  const today = dayjs().startOf("day");

  const pendingActivitiesFromTomorrow = activities.filter(
    ({ deliveryDate, status }) => dayjs(deliveryDate).isAfter(today) && status === "pending"
  );

  const noRepeatedActivitiesFromTomorrowDates = [
    ...new Set(pendingActivitiesFromTomorrow.map(({ deliveryDate }) => deliveryDate)),
  ];

  const activitiesFromTomorrowDatesAndActivitiesLengthPerDate =
    noRepeatedActivitiesFromTomorrowDates.map(activityDate => {
      return {
        date: activityDate,
        activitiesLength: pendingActivitiesFromTomorrow.filter(
          activity => activity.deliveryDate === activityDate
        ).length,
      };
    });

  activitiesFromTomorrowDatesAndActivitiesLengthPerDate.forEach(activityDateAndLength => {
    createNotification({
      title: "Atividades para amanhã 📚",
      body: `Você possui ${
        activityDateAndLength.activitiesLength
      } atividades para fazer amanhã (${dayjs(activityDateAndLength.date).format("DD/MM")}).`,
      date: dayjs(activityDateAndLength.date).subtract(1, "day"),
    });
  });
}

async function createNotification({
  title,
  body,
  date,
  channel = { id: "activities", name: "Atividades" },
}: NotificationContent) {
  setDefaultNotificationsHandlerConfig();
  await setNotificationsChannel(channel.id, channel.name);

  const hoursToNotify = await getHoursToNotify();

  hoursToNotify.forEach(hourToNotify =>
    Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: {
        date: dayjs(date).startOf("day").set("hour", hourToNotify).toDate(),
      },
    })
  );
}

function setDefaultNotificationsHandlerConfig() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

async function setNotificationsChannel(channelId: string, name?: string) {
  await Notifications.setNotificationChannelAsync(channelId, {
    name: name || channelId,
    importance: 5,
  });
}
