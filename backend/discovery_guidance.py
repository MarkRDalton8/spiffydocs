# V2: Discovery guidance system
# Tracks which MEDDPICC discovery questions have been asked and nudges reps when missing

DISCOVERY_QUESTIONS = [
    {
        "id": "revenue_impact",
        "category": "Business Impact",
        "question": "How does this problem impact your revenue?",
        "why_it_matters": "Quantifies the business case and urgency",
        "trigger_topics": [
            "subscribers",
            "revenue",
            "monetization",
            "conversion",
            "churn",
            "growth",
            "traffic",
            "pageviews",
        ],
        "covered_signals": [
            "revenue impact",
            "costs us",
            "losing money",
            "worth",
            "roi",
            "return on investment",
            "business case",
        ],
        "meddpicc_letter": "M",
        "priority": "high",
    },
    {
        "id": "economic_buyer",
        "category": "Decision Process",
        "question": "Who owns the final budget decision for this?",
        "why_it_matters": "Identifies who needs to be in the room",
        "trigger_topics": [
            "budget",
            "approval",
            "sign off",
            "procurement",
            "finance",
            "legal",
            "contract",
        ],
        "covered_signals": [
            "cfo",
            "cto",
            "vp",
            "budget owner",
            "approves",
            "signs off",
            "economic buyer",
            "procurement",
        ],
        "meddpicc_letter": "E",
        "priority": "high",
    },
    {
        "id": "current_cost",
        "category": "Business Impact",
        "question": "What does this problem cost you today — in time, money, or missed opportunity?",
        "why_it_matters": "Builds urgency and justifies investment",
        "trigger_topics": [
            "manual",
            "workaround",
            "time consuming",
            "inefficient",
            "problem",
            "pain",
            "frustrated",
            "can't do",
        ],
        "covered_signals": [
            "costs us",
            "spend hours",
            "manual process",
            "workaround",
            "losing",
            "missing out",
            "can't measure",
        ],
        "meddpicc_letter": "I",
        "priority": "high",
    },
    {
        "id": "timeline_pressure",
        "category": "Timeline",
        "question": "What happens if you don't solve this by [their stated date]?",
        "why_it_matters": "Uncovers real urgency vs artificial deadlines",
        "trigger_topics": [
            "deadline",
            "renewal",
            "contract",
            "launch",
            "q1",
            "q2",
            "by end of",
            "need to have",
            "timeline",
        ],
        "covered_signals": [
            "must have by",
            "consequences",
            "at risk",
            "penalty",
            "lose the opportunity",
            "board pressure",
        ],
        "meddpicc_letter": "I",
        "priority": "high",
    },
    {
        "id": "decision_process",
        "category": "Decision Process",
        "question": "Walk me through how you make a decision like this — who else needs to be involved?",
        "why_it_matters": "Prevents late-stage surprises",
        "trigger_topics": [
            "decision",
            "evaluate",
            "rfp",
            "shortlist",
            "committee",
            "team",
            "stakeholders",
            "involved",
        ],
        "covered_signals": [
            "decision process",
            "how we decide",
            "committee",
            "everyone involved",
            "sign off from",
        ],
        "meddpicc_letter": "D",
        "priority": "high",
    },
    {
        "id": "competition",
        "category": "Competitive",
        "question": "What other solutions are you evaluating?",
        "why_it_matters": "Essential for competitive positioning",
        "trigger_topics": [
            "looking at",
            "evaluating",
            "alternatives",
            "rfp",
            "comparing",
            "other vendors",
            "market",
        ],
        "covered_signals": [
            "only looking at you",
            "shortlist",
            "also evaluating",
            "blueconic",
            "tealium",
            "competitors mentioned",
        ],
        "meddpicc_letter": "C",
        "priority": "medium",
    },
    {
        "id": "success_definition",
        "category": "Business Impact",
        "question": "What does success look like for you 6 months after go-live?",
        "why_it_matters": "Sets measurable outcomes and builds champion",
        "trigger_topics": [
            "goal",
            "target",
            "objective",
            "kpi",
            "success",
            "measure",
            "metric",
            "outcome",
        ],
        "covered_signals": [
            "success means",
            "we'd measure",
            "our goal is",
            "kpi",
            "north star",
            "what we want to see",
        ],
        "meddpicc_letter": "M",
        "priority": "medium",
    },
    {
        "id": "technical_validator",
        "category": "Stakeholders",
        "question": "Who on your technical team would need to validate the integration?",
        "why_it_matters": "Surfaces technical approvers before they block late-stage",
        "trigger_topics": [
            "engineering",
            "technical",
            "integration",
            "api",
            "developer",
            "it team",
            "architecture",
        ],
        "covered_signals": [
            "technical lead",
            "our engineer",
            "dev team",
            "it will review",
            "technical approval",
        ],
        "meddpicc_letter": "D",
        "priority": "medium",
    },
]


