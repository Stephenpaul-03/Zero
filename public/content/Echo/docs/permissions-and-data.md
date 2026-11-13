# Echo Permissions and Data Practices

This page is the plain-language, in-app-friendly explanation of Echo’s Android access.

Echo asks only for access that supports its now-playing screen. The source player remains the owner of the music session; Echo does not create a separate music library.

## Notification Access (optional fallback connection)

Echo asks for Notification Access only when you choose the “Notification / MediaSession” source. Android uses this access to let Echo observe active media sessions and read the now-playing details needed to show artwork, metadata, queue context, progress, and playback controls.

Echo does not need this access to read unrelated notifications, contacts, messages, calls, location, microphone, or camera data. You can revoke it at any time in Android Settings. If it is off, the fallback connection will not work.

## Poweramp connection

When Poweramp is installed and selected, Echo uses Poweramp’s supported Android integration and media APIs to read now-playing information and send playback commands. The data is used on-device to render Echo’s interface.

## Audio and volume controls

Echo may use Android audio/session controls to display or adjust the active media session’s volume. Echo does not record audio and does not access the microphone.

## Artwork and metadata

Echo displays artwork and metadata supplied by the connected media player. Echo does not download music, upload artwork to an Echo server, or claim ownership of third-party content.

## Data handling summary

| Data or access | Why it is used | Sent to Echo servers? | User control |
|---|---|---:|---|
| Track metadata and playback state | Render the now-playing dashboard | No, based on current code | Choose or disconnect source |
| Artwork exposed by media player | Display cover art | No, based on current code | Disconnect source / uninstall |
| Queue context | Show cover flow and neighboring tracks | No, based on current code | Choose or disconnect source |
| Notification Access | Observe media sessions for fallback mode | No, based on current code | Android Settings |
| Audio/session controls | Playback and volume controls | No, based on current code | Android/media-player controls |
| Theme and App preferences | Remember local presentation choices | No | Clear App data / uninstall |

This page must be updated if a release adds analytics, crash reporting, ads, accounts, cloud sync, remote support, or new permissions.

## Troubleshooting access

If Echo cannot connect, start a track first, reopen the source picker, and confirm that the selected source is available. For the fallback connection, open Android Settings and enable Echo under Notification Access. If access is revoked, Echo can no longer observe the media session until it is enabled again.
