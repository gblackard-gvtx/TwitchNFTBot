import youtube_dl
import sys
ydl_opts = {'outtmpl': 'clip.mp4'}
slug = sys.argv[1]
with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    ydl.download(
        [f'https://clips.twitch.tv/{sys.argv[1].strip()}'])
