# Connections and permissions

Echo asks only for access related to the music session you choose. It does not need an account, contacts, location, camera, microphone, or access to your music files.

## Poweramp API

The Poweramp connection uses Poweramp’s supported Android integration to read the current track, artwork, playback state, queue context, and available actions. It also lets Echo send supported playback commands back to Poweramp.

Poweramp must be installed and active for this source to provide useful information. If Poweramp is not available, use the fallback source with a compatible player.

## Notification / MediaSession

The fallback connection requires Android Notification Access. Android uses this access to allow an app to observe active media sessions. Echo needs it so the dashboard can receive track information and provide controls for compatible players.

Echo does not use this access to read unrelated notification text, messages, contacts, calls, location, microphone input, or camera data. It does not record audio and does not turn Notification Access into a general notification viewer.

You can revoke Notification Access at any time in Android Settings. Revoking it stops the fallback connection until access is enabled again.

## Audio and volume

Echo may use Android audio and media-session controls to show or adjust the active player’s volume. It does not capture the audio signal and does not access the microphone.

## Data handling summary

| Information | Why Echo uses it | Current handling |
|---|---|---|
| Track title, artist, and album | Display the current track | Used on-device |
| Artwork | Display cover art and ambient background | Used on-device |
| Playback position and state | Show progress and playing status | Used on-device |
| Queue context | Populate cover flow | Used on-device |
| Media-session actions | Enable playback controls | Sent back to the active player |
| Theme and presentation settings | Remember appearance choices | Stored locally on the device |

The current implementation has no Echo server, account system, analytics service, advertising SDK, payment processor, or cloud music library. This page must be updated if a future release adds any of them or requests new permissions.

## If access stops working

Start a track, reopen Echo’s source picker, confirm the intended source is selected, and check Android Settings if the fallback permission was revoked. Reconnecting the source refreshes the native session state.
