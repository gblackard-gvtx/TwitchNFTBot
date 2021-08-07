import youtube_dl


def download_twitch_clip(slug):
    ydl_opts = {'outtmpl': 'clip.mp4'}
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download(
            [f'https://clips.twitch.tv/{slug.strip()}'])
