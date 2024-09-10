export default async function Page() {
  const url = 'https://f1-motorsport-data.p.rapidapi.com/schedule';

  try {
    // Fetch data from the API with necessary headers
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!, // Replace with your actual API key
        'X-RapidAPI-Host': process.env.NEXT_PUBLIC_RAPIDAPI_HOST!,
      },
      cache: 'no-store', // Prevents caching of the request
    });

    // Handle non-OK responses
    if (!response.ok) {
      return <p>Error: {response.statusText}</p>;
    }

    // Parse the JSON response
    let data = await response.json();

    // Log the actual data structure for debugging
    console.log("Actual API Response Data:", data);

    // Check if the data is an array, otherwise return an error message
    if (!Array.isArray(data)) {
      return <p>No data available or incorrect format. Actual data: {JSON.stringify(data)}</p>;
    }

    // Render the data (assuming it is a list of posts)
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

