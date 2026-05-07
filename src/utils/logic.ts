export function normalizeMatchData(rawData: any) {
    return rawData;
}

export function calculateFanEnergy(matchData: any): string {
    if (!matchData) return "Stable";
    const event = (matchData.lastEvent || "").toLowerCase();
    const status = (matchData.status || "").toLowerCase();
    
    if (['six', '6', 'four', '4', 'wicket', 'w'].includes(event)) {
        return "Electric";
    }
    if (status.includes("need") || status.includes("required")) {
        return "High";
    }
    return "Stable";
}

export function calculateFoodIntent(matchData: any): { probability: number; status: string; reason: string } {
    if (!matchData) return { probability: 10, status: "Low Intent", reason: "Match just started." };
    
    let probability = 30; // base probability
    const phase = (matchData.matchPhase || matchData.phase || '').toLowerCase();
    const lastEvent = (matchData.lastEvent || matchData.timeline?.[0]?.event || '').toLowerCase();
    const overStr = matchData.overs || "0";
    const overNum = parseFloat(overStr);

    // Increase for breaks
    if (phase.includes('timeout') || phase.includes('drinks') || phase.includes('break') || phase.includes('interval')) {
        probability += 30;
    }

    // Increase for end of overs like 6 (powerplay), 10, 15, 20
    if (Math.abs((overNum % 1) - 0.6) < 0.1 || [6, 10, 15, 20].includes(Math.floor(overNum))) {
        probability += 15;
    }

    // Increase for exciting events
    if (['wicket', 'w', 'six', '6', 'four', '4'].includes(lastEvent)) {
        probability += 10;
    }
    
    const isEvening = new Date().getHours() >= 17;
    if (isEvening) {
        probability += 15;
    }

    // Clamp to 100
    probability = Math.min(probability, 100);

    let status = "Low Intent";
    let reason = "Fans are engaged in the ongoing action.";

    if (probability > 75) {
        status = "High Intent Detected";
        reason = "A break or exciting moment has spiked food cravings!";
    } else if (probability > 45) {
        status = "Medium Intent";
        reason = "Match context shifting. Good time for quick bites.";
    }

    return { probability, status, reason };
}

export function recommendCombo(foodProbability: number, matchPhase: string, fanEnergy: string): { combo: string; description: string; discount: string; window: string; confidence: number } {
    let confidence = Math.min(foodProbability + 10, 100);
    const phase = matchPhase.toLowerCase();
    
    if (phase.includes('death') || parseFloat(matchPhase) > 16) {
        return {
            combo: "Death Overs Feast",
            description: "Burger Box + Fries + Mocktails",
            discount: "30% OFF",
            window: "Next 5 mins",
            confidence
        };
    }

    if (phase.includes('powerplay') || parseFloat(matchPhase) < 6) {
        return {
            combo: "Powerplay Snacks",
            description: "Nachos + Popcorn + 2 Drinks",
            discount: "20% OFF",
            window: "Next 3 mins",
            confidence
        };
    }
    
    if (phase.includes('break') || fanEnergy === "Relaxed") {
        return {
            combo: "Family Watch Pack",
            description: "4 Burgers + Fries + 4 Drinks",
            discount: "15% OFF",
            window: "Next 10 mins",
            confidence
        };
    }

    return {
        combo: "Super Over Combo",
        description: "2 Pizzas + Fries + 4 Cold Drinks",
        discount: "25% OFF",
        window: "Next 4 mins",
        confidence
    };
}

export function recommendEngagement(matchPhase: string, lastEvent: string, fanEnergy: string, statusText: string = ''): { type: string; title: string } {
    const phase = (matchPhase || "").toLowerCase();
    const event = (lastEvent || "").toLowerCase();
    const status = (statusText || "").toLowerCase();

    if (phase.includes('break') || phase.includes('interval')) {
        return { type: "Trivia Battle", title: "Trivia Battle" };
    }

    if (['wicket', 'w'].includes(event)) {
        return { type: "Predict Next Batter Score", title: "Predict Next Batter Score" };
    }
    
    if (['six', '6', 'four', '4'].includes(event)) {
        return { type: "Instant Fan Poll", title: "Instant Fan Poll" };
    }
    
    if (status.includes("need") || status.includes("required")) {
        return { type: "Final Over Predictor", title: "Final Over Predictor" };
    }

    return { type: "Quick Poll", title: "Quick Poll" };
}
