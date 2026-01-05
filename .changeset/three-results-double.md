---
"@flagix/js-sdk": patch
---

Fixed an issue where evaluation and event tracking requests were being blocked by certain browser privacy extensions and ad-blockers. Replaced navigator.sendBeacon with fetch + keepalive to improve the delivery reliability
