



type ContributionsResult = {
  totalCommits: number;
  publicCommits: number;
  privateCommits: number;
};

export async function getContributions(
  username: string,
  from: string,
  to: string = new Date().toISOString(),
  token: string = process.env.GITHUB_ACCESS_TOKEN!
): Promise<ContributionsResult> {
  if (!token) {
    throw new Error("GitHub personal access token is required.");
  }

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          restrictedContributionsCount
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        username,
        from,
        to,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(
      `GitHub API error: ${JSON.stringify(json.errors)}`
    );
  }

  const cc = json.data.user.contributionsCollection;

  const totalCommits = cc.totalCommitContributions;
  const privateCommits = cc.restrictedContributionsCount;
  const publicCommits = totalCommits - privateCommits;
  console.log("totalCommits",totalCommits)
  console.log("privateCommits",privateCommits)
  console.log("publicCommits",publicCommits)

  return {
    totalCommits,
    publicCommits,
    privateCommits,
  };
}



export async function getAllContributions() {
  const username = "shailjayadav30";

  const periods = [
    {
      from: "2023-03-19T00:00:00Z",
      to: "2024-03-19T00:00:00Z",
    },
    {
      from: "2024-03-19T00:00:00Z",
      to: "2025-03-19T00:00:00Z",
    },
    {
      from: "2025-03-19T00:00:00Z",
      to: "2026-03-19T00:00:00Z",
    },
    {
      from: "2026-03-19T00:00:00Z",
      to: new Date().toISOString(),
    },
  ];

  const results = await Promise.all(
    periods.map((period) =>
      getContributions(
        username,
        period.from,
        period.to
      )
    )
  );
  console.log("result private",results.map((m)=>m.privateCommits))
  console.log("result public",results.map((m)=>m.publicCommits))
  console.log("result total",results.map((m)=>m.totalCommits))


  return {
    totalCommits: results.reduce(
      (total, result) => total + result.totalCommits,
      0
    ),

    publicCommits: results.reduce(
      (total, result) => total + result.publicCommits,
      0
    ),

    privateCommits: results.reduce(
      (total, result) => total + result.privateCommits,
      0
    ),
  };
}