class DiscoveryTracker:
    """Tracks which discovery questions have been covered and generates nudges"""

    def __init__(self):
        self.covered: set[str] = set()  # question IDs covered
        self.triggered: set[str] = set()  # question IDs whose topics came up
        self.nudged: set[str] = set()  # question IDs already nudged (don't repeat)
        self.chunk_count: int = 0

    def process_chunk(self, text: str, speaker: str) -> list[dict]:
        """Process transcript chunk, return list of nudges to fire"""
        self.chunk_count += 1
        text_lower = text.lower()
        nudges = []

        for q in DISCOVERY_QUESTIONS:
            q_id = q["id"]

            # Check if question is now covered
            if q_id not in self.covered:
                if any(signal in text_lower for signal in q["covered_signals"]):
                    self.covered.add(q_id)
                    continue

            # Check if topic was triggered (but question not asked)
            if q_id not in self.covered and q_id not in self.nudged:
                topic_triggered = any(
                    topic in text_lower for topic in q["trigger_topics"]
                )
                if topic_triggered:
                    self.triggered.add(q_id)
                    # Only nudge high priority immediately on trigger
                    if q["priority"] == "high":
                        nudges.append(self._build_nudge(q, trigger_text=text))
                        self.nudged.add(q_id)

        return nudges

    def get_late_call_nudges(self, total_expected_chunks: int = 50) -> list[dict]:
        """Called at 60% mark of call - returns nudges for uncovered high-priority questions"""
        if self.chunk_count < total_expected_chunks * 0.6:
            return []

        nudges = []
        for q in DISCOVERY_QUESTIONS:
            q_id = q["id"]
            if (
                q["priority"] == "high"
                and q_id not in self.covered
                and q_id not in self.nudged
            ):
                nudges.append(self._build_nudge(q, late_call=True))
                self.nudged.add(q_id)

        return nudges

    def get_coverage_summary(self) -> dict:
        """Returns current discovery coverage state"""
        total = len(DISCOVERY_QUESTIONS)
        covered = len(self.covered)
        return {
            "covered_count": covered,
            "total_count": total,
            "coverage_pct": round(covered / total * 100) if total > 0 else 0,
            "covered_ids": list(self.covered),
            "missing_high_priority": [
                q["id"]
                for q in DISCOVERY_QUESTIONS
                if q["id"] not in self.covered and q["priority"] == "high"
            ],
        }

    def _build_nudge(
        self, q: dict, trigger_text: str = None, late_call: bool = False
    ) -> dict:
        context = ""
        if trigger_text:
            short = (
                trigger_text[:80] + "..." if len(trigger_text) > 80 else trigger_text
            )
            context = f'They mentioned: "{short}"'
        elif late_call:
            context = "You're past the halfway point — window is closing."

        return {
            "type": "discovery_nudge",
            "severity": "high" if q["priority"] == "high" else "medium",
            "question_id": q["id"],
            "category": q["category"],
            "suggested_question": q["question"],
            "why_it_matters": q["why_it_matters"],
            "context": context,
            "meddpicc_letter": q["meddpicc_letter"],
            "late_call": late_call,
        }
