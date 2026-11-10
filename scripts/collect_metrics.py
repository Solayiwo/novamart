#!/usr/bin/env python3
"""Collect DevOps KPIs from the GitHub Actions run history using the GitHub CLI (gh).

Prerequisite: `gh auth login`, run from inside the cloned repository.
Output is a Markdown table you can screenshot (Figure 15) and paste into Table 11.
All values are proxies derived from pipeline runs, and should be described that way.
"""
import json
import subprocess
from datetime import datetime
from statistics import mean

FIELDS = "databaseId,conclusion,createdAt,updatedAt,headBranch,headSha,event,status"


def runs(workflow, limit=200):
    out = subprocess.run(
        ["gh", "run", "list", "--workflow", workflow, "--limit", str(limit), "--json", FIELDS],
        capture_output=True, text=True, check=True,
    ).stdout
    data = json.loads(out)
    return [r for r in data if r["status"] == "completed"]


def ts(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def minutes(a, b):
    return (ts(b) - ts(a)).total_seconds() / 60


def main():
    ci = sorted(runs("ci.yml"), key=lambda r: r["createdAt"])
    cd = sorted(runs("cd.yml"), key=lambda r: r["createdAt"])

    ci_ok = [r for r in ci if r["conclusion"] == "success"]
    ci_bad = [r for r in ci if r["conclusion"] == "failure"]
    ci_total = len(ci_ok) + len(ci_bad)

    # MTTD proxy: how long a failing push takes to be flagged by the pipeline
    mttd = mean(minutes(r["createdAt"], r["updatedAt"]) for r in ci_bad) if ci_bad else None
    avg_ci = mean(minutes(r["createdAt"], r["updatedAt"]) for r in ci_ok) if ci_ok else None

    # MTTR proxy: failed run finished -> next successful run on the same branch finished
    recoveries = []
    for bad in ci_bad:
        fixes = [g for g in ci_ok if g["headBranch"] == bad["headBranch"] and g["createdAt"] > bad["createdAt"]]
        if fixes:
            recoveries.append(minutes(bad["updatedAt"], fixes[0]["updatedAt"]))
    mttr = mean(recoveries) if recoveries else None

    # Deployment frequency: successful CD runs per week of observed activity
    cd_ok = [r for r in cd if r["conclusion"] == "success"]
    if cd_ok:
        span_days = max((ts(cd_ok[-1]["updatedAt"]) - ts(cd_ok[0]["createdAt"])).days, 1)
        df_week = len(cd_ok) / span_days * 7
    else:
        df_week = None

    # Lead time for changes: CI start (push) -> CD success for the same commit
    ci_by_sha = {r["headSha"]: r for r in ci if r["event"] == "push"}
    lead = [
        minutes(ci_by_sha[r["headSha"]]["createdAt"], r["updatedAt"])
        for r in cd_ok if r["headSha"] in ci_by_sha
    ]
    ltc = mean(lead) if lead else None

    # Change failure rate (pipeline view): failed CD runs / all CD runs
    cd_bad = [r for r in cd if r["conclusion"] == "failure"]
    cfr = len(cd_bad) / (len(cd_ok) + len(cd_bad)) * 100 if (cd_ok or cd_bad) else None

    def f(v, unit="", digits=1):
        return "n/a" if v is None else f"{v:.{digits}f}{unit}"

    print("| KPI | Value from Actions history |")
    print("|---|---|")
    print(f"| CI runs analysed (success / failure) | {len(ci_ok)} / {len(ci_bad)} (total {ci_total}) |")
    print(f"| CI failure rate | {f(len(ci_bad) / ci_total * 100 if ci_total else None, ' %')} |")
    print(f"| Average CI duration (successful runs) | {f(avg_ci, ' min')} |")
    print(f"| MTTD proxy (push to failure signal) | {f(mttd, ' min')} |")
    print(f"| MTTR proxy (failure to next green run) | {f(mttr, ' min')} |")
    print(f"| Successful deployments (CD) | {len(cd_ok)} |")
    print(f"| Deployment frequency | {f(df_week, ' per week')} |")
    print(f"| Lead time for changes (push to production, incl. approval wait) | {f(ltc, ' min')} |")
    print(f"| Change failure rate (failed CD runs) | {f(cfr, ' %')} |")


if __name__ == "__main__":
    main()
