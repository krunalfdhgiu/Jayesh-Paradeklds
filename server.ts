import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

function cleanText(value: any) {
  return String(value || "").toLowerCase().trim();
}

function containsAnyAlias(text: string, aliases: string[]) {
  const clean = cleanText(text);
  return aliases.some(alias => clean.includes(alias.toLowerCase()));
}

function getMatchSearchText(match: any) {
  return [
    match.name,
    match.status,
    match.date,
    match.dateTimeGMT,
    match.venue,
    match.teams?.join(" "),
    match.teamInfo?.map((t: any) => t.name).join(" "),
    match.series
  ].filter(Boolean).join(" ");
}

function isTodayLsgRcbMatch(match: any) {
  const lsgAliases = ["LSG", "Lucknow Super Giants", "Lucknow"];
  const rcbAliases = [
    "RCB",
    "Royal Challengers Bengaluru",
    "Royal Challengers Bangalore",
    "Bengaluru",
    "Bangalore"
  ];

  const searchText = getMatchSearchText(match);

  const hasLSG = containsAnyAlias(searchText, lsgAliases);
  const hasRCB = containsAnyAlias(searchText, rcbAliases);

  return hasLSG && hasRCB;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.get("/api/live-match", async (req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");

    const apiKey = process.env.CRICKET_API_KEY;
    let baseUrl = process.env.CRICKET_API_BASE_URL || "https://api.cricapi.com/v1";
    if (baseUrl.includes("member.aspx") || baseUrl.includes("cricketdata.org")) {
        baseUrl = "https://api.cricapi.com/v1";
    }
    baseUrl = baseUrl.replace(/\/$/, "");
    
    const defaultResponse = {
      hasLiveMatch: false,
      message: "LSG vs RCB live moments will appear here when the match action begins.",
      matchName: "LSG vs RCB",
      teamA: "Lucknow Super Giants",
      teamB: "Royal Challengers Bengaluru",
      scoreText: "Live score coming in",
      overs: "Live update",
      wickets: "Live update",
      runRate: "Live update",
      requiredRunRate: "Live update",
      currentBatter: "Live update coming in",
      currentBowler: "Live update coming in",
      venue: "Live venue update",
      matchPhase: "Live Match",
      lastEvent: "Live Moment",
      status: "Live match action will appear here soon",
      timeline: [],
      lastBallKey: "default-state-key"
    };
    
    if (!apiKey) {
      console.error("[Cricket API] Error: CRICKET_API_KEY is not configured in the environment.");
      return res.json(defaultResponse);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
        const response = await fetch(`${baseUrl}/currentMatches?apikey=${apiKey}&offset=0`, { 
            signal: controller.signal,
            headers: {
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error(`[Cricket API] Error: HTTP ${response.status} ${response.statusText}`);
            return res.json(defaultResponse);
        }
        
        let data;
        try {
            const rawText = await response.text();
            try {
                data = JSON.parse(rawText);
            } catch (e) {
                console.error("[Cricket API] Error: Invalid JSON response received. First 500 chars:", rawText.slice(0, 500));
                return res.json(defaultResponse);
            }
        } catch (e) {
            console.error("[Cricket API] Error: Failed to read text from response.", e);
            return res.json(defaultResponse);
        }
        
        const simulatedResponse = {
            hasLiveMatch: true,
            matchName: "LSG vs RCB",
            teamA: "Lucknow Super Giants",
            teamB: "Royal Challengers Bengaluru",
            scoreText: "2nd Inning 184/3",
            overs: "18.2",
            wickets: "3",
            runRate: "10.1",
            requiredRunRate: "7.5",
            currentBatter: "KL Rahul",
            currentBowler: "Mohammed Siraj",
            venue: "M. Chinnaswamy Stadium",
            matchPhase: "In Progress",
            lastEvent: "FOUR!",
            status: "Simulated Match Data (API Limit Reached)",
            timeline: [
                { over: "18.2", event: "FOUR", description: "Driven beautifully through covers", smartAction: "Crowd goes wild" },
                { over: "18.1", event: "1", description: "Pushed to long on", smartAction: "Steady" }
            ],
            parties: [
                { id: 1, name: "Mumbai Watch Party", fans: "1.2k", energy: "High", mood: "Pizza Time", status: "Live" }
            ],
            lastBallKey: "sim-key-" + Math.floor(Date.now() / 15000)
        };

        if (data && data.status !== "success") {
             console.error(`[Cricket API] API returned failure status (${data.reason || 'unknown'}):`, data);
             const isLimitExceeded = (data.reason || '').toLowerCase().includes('limit');
             const errorResponse = isLimitExceeded ? { ...simulatedResponse, message: "Your API limit has been reached! Showing simulated data." } : { ...defaultResponse, status: `API Error: ${data.reason || 'Failed to fetch data'}` };
             return res.json(errorResponse);
        }

        if (!data || !data.data || !Array.isArray(data.data)) {
             console.error("[Cricket API] Error: Unexpected data structure:", data);
             return res.json(defaultResponse);
        }

        const matches = data.data;
        const targetDate = "2026-05-07";
        
        const lsgRcbMatches = matches.filter(isTodayLsgRcbMatch);
        let selectedMatch = null;

        if (lsgRcbMatches.length > 0) {
            selectedMatch = lsgRcbMatches.find((m: any) => m.matchStarted && !m.matchEnded);
            if (!selectedMatch) {
                selectedMatch = lsgRcbMatches.find((m: any) => cleanText(m.date).includes(targetDate));
            }
            if (!selectedMatch) {
                selectedMatch = lsgRcbMatches[0];
            }
        } else {
            console.warn(`[Cricket API] Warning: Found ${matches.length} matches, but none matched LSG vs RCB.`);
            // Sort matches to find the most recent active match to simulate for now
            const anyActiveMatch = matches.find((m: any) => m.matchStarted && !m.matchEnded);
            if (anyActiveMatch) {
              console.log("[Cricket API] Fallback: Using an alternative active match for UI mapping.", anyActiveMatch.name);
              selectedMatch = anyActiveMatch;
            } else if (matches.length > 0) {
              console.log("[Cricket API] Fallback: Using the first available match for UI mapping.", matches[0].name);
              selectedMatch = matches[0];
            }
        }

        if (!selectedMatch) {
            console.error("[Cricket API] Error: No valid match could be selected.");
            return res.json(defaultResponse);
        }
        
        const matchName = selectedMatch.name || "LSG vs RCB";
        const teamA = selectedMatch.teamInfo?.[0]?.name || "Lucknow Super Giants";
        const teamB = selectedMatch.teamInfo?.[1]?.name || "Royal Challengers Bengaluru";

        
        const scoreObj = selectedMatch.score?.[0];
        const scoreText = scoreObj ? `${scoreObj.inning} ${scoreObj.r}/${scoreObj.w}` : 'Live score coming in';
        const overs = scoreObj?.o !== undefined ? String(scoreObj.o) : 'Live update';
        const wickets = scoreObj?.w !== undefined ? String(scoreObj.w) : 'Live update';
        
        const lastEventStr = "Live Moment";
        const statusStr = selectedMatch.status || "Match ongoing";
        const lastBallKey = `${overs}-${scoreText}-${wickets}-${lastEventStr}-${statusStr}`;

        let computedMatchPhase = "In Progress";
        const statusLower = statusStr.toLowerCase();
        if (statusLower.includes("rain")) {
            computedMatchPhase = "Rain Delay";
        } else if (statusLower.includes("abandon")) {
            computedMatchPhase = "Abandoned";
        } else if (statusLower.includes("light")) {
            computedMatchPhase = "Bad Light";
        } else if (statusLower.includes("stump")) {
            computedMatchPhase = "Stumps";
        } else if (statusLower.includes("delay") || statusLower.includes("postpone")) {
            computedMatchPhase = "Delayed";
        } else if (statusLower.includes("won") || statusLower.includes("drawn") || statusLower.includes("tied")) {
            computedMatchPhase = "Match Ended";
        } else if (statusLower.includes("innings break")) {
            computedMatchPhase = "Innings Break";
        } else if (!selectedMatch.matchStarted) {
            computedMatchPhase = "Upcoming";
        } else if (selectedMatch.matchEnded) {
            computedMatchPhase = "Match Ended";
        }

        const normalizedData = {
          hasLiveMatch: true,
          matchName: matchName,
          teamA: teamA,
          teamB: teamB,
          scoreText: scoreText,
          overs: overs,
          wickets: wickets,
          runRate: selectedMatch.runRate || "Live update coming in",
          requiredRunRate: selectedMatch.reqRunRate || "Live update coming in",
          currentBatter: "Live update coming in",
          currentBowler: "Live update coming in",
          venue: selectedMatch.venue || "Live venue update",
          matchPhase: computedMatchPhase,
          lastEvent: lastEventStr,
          status: statusStr,
          timeline: [
              { over: overs !== "Live update" ? overs : "0.0", event: "UPDATE", description: statusStr, smartAction: "Fan energy stable" }
          ],
          parties: [
              { id: 1, name: "Mumbai Watch Party", fans: "1.2k", energy: "High", mood: "Pizza Time", status: "Live" },
              { id: 2, name: "College Friends Room", fans: "8", energy: "Medium", mood: "Snacking", status: "Live" },
              { id: 3, name: "Family Match Night", fans: "12", energy: "Relaxed", mood: "Dinner", status: "Live" },
              { id: 4, name: "Super Fans Arena", fans: "5.5k", energy: "Electric", mood: "Drinks", status: "Live" }
          ],
          lastBallKey: lastBallKey
        };
        
        res.json(normalizedData);
    } catch(err: any) {
        clearTimeout(timeoutId);
        return res.json(defaultResponse);
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
