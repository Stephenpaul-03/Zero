# How to use Echo

## First setup

1. Install and open Poweramp or another compatible media player.
2. Start playing a track.
3. Open Echo.
4. If Echo asks you to connect a source, open the source picker.
5. Choose **Poweramp API** for Poweramp or **Notification / MediaSession** for Android’s general fallback.
6. Complete Android’s access instructions if the fallback requires Notification Access.
7. Return to Echo and wait for the active track to appear.

## Reading the dashboard

The artwork area represents the active track. Track text and progress describe what the connected player is currently doing. The source indicator shows which connection is supplying the information. If no track is available, Echo shows a connection state instead of pretending that playback is ready.

## Browsing the queue

Swipe across the cover-flow area to move through nearby queue items. The queue is supplied by the connected player, so the number of visible neighbors and the available navigation behavior depend on that player.

Browsing the cover flow does not download or rearrange your music library. Playback actions are sent to the source player only when you use a supported control.

## Showing and hiding controls

Echo hides controls after a period of inactivity so the artwork can remain the focus. Swipe from the artwork or from a screen edge to reveal the controls again. Interacting with the dashboard keeps the controls available briefly.

Screen-reader users receive labeled controls and are not forced through the same automatic hiding behavior.

## Playback and volume

Use play or pause to control the current session. Previous, next, and seek are available only when the connected player exposes those actions. Volume controls depend on the Android device and the active media session.

## Appearance

Tap the appearance button to switch between light and dark presentation. Echo also supports system-aware styling. The theme changes the interface without changing the media player or playback session.

## When something is missing

If the screen is empty, start a track first. If a track is playing but Echo is disconnected, confirm the source selection and permission, then use **Reconnect**. If artwork or controls are missing, the media player may not expose them through its session.
