# Echo

Echo is a fullscreen Android now-playing companion for Poweramp and compatible media players.

## What Echo does

Echo is a fullscreen Android companion for music that is already playing on your device. It shows album artwork, track metadata, playback progress, queue context, and the controls exposed by the connected media player.

Echo is not a music player, streaming service, downloader, library manager, or music store. The connected player remains responsible for playing the audio.

## How to use it

1. Open Poweramp or another compatible media player and start a track.
2. Open Echo and choose a connection source when prompted.
3. Use the artwork area to browse nearby queue items.
4. Reveal the controls by interacting with the artwork or screen edges.
5. Use play, pause, skip, seek, and volume controls when the media session supports them.

Poweramp API is the preferred source for Poweramp. Notification / MediaSession is the fallback for compatible players and requires Android Notification Access. If Echo cannot connect, confirm the player is active, the selected source is correct, and the required access is still enabled.

## Reference

- [Privacy Policy](docs/privacy-policy)
- [Terms and Conditions](docs/terms-and-conditions)
- [Permissions and Data Practices](docs/permissions-and-data)

## Project notes

The current implementation is local-first. It has no Echo account, cloud library, analytics system, advertising network, payment flow, or music upload flow. The Android native module handles media-session connections; the React Native interface renders the dashboard, cover flow, controls, themes, immersive layout, and connection states.

For development, Echo requires Node.js 22+, Java 17, Android SDK 36, and a custom development build. The main checks are `npm run typecheck`, `npm run lint`, and `npm test`.

## Disclaimer

Echo is Stephen Paul’s first project for which formal product documentation, privacy notes, and terms have been prepared. These documents may be incomplete or may not cover every situation. If you notice something missing, unclear, or inaccurate, please contact Stephen Paul at **stephenpaul4040@gmail.com**.
