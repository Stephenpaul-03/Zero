# Echo — Tech stack

## Interface

The existing project documentation describes a React Native interface for the dashboard, cover flow, controls, themes, immersive layout, and connection states.

## Android integration

A native Android module connects to media sessions. Poweramp API is the preferred connection; Notification / MediaSession is the fallback. Available actions depend on the connected player.

## Data flow

The native layer reads metadata, artwork, playback state, queue context, and supported actions. A track model supplies the interface. UI controls send supported actions back to the active media session.

## Data handling

The documentation describes local-first behavior without an Echo account, cloud library, analytics, advertising, or music upload flow. The connected player remains responsible for audio playback.

## Version information

No source manifest is available in this workspace. Framework, dependency, and Android SDK versions have therefore not been inferred.
