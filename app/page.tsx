'use client';

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

interface NFLTeam {
  teamID: string;
  teamAbv: string;
  teamName: string;
  teamCity: string;
  wins: number;
  loss: number;
  tie: number;
  division: string;
  conferenceAbv: string;
  conference: string;
  pf: number;
  pa: number;
  nflComLogo1: string;
  espnLogo1: string;
}

const NFLTeamsPage = () => {
  const [teams, setTeams] = useState<NFLTeam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/nflTeams');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error('Error fetching NFL teams:', error);
        setError('Failed to fetch NFL teams data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const filteredTeams = teams.filter((team) =>
    Object.values(team).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">NFL Stats (2024) - USPC Intern Project</h1>
        <ThemeSwitcher />
      </div>
      <Input
        type="text"
        placeholder="Search.."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {filteredTeams.length === 0 ? (
        <div>No teams data available</div>
      ) : (
        <>
          <div className="grid grid-cols-12 gap-4 font-semibold mb-2 bg-secondary p-2 rounded">
            <div className="col-span-1">Logo</div>
            <div className="col-span-1">Abbr</div>
            <div className="col-span-2">Name</div>
            <div className="col-span-2">City</div>
            <div className="col-span-1">Wins</div>
            <div className="col-span-1">Losses</div>
            <div className="col-span-2">Division</div>
            <div className="col-span-2">Conference</div>
          </div>
          <div className="space-y-2">
            {filteredTeams.map((team) => (
              <div key={team.teamID} className="grid grid-cols-12 gap-4 items-center bg-muted p-2 rounded">
                <img src={team.nflComLogo1} alt={`${team.teamName} logo`} className="w-10 h-10 object-contain col-span-1" />
                <div className="col-span-1">{team.teamAbv}</div>
                <div className="col-span-2">{team.teamName}</div>
                <div className="col-span-2">{team.teamCity}</div>
                <div className="col-span-1">{team.wins}</div>
                <div className="col-span-1">{team.loss}</div>
                <div className="col-span-2">{team.division}</div>
                <div className="col-span-2">{team.conferenceAbv}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NFLTeamsPage;










