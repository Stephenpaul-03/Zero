# How Echo works

Echo has one job: observe the active music session, turn it into a useful visual dashboard, and send supported controls back to that session.

## The basic flow

1. A compatible music player starts playing or exposes an active media session.
2. Echo connects through the selected source.
3. The native Android layer reads the current metadata, artwork, playback state, queue context, and available actions.
4. Echo converts that information into a stable track model for the interface.
5. The dashboard renders the artwork, cover flow, progress, status, and controls.
6. When you press a control, Echo sends the action back to the active media session.

## The two connection paths

### Poweramp API

Poweramp is the preferred connection. Echo uses Poweramp’s supported Android integration together with media APIs to discover the active session, read track and queue information, receive updates, and send playback commands.

### Notification / MediaSession

The fallback connection uses Android’s general media-session system. It is intended for compatible players that expose their current session through Android. Android requires Notification Access for Echo to observe those sessions.

Echo uses that access for media-session information needed by the now-playing interface. It is not intended to read unrelated notification text, messages, contacts, calls, or other personal notification content.

## What happens when the track changes

When the player changes tracks, Echo receives a native update. The state layer keeps the active item stable, refreshes the metadata and artwork, recalculates progress, and updates the available actions. The cover flow uses neighboring queue items to make the transition feel continuous rather than rebuilding the whole screen from scratch.

## Local-first behavior

The current code processes now-playing information on the device. The song itself is never decoded by Echo, and Echo does not create a second audio stream. The connected player remains the source of truth for playback.

## Connection states

Echo distinguishes between loading, permission required, disconnected, no active track, unsupported platform, and ready states. These states help explain whether the problem is the Android permission, the player, the session, or the absence of anything currently playing.
