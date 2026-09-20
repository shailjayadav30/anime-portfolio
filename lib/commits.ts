type Day = {
  date: string;
  count: number;
  level: number;
};

type ApiResponse = {
  total: Record<string, number>;
  contributions: Day[];
};

export async function getYearlyContributions(
  username: string,
  year: number = new Date().getFullYear()
): Promise<number> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch contributions for ${username}`);
  }

  const data: ApiResponse = await res.json();

  return data.contributions
    .filter((day) => new Date(day.date).getFullYear() === year)
    .reduce((sum, day) => sum + day.count, 0);
}

export const commits = getYearlyContributions("shailjayadav30", 2026);  