import { MediaPlayer } from "@/components/MediaPlayer";
import { notFound } from "next/navigation";

async function getMedia(id: string) {
  try {
    const res = await fetch(`http://localhost:3001/api/v1/media/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export default async function WatchPage({ params }: { params: { id: string } }) {
  const media = await getMedia(params.id);

  if (!media) {
    notFound();
  }

  // Pass proxy stream URL to the player
  const streamUrl = `http://localhost:3001/api/v1/stream/${media.id}`;

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <div className="w-full bg-black rounded-lg overflow-hidden shadow-2xl border border-surface">
        <MediaPlayer
          src={streamUrl}
          poster={media.posterUrl || undefined}
          title={media.title}
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-2">{media.title}</h1>
        {media.description && (
          <p className="text-gray-400 whitespace-pre-wrap">{media.description}</p>
        )}
      </div>
    </div>
  );
}
