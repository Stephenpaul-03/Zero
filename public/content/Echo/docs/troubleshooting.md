# Troubleshooting

## Echo says it cannot connect

Start a track in Poweramp or another compatible media player, then confirm that Echo is using the right source. If you chose Notification / MediaSession, open Android Settings and check that Notification Access is still enabled for Echo. Return to the app and tap **Reconnect**.

## Poweramp is installed but Echo is empty

Make sure Poweramp is the app currently playing audio rather than paused with no active session. Try starting a different track, reopening Echo, or switching to the fallback media-session source.

## The fallback connection does not work

The player must expose an Android media session, and Echo must have Notification Access. Some players expose only a limited set of metadata or actions. Re-enable access if Android has revoked it, then restart the player and reconnect Echo.

## Artwork is missing

Artwork is provided by the connected media player. A player may expose metadata without artwork, may expose artwork only after the track has fully loaded, or may expose artwork in a format it cannot currently provide. Try another track or restart the player.

## Track information is incomplete

Echo can only display the fields supplied by the active session. Missing album names, artist names, queue items, or durations usually originate in the player’s metadata.

## Controls do not respond

The media player may not expose the requested action, or its session may have disconnected. Check the player’s own controls, reconnect Echo, and try again. Volume behavior can also vary by device and Android version.

## The screen turns off

Echo requests a keep-awake behavior while a connected session is active. Android battery settings, device policies, system behavior, or a lost connection can still allow the screen to sleep.

## The layout looks wrong after rotating

Echo is designed around an immersive landscape-first layout but also handles compact and portrait windows. Return to the dashboard, wait for orientation to settle, and reconnect if the controls do not return.

## When reporting a problem

Include the Android version, device model, media-player name and version, selected Echo source, whether Notification Access is enabled, and the exact behavior you saw. Do not include private notification content or personal media details in a report.
