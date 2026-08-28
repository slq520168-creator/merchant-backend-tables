#!/usr/bin/env python3
from datetime import date
from pathlib import Path
import json, random
root = Path(__file__).resolve().parents[1]
tools = json.loads((root / "data" / "tools.json").read_text(encoding="utf-8"))
pick = random.choice(tools)["name"]
meta = {"updated": date.today().isoformat(), "today": pick}
(root / "data" / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
free = [t for t in tools if t.get("free")]
sample = random.sample(free, min(10, len(free)))
hot = [{"title": t["name"]+" · "+t["desc"], "url": t["url"], "tag": t["cat"]} for t in sample]
(root / "data" / "hot.json").write_text(json.dumps(hot, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
print(meta)
