import Link from 'next/link';
import { missions, getProgress } from '@/lib/data';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { id: string };
}

export default function MissionPage({ params }: PageProps) {
  const mission = missions.find(m => m.id === params.id);
  if (!mission) notFound();

  const progress = getProgress();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Semana {mission.week}: {mission.title}</h1>
      <div className="grid gap-4">
        {mission.activities.map((activity) => {
          const completed = progress.completedActivities.includes(activity.id);
          return (
            <Link key={activity.id} href={`/activities/${activity.id}`} className="block p-4 border rounded-lg hover:bg-gray-50">
              <h2 className="text-xl font-semibold">{activity.title}</h2>
              <p>{activity.description}</p>
              <p className="text-sm text-gray-600">Tempo: {activity.time} min</p>
              {completed && <span className="text-green-600">✓ Completada</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}