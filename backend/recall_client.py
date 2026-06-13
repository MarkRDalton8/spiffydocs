import httpx
import os
from dotenv import load_dotenv

load_dotenv()


class RecallClient:
    """Client for Recall.ai bot management"""

    def __init__(self):
        self.api_key = os.getenv("RECALLAI_API_KEY")
        self.base_url = "https://us-west-2.recall.ai/api/v1"
        self.webhook_base = os.getenv("WEBHOOK_BASE_URL")

    async def create_bot(self, meeting_url: str, bot_name: str = "SPIFFY"):
        """Create a Recall.ai bot and join meeting"""
        async with httpx.AsyncClient() as client:
            # Minimal bot creation - just join the meeting
            response = await client.post(
                f"{self.base_url}/bot",
                headers={"Authorization": f"Token {self.api_key}"},
                json={
                    "meeting_url": meeting_url,
                    "bot_name": bot_name,
                },
            )

            # Better error handling with actual Recall.ai error message
            # 200 OK and 201 Created are both success codes
            if response.status_code not in [200, 201]:
                error_detail = response.text
                try:
                    error_json = response.json()
                    error_detail = str(error_json)
                except:
                    pass
                raise Exception(f"Recall.ai error ({response.status_code}): {error_detail}")

            return response.json()

    async def remove_bot(self, bot_id: str):
        """Remove bot from meeting"""
        async with httpx.AsyncClient() as client:
            response = await client.delete(
                f"{self.base_url}/bot/{bot_id}",
                headers={"Authorization": f"Token {self.api_key}"},
            )
            response.raise_for_status()
            return response.json()

    async def get_bot_status(self, bot_id: str):
        """Get bot status"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/bot/{bot_id}",
                headers={"Authorization": f"Token {self.api_key}"},
            )
            response.raise_for_status()
            return response.json()
