import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const teams = await fetchAndStoreNFLTeams();
    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function fetchAndStoreNFLTeams() {
  const url = 'https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLTeams';

  const queryParam = new URLSearchParams({
    sortBy: 'standings',
    rosters: 'false',
    schedules: 'false',
    topPerformers: 'true',
    teamStats: 'true',
    teamStatsSeason: '2023',
  });

  const urlWithParams = `${url}?${queryParam.toString()}`;

  console.log('Fetching from URL:', urlWithParams);

  try {
    const response = await fetch(urlWithParams, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST || '',
      },
    });

    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText);
      const responseText = await response.text();
      console.error('Response body:', responseText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received data:', JSON.stringify(data).slice(0, 200) + '...'); // Log first 200 characters

    let teams = [];
    if (Array.isArray(data)) {
      teams = data;
    } else if (data.body && Array.isArray(data.body.teams)) {
      teams = data.body.teams;
    } else if (data.body && Array.isArray(data.body)) {
      teams = data.body;
    } else {
      console.error('Unexpected data structure:', JSON.stringify(data).slice(0, 200) + '...');
      throw new Error('Unexpected data structure');
    }

    const teamPromises = teams.map((team: any) =>
      prisma.nFLTeams.upsert({
        where: { teamID: team.teamID },
        update: {
          teamAbv: team.teamAbv,
          teamName: team.teamName,
          teamCity: team.teamCity,
          wins: parseInt(team.wins, 10) || 0,
          loss: parseInt(team.loss, 10) || 0,
          tie: parseInt(team.tie, 10) || 0,
          division: team.division,
          conferenceAbv: team.conferenceAbv,
          conference: team.conference,
          pf: parseInt(team.pf, 10) || 0,
          pa: parseInt(team.pa, 10) || 0,
          nflComLogo1: team.nflComLogo1,
          espnLogo1: team.espnLogo1,
        },
        create: {
          teamID: team.teamID,
          teamAbv: team.teamAbv,
          teamName: team.teamName,
          teamCity: team.teamCity,
          wins: parseInt(team.wins, 10) || 0,
          loss: parseInt(team.loss, 10) || 0,
          tie: parseInt(team.tie, 10) || 0,
          division: team.division,
          conferenceAbv: team.conferenceAbv,
          conference: team.conference,
          pf: parseInt(team.pf, 10) || 0,
          pa: parseInt(team.pa, 10) || 0,
          nflComLogo1: team.nflComLogo1,
          espnLogo1: team.espnLogo1,
        },
      })
    );

    await Promise.all(teamPromises);

    // Fetch the stored teams from the database to return in the response
    const storedTeams = await prisma.nFLTeams.findMany();

    return storedTeams;
  } catch (error) {
    console.error('Error in fetchAndStoreNFLTeams:', error);
    throw error;
  }
}
