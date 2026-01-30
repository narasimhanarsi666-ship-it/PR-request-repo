from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class User:
    user_id: str
    email: str | None = None
    created_at: datetime = field(default_factory=datetime.utcnow)

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "email": self.email,
            "created_at": self.created_at.isoformat(),
        }
