import {
  SchedulerClient,
  CreateScheduleCommand,
  DeleteScheduleCommand,
  FlexibleTimeWindowMode,
} from "@aws-sdk/client-scheduler";

const scheduler = new SchedulerClient({ region: process.env.AWS_REGION ?? "us-east-1" });

function toScheduleExpression(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  // EventBridge format: at(yyyy-mm-ddThh:mm:ss)
  return `at(${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())})`;
}

export async function scheduleUnlock(capsuleId: string, unlocksAt: Date): Promise<string> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const scheduleName = `unlock-${capsuleId}`;

  await scheduler.send(
    new CreateScheduleCommand({
      Name: scheduleName,
      ScheduleExpression: toScheduleExpression(unlocksAt),
      ScheduleExpressionTimezone: "UTC",
      FlexibleTimeWindow: { Mode: FlexibleTimeWindowMode.OFF },
      // Delete schedule automatically after it fires
      ActionAfterCompletion: "DELETE",
      Target: {
        Arn: process.env.AWS_SCHEDULER_TARGET_ARN!,
        RoleArn: process.env.AWS_SCHEDULER_ROLE_ARN!,
        Input: JSON.stringify({
          url: `${appUrl}/api/capsules/${capsuleId}/unlock`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-unlock-secret": process.env.UNLOCK_WEBHOOK_SECRET!,
          },
        }),
      },
    })
  );

  return scheduleName;
}

export async function cancelUnlock(scheduleName: string): Promise<void> {
  try {
    await scheduler.send(new DeleteScheduleCommand({ Name: scheduleName }));
  } catch {
    // Ignore if already deleted/fired
  }
}
