import { postContentToWebHook } from '@/app/(main)/(pages)/connections/_actions/discord-connection';
import { onCreateNewPageInDatabase } from '@/app/(main)/(pages)/connections/_actions/notion-connection';
import { postMessageToSlack } from '@/app/(main)/(pages)/connections/_actions/slack-connection';
import { db } from '@/lib/db';
import axios from 'axios';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('🔴 Notification received');

  const headersList = await headers();
  let channelResourceId: string | null = null;

  for (const [key, value] of (await headersList).entries()) {
    if (key.toLowerCase() === 'x-goog-resource-id') {
      channelResourceId = value;
    }
  }

  if (!channelResourceId) {
    return NextResponse.json({ message: 'Missing x-goog-resource-id' }, { status: 400 });
  }

  const user = await db.user.findFirst({
    where: {
      googleResourceId: channelResourceId,
    },
    select: { clerkId: true, credits: true },
  });

  if (!user || (user.credits !== 'Unlimited' && parseInt(user.credits ?? '0') <= 0)) {
    return NextResponse.json(
      { message: 'Insufficient credits or user not found' },
      { status: 403 }
    );
  }

  const workflows = await db.workflows.findMany({
    where: { userId: user.clerkId },
  });

  if (!workflows || workflows.length === 0) {
    return NextResponse.json({ message: 'No workflows found' }, { status: 404 });
  }

  for (const flow of workflows) {
    let flowPath: string[];

    try {
      flowPath = JSON.parse(flow.flowPath ?? '[]');
    } catch (err) {
      console.error('❌ Invalid flowPath:', flow.flowPath);
      continue;
    }

    let current = 0;
    while (current < flowPath.length) {
      const step = flowPath[current];

      switch (step) {
        case 'Discord':
          const discordMessage = await db.discordWebhook.findFirst({
            where: { userId: flow.userId },
            select: { url: true },
          });
          if (discordMessage) {
            await postContentToWebHook(flow.discordTemplate!, discordMessage.url);
          }
          break;

        case 'Slack':
          const channels = (flow.slackChannels ?? []).map((channel: any) => ({
            label: '',
            value: channel,
          }));
          await postMessageToSlack(flow.slackAccessToken!, channels, flow.slackTemplate!);
          break;

        case 'Notion':
          await onCreateNewPageInDatabase(
            flow.notionDbId!,
            flow.notionAccessToken!,
            JSON.parse(flow.notionTemplate!)
          );
          break;

        case 'Wait':
          try {
            const res = await axios.put(
              'https://api.cron-job.org/jobs',
              {
                job: {
                  url: `${process.env.NGROK_URI}?flow_id=${flow.id}`,
                  enabled: 'true',
                  schedule: {
                    timezone: 'Europe/Istanbul',
                    expiresAt: 0,
                    hours: [-1],
                    mdays: [-1],
                    minutes: ['*****'],
                    months: [-1],
                    wdays: [-1],
                  },
                },
              },
              {
                headers: {
                  Authorization: `Bearer ${process.env.CRON_JOB_KEY!}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            if (res.status === 200) {
              // Save remaining steps as cronPath and break execution
              const remainingPath = flowPath.slice(current + 1);
              await db.workflows.update({
                where: { id: flow.id },
                data: { cronPath: JSON.stringify(remainingPath) },
              });
              break;
            }
          } catch (err) {
            console.error('❌ Failed to schedule cron job:', err);
          }
          break;

        default:
          console.warn(`⚠️ Unknown flow step: ${step}`);
          break;
      }

      current++;
    }

    // Deduct credit unless Unlimited
    if (user.credits !== 'Unlimited') {
      await db.user.update({
        where: { clerkId: user.clerkId },
        data: { credits: `${parseInt(user.credits!) - 1}` },
      });
    }
  }

  return NextResponse.json({ message: 'Flow completed' }, { status: 200 });
}
