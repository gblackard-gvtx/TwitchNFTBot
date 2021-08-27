import youtube_dl


def download_twitch_clip(slug):
    path = 'clip.mp4'
    ydl_opts = {'outtmpl': path}
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download(
            [f'https://clips.twitch.tv/{slug.strip()}'])
    return path
