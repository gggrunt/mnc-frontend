import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { StatsAction } from "../redux/statsActions";
import { mapStats } from "../services/dataMapper";
import { fetchMMR, fetchStats } from "../services/dataService";
import { Player } from "../types/domain/Player";
import { MmrData } from "../types/service/MmrData";
import { StatsData } from "../types/service/StatsData";
import Auth from "../components/Auth";

export default function Home() {
  const dispatch = useDispatch();

  const statsResponse = useQuery<StatsData, Error, Player[]>(
    ["stats"],
    fetchStats,
    {
      select: (data) => {
        return mapStats(data);
      },
    }
  );

  const mmrResponse = useQuery<MmrData, Error, Player[]>(
    ["simpleMmr"],
    fetchMMR,
    {
      select: (data) => {
        const players = Object.entries(data).map(
          (kvPair) =>
            ({
              name: kvPair[0],
              mmr: kvPair[1],
            } as Player)
        );
        return players;
      },
    }
  );

  useEffect(() => {
    if (!statsResponse.isLoading && statsResponse.data !== undefined) {
      dispatch(
        StatsAction.hydratePlayerStatsActionComplete(statsResponse.data)
      );
    }
  }, [statsResponse.isLoading, statsResponse.data]);

  useEffect(() => {
    if (!mmrResponse.isLoading && mmrResponse.data !== undefined) {
      dispatch(StatsAction.hydratePlayerMmrComplete(mmrResponse.data));
    }
  }, [mmrResponse.isLoading, mmrResponse.data]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#282c34",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ color: "white" }}> Welcome to Monday Night Customs Hub </h1>
      <Auth />
    </div>
  );
}
