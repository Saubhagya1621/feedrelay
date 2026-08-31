const ROLE_COLORS = {
  restaurant: "var(--color-primary)",
  ngo: "var(--color-ngo)",
  admin: "var(--color-base-dark)",
};

const Avatar = ({ name, role = "restaurant", size = 36 }) => {
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  const bg = ROLE_COLORS[role] || "var(--color-primary)";

  return (
    <div
      className="flex items-center justify-center rounded-full text-white font-semibold shrink-0"
      style={{ backgroundColor: bg, width: size, height: size, fontSize: size * 0.42 }}
    >
      {initial}
    </div>
  );
};

export default Avatar;