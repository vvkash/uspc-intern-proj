export default async function Page() {
  // new API for NFL
  const url = 'https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLGamesForWeek';

  // some required params and querys 
  const queryParam = new URLSearchParams({
    week: "1",
    seasonType: "reg",
    season: "2024"
  });



  try {
    // API headers
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!, // Replace with your actual API key
        'X-RapidAPI-Host': process.env.NEXT_PUBLIC_RAPIDAPI_HOST!,
      },
      cache: 'no-store', // currently no need too cache 
    });

    // handling edge cases and errors 
    if (!response.ok) {
      return <p>Error: {response.statusText}</p>;
    }

    // parsing data (JSON)
    let data = await response.json();

    console.log("Actual API Response Data:", data);

    // Check if the data is an array, otherwise return an error message
    if (!Array.isArray(data)) {
      return <p>No data available or incorrect format. Actual data: {JSON.stringify(data)}</p>;
    }

    // temperorary for now, since i want to check if it will parse as an array.
    return (
      <div>
        <h1>Fetched Posts:</h1>
        <ul>
          {data.map((item: { id: string, title: string }) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      </div>
    );
  } catch (error: unknown) {
    // Handle any errors that occur during fetch
    console.error('Error fetching data:', error);
    return <p>Error fetching data.</p>;
  }
}

