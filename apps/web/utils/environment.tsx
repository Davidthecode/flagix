export const TruncatedTabName = ({
  name,
  maxLength = 15,
}: {
  name: string;
  maxLength?: number;
}) => {
  const needsTruncation = name.length > maxLength;
  const truncatedName = needsTruncation
    ? `${name.substring(0, maxLength)}...`
    : name;
  return (
    <span
      className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
      title={needsTruncation ? name : undefined}
    >
      {truncatedName}
    </span>
  );
};

export const maskApiKey = (key: string) => {
  const parts = key.split("_");
  if (parts.length < 3) {
    return "*".repeat(12);
  }
  return `${parts[0]}_${parts[1].slice(0, 4)}...${"*".repeat(8)}`;
};
