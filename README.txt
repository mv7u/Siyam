SIYAM — v0.1 PERSONAL PROTOTYPE

This is the first working UI/prototype. It contains:
- Sistani Ruling 1716 fasting rules encoded as data/logic
- Hijri adjustment -2 to +2
- Today/next fast display
- Home-screen web-app manifest
- Notification permission hook

Important:
The current prototype does NOT yet send scheduled remote push notifications. That requires a hosted push endpoint/server. We will add that after the calendar logic is validated.

Source:
https://www.sistani.org/english/book/48/2299/

The app deliberately treats the calculated Hijri date as a baseline and lets the user apply an offset. The offset is not a substitute for determining the start of a lunar month.
