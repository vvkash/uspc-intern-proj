'use client';  // Client-side hooks

import React, { useState, useEffect } from 'react';
import { PrismaClient } from '@prisma/client';
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@/components/ui/table';

const prisma = new PrismaClient();

// Fetch and upsert NFL Teams data from the API into the database
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

  try {
    const response = await fetch(urlWithParams, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
        'X-RapidAPI-Host': process.env.NEXT_PUBLIC_RAPIDAPI_HOST!,
      },
      cache: 'no-store',  // Prevent caching for fresh data
    });

    const rawText = await response.text();
    const data = JSON.parse(rawText);

    let teams = [];
    if (Array.isArray(data)) {
      teams = data;
    } else if (data.body && Array.isArray(data.body.teams)) {
      teams = data.body.teams;
    } else if (data.body && Array.isArray(data.body)) {
      teams = data.body;
    } else {
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

    // Fetch the stored teams from the database to display in the table
    return await prisma.nFLTeams.findMany();
  } catch (error) {
    console.error('Error fetching or storing NFL teams:', error);
    throw error;
  }
}

const NFLTeamsPage = async () => {
  const storedTeams = await fetchAndStoreNFLTeams();  // Fetch and store data

  return (        // main table and data
    <div>
      <h1>NFL Stats (2024)</h1>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader className="flex space-x-3">Logo</TableHeader>
            <TableHeader>Team Abbreviation</TableHeader>
            <TableHeader>Team Name</TableHeader>
            <TableHeader>City</TableHeader>
            <TableHeader>Wins</TableHeader>
            <TableHeader>Losses</TableHeader>
            <TableHeader>Division</TableHeader>
            <TableHeader>Conference</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {storedTeams.map((team) => (
            <TableRow key={team.teamID}>
              <TableCell>
                <img src={team.nflComLogo1} alt={`${team.teamName} logo`} width={50} />
              </TableCell>
              <TableCell>{team.teamAbv}</TableCell>
              <TableCell>{team.teamName}</TableCell>
              <TableCell>{team.teamCity}</TableCell>
              <TableCell>{team.wins}</TableCell>
              <TableCell>{team.loss}</TableCell>
              <TableCell>{team.division}</TableCell>
              <TableCell>{team.conferenceAbv}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NFLTeamsPage; // needed for componenent 






