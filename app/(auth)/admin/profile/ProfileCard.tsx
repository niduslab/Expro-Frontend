import SimpleDateTime from "@/components/simpleDateTime/page";

const ProfileCard = ({ profile }: { profile: any }) => {
  const initials = profile?.member?.name_english
    ?.split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white border border-gray-100 rounded-xl px-6 py-5 flex flex-col sm:flex-row items-center gap-5">
      {/* Avatar */}
      <div className="w-16 h-16 rounded-full bg-blue-50 overflow-hidden flex items-center justify-center flex-shrink-0">
        {profile?.member?.photo ? (
          <img
            src={
              profile.member.photo.startsWith('http')
                ? profile.member.photo
                : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8000'}/storage/${profile.member.photo}`
            }
            alt="profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-lg font-semibold text-blue-700">
            {initials || "?"}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col items-center sm:items-start gap-1 min-w-0">
        <h2 className="text-base font-semibold text-gray-900 truncate">
          {profile?.member?.name_english || "—"}
        </h2>
        <p className="text-xs text-gray-400">{profile?.email || "—"}</p>

        {/* Role badges */}
        {profile?.roles?.length > 0 && (
          <div className="flex gap-1.5 mt-1 flex-wrap justify-center sm:justify-start">
            {profile.roles.map((role: string) => (
              <span
                key={role}
                className="text-[11px] font-medium px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full"
              >
                {role}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
