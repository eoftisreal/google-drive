import Link from "next/link";

async function getMediaList() {
  try {
    const res = await fetch("http://localhost:3001/api/v1/media", { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function BrowsePage() {
  const mediaList = await getMediaList();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Browse Media</h1>
      {mediaList.length === 0 ? (
        <div className="p-8 text-center bg-surface rounded-lg border border-surface/50 text-gray-400">
          No media found. Go to Admin Dashboard to add some.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mediaList.map((media: any) => (
            <Link
              key={media.id}
              href={\`/watch/\${media.id}\`}
              className="group flex flex-col gap-2 transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="aspect-video bg-surface rounded-lg overflow-hidden border border-surface/50 flex items-center justify-center">
                {media.posterUrl ? (
                  <img src={media.posterUrl} alt={media.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-surface group-hover:bg-gray-800 transition-colors flex flex-col items-center justify-center">
                    <span className="text-gray-500 font-medium">No Poster</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{media.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">{media.description || "No description"}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
