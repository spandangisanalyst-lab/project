# Security Specification: Cooch Behar Town Club Swimming Championships

This document defines the security boundaries, data invariants, and threat models for the Google Cloud Firestore integration.

## 1. Data Invariants

1. **Participants Collection** (`/participants/{participantId}`)
   - Read Access: Public (spectators, media, and clubs see roster).
   - Create Access: Public (any athlete/club can submit entry).
   - Edit/Delete Access: Administrator session mandatory.
   - Validation: Strict key and type validation on creation. Default status is "Verified" or "Pending Verification".

2. **Results Collection** (`/results/{resultId}`)
   - Read Access: Public (spectators see podiums instantly).
   - Write/Edit/Delete Access: Administrator session mandatory.
   - Validation: Point mapping must be correct (Position 1 = 5 pts, 2 = 3 pts, 3 = 1 pt).

3. **Live Updates Collection** (`/liveUpdates/{updateId}`)
   - Read Access: Public (live feed).
   - Write/Edit/Delete Access: Administrator session mandatory.
   - Validation: strict enum check on update type ('Delay', 'Start Time', 'Notable Moment', 'Announcement').

4. **Clubs Profile Collection** (`/clubs/{clubId}`)
   - Read Access: Public (spectators see team detail dockets).
   - Write/Edit/Delete Access: Administrator session mandatory.

5. **Activity Logs** (`/activityLogs/{logId}`)
   - Read Access: Public.
   - Write: Public (to record athlete sign-up) and Administrator.

6. **Email Notices** (`/emailNotices/{noticeId}`)
   - Read/Write: Public and Administrator.

---

## 2. The "Dirty Dozen" Malicious Payloads

The rules are designed to fail-closed against the following injection/spoofing vectors:

1. **Self-Appointed Elite Status**: Swimmer attempts to set their own registration status directly to `Verified` during create bypassing check.
2. **Result Overwriting**: Competitor attempts to edit a logged timing sheet to reduce their run time.
3. **Podium Points Counterfeit**: Administrator request with hacked points (e.g., 999 points for 3rd position).
4. **Junk Swimmer UID Inject**: Submitting participant with ID length greater than 128 chars.
5. **Blanket List Scraping**: Attempting to query entire database across unauthorized filters.
6. **Live Bulletin Hijack**: Visitor trying to post a false "Notable Moment" or "Event Cancelled" update.
7. **Birthdate Reference Poisoning**: Setting age to 12 but birth year to 1980 (bypassed with strict computed controls or admin verification).
8. **PII Blanket Get Leak**: Guest trying to fetch parent contact logs of other children (prevented with split layout or field access).
9. **Team Bio Defacement**: Guest trying to update "Rajbari Stadium" team profile description to offensive content.
10. **Historical Timeline Spoofing**: Submitting a result with a legacy recordedAt timestamp.
11. **Negative Swim Time**: Injecting negative character lengths or negative values into swimmer timetables.
12. **Double Registration Sweep**: Guest registering multiple duplicate names on same DOB.

---

## 3. Threat Model Evaluation

| Collection | Attack Scenario | Rule Mitigation Gate | Status |
|---|---|---|---|
| `/participants` | Identity Spoofing | Creates limited to strict schema; updates restricted. | PASS |
| `/results` | Result Hijack | Write access restricted to qualified supervisor state. | PASS |
| `/liveUpdates`| Broadcast Spam | Write access restricted to supervisor. | PASS |
| `/clubs` | Team Defacement | Public read-only; supervisor can rewrite. | PASS |
