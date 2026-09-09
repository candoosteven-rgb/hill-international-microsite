// Real promotional film embeds sourced from each development's own marketing
// site. Developments not listed here have no available film.
export const VIDEO_EMBEDS: Record<string, string> = {
  "farehurst-park": "https://www.youtube.com/embed/kvWEBzmX0UQ?si=DjV7OxRy_tkdJQw3",
  "lampton-parkside": "https://player.vimeo.com/video/684180992?autoplay=1&title=0&byline=0&portrait=0",
  "kew-bridge-rise": "https://player.vimeo.com/video/1095855145?autoplay=1&title=0&byline=0&portrait=0",
  "dagenham-green": "https://player.vimeo.com/video/1088308056?autoplay=1&title=0&byline=0&portrait=0",
  "knights-park": "https://player.vimeo.com/video/1098526803?h=eb4e31cebc&autoplay=1&title=0&byline=0&portrait=0",
  "cambium-square": "https://www.youtube.com/embed/acIGDd-GWxY?si=7q2zcI9rJckMCgbf",
  "mulberry-rise": "https://www.youtube.com/embed/-I0sDfdEiwA?si=CFiOxthfH2QdguFO",
  "north-gate-park": "https://www.youtube.com/embed/QWAb_lrLgoE?si=3-6gUwR4XUIcz7OV&autoplay=1",
  "millside-grange": "https://www.youtube.com/embed/-YdLm5yXB0U?si=tC3sn-jq5RLDvsKh&autoplay=1",
  "the-icon": "https://www.youtube.com/embed/F9pRw95ThAA?si=qApkAeDN0_lbzilA&autoplay=1",
  "city-reach": "https://www.youtube.com/embed/j1Oz_dZebXk?si=Wvqohzuey3VyV7sf&autoplay=1",
  hartmere: "https://www.youtube.com/embed/YUWaDCBQeyc?si=d_A5En0FcHaeKP1G&autoplay=1",
  "marleigh-park": "https://www.youtube.com/embed/hvSAtokI5gY?si=927wu3rKgUUAFd74&autoplay=1",
  "canalside-quarter": "https://www.youtube.com/embed/RXpdjepJX1k?si=i8u-2gztB1YyLwY2&autoplay=1",
  "clifton-collection": "https://www.youtube.com/embed/At2zd9YnzsM?si=dEKnh4HJBC1vSXu8&autoplay=1",
};

export function isYoutubeEmbed(url: string): boolean {
  return url.includes("youtube.com");
}

export function youtubeWatchUrl(embedUrl: string): string | null {
  const m = embedUrl.match(/\/embed\/([^?]+)/);
  return m ? `https://www.youtube.com/watch?v=${m[1]}` : null;
}
