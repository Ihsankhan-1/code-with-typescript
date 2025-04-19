import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server'; // if using Clerk

const Page = async () => {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in'); // or throw new Error("Unauthorized")
  }

  // Get first workflow for this user (use plural 'workflows' here)
  const existingWorkflow = await db.workflows.findFirst({
    where: { userId: user.id },
  });

  // If a workflow exists, redirect to it
  if (existingWorkflow) {
    redirect(`/workflows/${existingWorkflow.id}`);
  }

  // Otherwise, create a new one
  const newWorkflow = await db.workflows.create({
    data: {
      name: 'Untitled Workflow',
      userId: user.id,
      description: '', // Added required description field
    },
  });

  redirect(`/workflows/${newWorkflow.id}`);
};
export default Page;
