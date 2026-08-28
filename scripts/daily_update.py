#!/usr/bin/env python3
from datetime import date
from pathlib import Path
import json
import random

root = Path(__file__).resolve().parents[1]
tools = json.loads((root / "data" / "tools.json").read_text(encoding="utf-8"))
pick = random.choice(tools)["name"]
meta = {"updated": date.today().isoformat(), "today": pick}
(root / "data" / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(meta)
